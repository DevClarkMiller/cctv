import { useContext } from "react";

//Icons
import { VscDebugDisconnect } from "react-icons/vsc";

//Context
import { CamContext } from "../App";

const Header = () => {
    const { socket, disconnectFromServer } = useContext(CamContext);

    return (
        <div className="w-full bg-black min-h-24 flex items-center justify-between shadow-xl px-3">
            <h1 className="text-white ml-12 text-3xl font-semibold uppercase">Stupid Simple CCTV</h1>
            {socket&&<button 
                className="text-green-500 hover:text-red-500 transition-all duration-300 ease-in-out text-3xl" 
                onClick={disconnectFromServer}
                >
                    <VscDebugDisconnect />
                </button>}
        </div>
    );
}

export default Header