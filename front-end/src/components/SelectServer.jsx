import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

//Context
import { CamContext } from "../App";

const SelectServer = () => {
    const navigate = useNavigate();

    const { serverUrl, setServerUrl, socket, connectToServer, disconnectFromServer } = useContext(CamContext);
    

    const onSubmitConnect = e =>{
        e.preventDefault();
        connectToServer();
    } 

    const onSubmitDisconnect = e =>{
        e.preventDefault();
        disconnectFromServer();
    }

    return (
        <form className="flex p-1 w-full justify-center gap-2" onSubmit={socket == null ? onSubmitConnect : onSubmitDisconnect}>
            <span className="rounded-lg border border-black p-2.5 bg-gray-900 col-flex-center">
                <label htmlFor="first_name" className="label">Cam Server URL</label>
                <input disabled={socket !== null} onChange={(e) => setServerUrl(e.target.value)} value={serverUrl} type="text" id="first_name" className="inputField" placeholder="http://localhost:3123" required />
            </span>
            <button type="submit" className="btn">Connect To Server</button>
            
        </form>
    );
}

export default SelectServer;