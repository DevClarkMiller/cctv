
//Componets
import VideoStream from "./VideoStream";

const VideoStreamWrapper = ({nmsUrl, name}) =>{
    return(
        <div className="videoStreamWrapper">
            <h2>Location: {name}</h2>
            <VideoStream url={`${nmsUrl}/live/${name}.flv`}/>
        </div>
    );
}

export default VideoStreamWrapper;