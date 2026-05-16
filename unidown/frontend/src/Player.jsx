import { useEffect, useRef } from 'react'
import Plyr from 'plyr'

export default function Player({ src }) {
  const ref    = useRef(null)
  const player = useRef(null)

  useEffect(() => {
    if (player.current) player.current.destroy()
    player.current = new Plyr(ref.current, {
      controls: ['play','progress','current-time','mute','volume','fullscreen'],
    })
    return () => player.current?.destroy()
  }, [src])

  return (
    <div className="player-wrap">
      <video ref={ref} src={src} crossOrigin="anonymous" />
    </div>
  )
}
