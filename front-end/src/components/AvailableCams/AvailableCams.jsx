import { useContext } from "react";

//Components
import SelectCam from "./SelectCam";

//Context
import { CamContext } from "../../App";

const AvailableCams = () => {
    const { availableCams, selectedCams, setSelectedCams } = useContext(CamContext);

    return (
        <div className="availableCams bg-gray-900 text-white p-2 rounded-lg">
            <h2 className="border-b border-white pb-1">Available Cameras</h2>
            <ul>
                {availableCams?.map(cam => (
                    <SelectCam key={cam} cam={cam} />
                ))}
            </ul>
            <button disabled className="!opacity-0 btn !bg-gray-700 hover:!bg-gray-500 !w-full mt-3">Connect</button>
        </div>
    );
}

export default AvailableCams