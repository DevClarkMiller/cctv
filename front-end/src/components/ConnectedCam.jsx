import { useEffect, useMemo, useRef, useState } from "react";

const ConnectedCam = ({stream}) => {
    // const { ip, data } = useMemo(() => {
    //     const keyPair = Object.entries(stream)[0]
    //     return {ip: keyPair[0], data: keyPair[1]}
    // }, [stream]);

    //State
    const [imgSrc, setImgSrc] = useState('');

    useEffect(() =>{
        const keyPair = Object.entries(stream)[0];
        const ip = keyPair[0];
        const data = keyPair[1];
        let src = 'data:image/jpeg;base64,';
        src += data;
        setImgSrc(src);
    }, [stream]);
 

    return (
        <div className="w-fit">
            <img className="rounded-lg" src={imgSrc} alt="Camera feed"></img>
        </div>
    );
}

export default ConnectedCam