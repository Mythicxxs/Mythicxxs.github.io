from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import yt_dlp, httpx, os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class VideoRequest(BaseModel):
    url: str

def get_ydl_opts():
    opts = {"quiet": True, "no_warnings": True}
    proxy = os.getenv("PROXY")
    if proxy:
        opts["proxy"] = proxy
    return opts

@app.post("/api/info")
async def get_video_info(req: VideoRequest):
    try:
        with yt_dlp.YoutubeDL(get_ydl_opts()) as ydl:
            info = ydl.extract_info(req.url, download=False)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

    formats = []
    for f in info.get("formats", []):
        formats.append({
            "format_id": f.get("format_id"),
            "ext":        f.get("ext"),
            "resolution": f.get("resolution") or (str(f.get("height")) + "p" if f.get("height") else None),
            "fps":        f.get("fps"),
            "filesize":   f.get("filesize"),
            "vcodec":     f.get("vcodec"),
            "acodec":     f.get("acodec"),
            "url":        f.get("url"),
        })

    return {
        "title":     info.get("title"),
        "thumbnail": info.get("thumbnail"),
        "duration":  info.get("duration"),
        "uploader":  info.get("uploader"),
        "formats":   formats,
    }

@app.get("/api/stream")
async def stream_proxy(url: str):
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            async with client.stream("GET", url, follow_redirects=True) as r:
                return StreamingResponse(
                    r.aiter_bytes(),
                    media_type=r.headers.get("content-type", "video/mp4"),
                    headers={"Accept-Ranges": "bytes"},
                )
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
