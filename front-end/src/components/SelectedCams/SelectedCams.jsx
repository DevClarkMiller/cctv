import { useContext } from "react";

//Components
import SelectedCam from "./SelectedCam";

//Context
import { CamContext } from "../../App";

const SelectedCams = () => {
    const { selectedCams, setCams, socket } = useContext(CamContext);

    return (
        <div className="bg-gray-900 text-white p-2 rounded-lg">
            <h2 className="border-b border-white pb-1 font-semibold">Selected Cameras</h2>
            <ul>
                {selectedCams?.map(cam => (
                    <SelectedCam key={cam} cam={cam}/>
                ))}
            </ul>
            <button disabled={socket === null} onClick={setCams} className="btn !bg-gray-700 hover:!bg-gray-500 !w-full mt-3">Connect</button>
        </div>
    );
}

export default SelectedCams;