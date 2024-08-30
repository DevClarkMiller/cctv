import { useContext, useState } from "react";

//Context
import { CamContext } from "../App";

const SelectServer = () => {
    const { serverUrl, setServerUrl, socket, setSocket, connectToServer } = useContext(CamContext);

    const onSubmitConnect = e =>{
        e.preventDefault();
        // alert(`Now connecting to ${serverUrl}`);
        connectToServer();
    } 

    const onSubmitDisconnect = e =>{
        e.preventDefault();
    }

    return (
        <form className="flex p-1 w-full justify-center gap-2" onSubmit={socket == null ? onSubmitConnect : onSubmitDisconnect}>
            <span className="rounded-lg border border-black p-2.5 bg-gray-900 col-flex-center">
                <label htmlFor="first_name" className="label">Cam Server URL</label>
                <input disabled={socket !== null} onChange={(e) => setServerUrl(e.target.value)} value={serverUrl} type="text" id="first_name" className="inputField" placeholder="http://localhost:3123" required />
            </span>
            <button disabled={socket !== null} type="submit" className="btn">Connect to server</button>
        </form>
    );
}

export default SelectServer;