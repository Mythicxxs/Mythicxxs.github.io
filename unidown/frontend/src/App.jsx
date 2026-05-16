import { useState } from 'react'
import Player from './Player'

export default function App() {
  const [url, setUrl]             = useState('')
  const [info, setInfo]           = useState(null)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [streamUrl, setStreamUrl] = useState('')

  async function handleFetch() {
    if (!url.trim()) return
    setLoading(true)
    setError('')
    setInfo(null)
    try {
      const res = await fetch('http://localhost:8000/api/info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      if (!res.ok) throw new Error((await res.json()).detail)
      const data = await res.json()
      setInfo(data)
      const best = data.formats
        .filter(f => f.ext === 'mp4' && f.vcodec !== 'none')
        .sort((a, b) => (b.filesize || 0) - (a.filesize || 0))[0]
      if (best) setStreamUrl(
        `http://localhost:8000/api/stream?url=${encodeURIComponent(best.url)}`
      )
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const videoFormats = info?.formats.filter(
    f => f.ext === 'mp4' && f.vcodec !== 'none'
  ) ?? []
  const audioFormats = info?.formats.filter(
    f => f.vcodec === 'none' && ['mp3','m4a','opus','webm'].includes(f.ext)
  ).slice(0, 4) ?? []

  return (
    <div className="app">
      <header>
        <h1>🎬 UniDown</h1>
        <p>Paste any video URL to stream or download</p>
      </header>

      <div className="input-row">
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleFetch()}
          placeholder="https://youtube.com/watch?v=..."
        />
        <button onClick={handleFetch} disabled={loading}>
          {loading ? 'Analyzing…' : 'Fetch'}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {info && (
        <div className="result">
          <div className="meta">
            <img src={info.thumbnail} alt="thumbnail" />
            <div>
              <h2>{info.title}</h2>
              <p>{info.uploader} · {Math.floor(info.duration / 60)}m {info.duration % 60}s</p>
            </div>
          </div>

          {streamUrl && <Player src={streamUrl} />}

          <div className="formats">
            <section>
              <h3>📹 Video (MP4)</h3>
              {videoFormats.map(f => (
                <button
                  key={f.format_id}
                  onClick={() => setStreamUrl(
                    `http://localhost:8000/api/stream?url=${encodeURIComponent(f.url)}`
                  )}
                >
                  {f.resolution ?? 'unknown'} {f.fps ? `${f.fps}fps` : ''}
                  {f.filesize ? ` · ${(f.filesize / 1e6).toFixed(0)} MB` : ''}
                </button>
              ))}
            </section>

            <section>
              <h3>🎵 Audio only</h3>
              {audioFormats.map(f => (
                <a key={f.format_id} href={f.url} target="_blank" rel="noreferrer">
                  {f.ext.toUpperCase()} · {f.acodec}
                </a>
              ))}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
