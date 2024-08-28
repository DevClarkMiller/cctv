import React, { useEffect, useRef, useState } from 'react';
import flvjs from 'flv.js';

const VideoStream = ({ url }) => {
    const videoRef = useRef(null);
    
    const [player, setPlayer] = useState(null);

    useEffect(() => {
        try{
            if (flvjs.isSupported()) {
                const flvPlayer = flvjs.createPlayer({
                    type: 'flv',
                    url: url
                });
                flvPlayer.attachMediaElement(videoRef.current);

                flvPlayer.load();
                flvPlayer.play();

                return () => {
                    flvPlayer.destroy();
                };
            }
        }catch(err){
            console.log(err);
        }
        
    }, [url]);

    return <video ref={videoRef} controls autoPlay muted/>;
};

export default VideoStream;