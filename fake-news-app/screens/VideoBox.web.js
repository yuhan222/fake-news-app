// screens/VideoBox.web.js
// 網頁版專用：直接用瀏覽器內建的 <video> 播放器，完全不依賴 expo-video，
// 所以不會再出現 SharedObject 那個錯誤。
import React from 'react';
import { Asset } from 'expo-asset';

export default function VideoBox({ source }) {
  // source 可能是 require(...) 進來的本地檔，也可能是 { uri: '網址' }
  let uri = '';
  try {
    if (source && typeof source === 'object' && source.uri) {
      uri = source.uri;
    } else if (source != null) {
      uri = Asset.fromModule(source).uri;
    }
  } catch (e) {
    uri = '';
  }

  return (
    <video
      src={uri}
      controls
      playsInline
      style={{
        width: '100%',
        height: 150,
        backgroundColor: '#000000',
        display: 'block',
        objectFit: 'contain',
      }}
    />
  );
}
