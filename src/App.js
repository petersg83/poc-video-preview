import React, { useState, useEffect, useRef } from 'react';
import VideoThumbnail from 'react-video-thumbnail';

const HEIGTH = 80;
const WIDTH = 120;
const maxImages = 3;

function App() {
  let [imgSrc, setImgSrc] = useState('');
  let [snapshotAtTime, setSnapshotAtTime] = useState();
  let [url, setUrl] = useState('');
  let [urlInput, setUrlInput]= useState('');
  let videoRef = useRef();
  let refs = useRef({
    index: 0,
    thumbnails: []
  });

  useEffect(() => {
    const nextImageInterval = setInterval(() => {
      if (refs.current.thumbnails.length >= maxImages) {
        setImgSrc(refs.current.thumbnails[refs.current.index % refs.current.thumbnails.length] || '');
        refs.current.index += 1;
      }
    }, 1000);
    return () => {
      clearInterval(nextImageInterval);
    }
  }, [])

  const onLoadedMetada = () => {
    if (videoRef.current.duration) {
      setSnapshotAtTime(Math.round(videoRef.current.duration / (maxImages + 1) * (refs.current.thumbnails.length + 1)));
    }
  }

  const changeUrl = () => {
    setUrl(urlInput);
    refs.current.thumbnails = [];
    refs.current.index = 0;
  }

  const loading = !!(videoRef.current && videoRef.current.duration && refs.current.thumbnails.length < maxImages);

  return (
    <div>
      <p><b>url example:</b> https://test-video-preview-strapi.s3.us-east-2.amazonaws.com/short.mp4</p>
      <input type="text" placeholder="Paste video url here" onChange={(e) => setUrlInput(e.target.value)} value={urlInput} />
      <button type="button" onClick={changeUrl} disabled={loading}>{loading ? "Generating..." : "Generate Preview"}</button>

      <div style={{ width: WIDTH, height: HEIGTH }}>
        <img src={imgSrc} alt="" />
      </div>

      <div style={{ visibility: "hidden"}}>
        <video
          ref={videoRef}
          src={url}
          type="video/mp4"
          preload="metadata"
          onLoadedMetadata={onLoadedMetada}
          visibility="hidden"
        />
        {snapshotAtTime && <VideoThumbnail
            videoUrl={url}
            key={snapshotAtTime}
            snapshotAtTime={snapshotAtTime}
            thumbnailHandler={((thumbnail) => {
              refs.current.thumbnails.push(thumbnail);
              if (refs.current.thumbnails.length < maxImages) {
                setSnapshotAtTime(Math.round(videoRef.current.duration / (maxImages + 1) * (refs.current.thumbnails.length + 1)));
                console.log(videoRef.current.duration / (maxImages + 1) * (refs.current.thumbnails.length + 1));
              } else {
                setSnapshotAtTime(0);
              }
            })}
            width={WIDTH}
            height={HEIGTH}
          />}
      </div>
    </div>
  );
}

export default App;
