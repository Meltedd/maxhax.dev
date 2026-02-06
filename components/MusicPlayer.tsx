'use client'

import dynamic from 'next/dynamic'
import { RHAP_UI } from 'react-h5-audio-player'
import './MusicPlayer.css'

interface MusicPlayerProps {
  src: string
  title: string
}

const AudioPlayer = dynamic(() => import('react-h5-audio-player'), {
  ssr: false,
  loading: () => <div className="music-player-placeholder">Loading player...</div>,
})

export function MusicPlayer({ src, title }: MusicPlayerProps) {
  return (
    <div className="not-prose my-[clamp(1.25rem,1.75vw,1.75rem)]">
      <div className="music-player-title">
        {title}
      </div>
      <div className="music-player-container">
        <AudioPlayer
          src={src}
          showJumpControls={false}
          customAdditionalControls={[]}
          customVolumeControls={[]}
          customProgressBarSection={[
            RHAP_UI.CURRENT_TIME,
            RHAP_UI.PROGRESS_BAR,
          ]}
          layout="horizontal-reverse"
          autoPlayAfterSrcChange={false}
        />
      </div>
    </div>
  )
}
