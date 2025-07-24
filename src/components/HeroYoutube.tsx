import { useState } from 'react';

const HeroYouTube = ({ videoUrl, mute, className, autoPlay }: { videoUrl: string, mute: boolean, className: string, autoPlay: boolean }) => {
  const [url] = useState(videoUrl);

  const getYouTubeId = (link: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    const match = link.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeId(url);

  return (
    <div>
      {videoId && (
        <div>
          <iframe
            width="100%"
            // height="500"
            className={className}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&playlist=${videoId}&mute=${mute ? 1 : 0}`}
            
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default HeroYouTube;
