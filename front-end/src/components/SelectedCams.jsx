import { useContext } from "react";

//Context
import { CamContext } from "../App";

const SelectedCams = () => {
    const { selectedCams, setCams, socket } = useContext(CamContext);

    return (
        <div className="bg-gray-900 text-white p-2 rounded-lg">
            <h2 className="border-b border-white pb-1">Selected Cameras</h2>
            <ul>
                {selectedCams?.map(cam => (
                    <div key={cam}>{cam}</div>
                ))}
            </ul>
            <button disabled={socket === null} onClick={setCams} className="btn !bg-gray-700 hover:!bg-gray-500 !w-full mt-3">Connect</button>
        </div>
    );
}

export default SelectedCams;