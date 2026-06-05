// screens/VideoBox.native.js
// 手機版專用（iOS / Android）：用 expo-video 播放。
import React from 'react';
import { useVideoPlayer, VideoView } from 'expo-video';

export default function VideoBox({ source, style }) {
  const player = useVideoPlayer(source, (p) => {
    p.loop = false;
  });

  return (
    <VideoView
      player={player}
      style={style}
      nativeControls
      contentFit="contain"
      allowsFullscreen
    />
  );
}
