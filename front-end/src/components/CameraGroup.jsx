import { useEffect, useState, useContext } from "react";

//Components
import ConnectedCam from "./ConnectedCam";

//Context
import { CamContext } from "../App";

const CameraGroup = () =>{
    const { streamData } = useContext(CamContext);

    return(
        <div className="cameraGroup w-full col-flex-center">
            <h3 className="font-semibold text-3xl">Connected cameras</h3>
            <span className="">
                {Array.isArray(streamData)&& streamData?.map((stream) =>(
                    <ConnectedCam key={stream} stream={stream}/>
                ))}
            </span>
        </div>
    );
}

export default CameraGroup;