import VideoStream from "./VideoStream"
import axios from "axios";
import { useEffect, useState } from "react";
import VideoStreamWrapper from "./VideoStreamWrapper";

const CameraGroup = ({nmsUrl}) =>{
    const [currentStreams, setCurrentStreams] = useState(null);


    const getActiveStreams = async () => {
        if(nmsUrl){
            try {
                const response = await axios.get(`${nmsUrl}/api/streams`);
                const streams = response.data;
                return streams.live;
              } catch (error) {
                console.error('Error fetching active streams:', error);
            }
        }
    };

    useEffect(() =>{

        const getStreams = async () =>{
            let streamsArray = [];
            const streams = await getActiveStreams();
            if(streams){
                Object.keys(streams).forEach((streamName)=>{
                    streamsArray.push(streamName);
                });
                setCurrentStreams(streamsArray);
            }
        }
        getStreams()
       
    },[nmsUrl]);

    return(
        <div className="cameraGroup">
            {
                currentStreams && currentStreams.map((item) =>{
                    return(
                        <VideoStreamWrapper key={currentStreams.indexOf(item)} nmsUrl={nmsUrl} name={item}/>
                    )
                })
            }
        </div>
    );
}

export default CameraGroup;