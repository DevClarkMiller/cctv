import { useContext, useState } from "react";

//Context
import { CamContext } from "../App";

const SelectServer = () => {
    const { serverUrl, setServerUrl, socket, setSocket, connectToServer } = useContext(CamContext);

    const onSubmit = e =>{
        e.preventDefault();
        // alert(`Now connecting to ${serverUrl}`);
        connectToServer();
    } 

    return (
        <form className="flex p-1" onSubmit={onSubmit}>
            <span className="rounded-lg border border-black p-2.5 bg-gray-900">
                <label htmlFor="first_name" className="label">Cam Server URL</label>
                <input onChange={(e) => setServerUrl(e.target.value)} value={serverUrl} type="text" id="first_name" className="inputField" placeholder="http://localhost:3123" required />
            </span>
            <button type="submit" className="btn">Connect to server</button>
        </form>
    );
}

export default SelectServer;