import { useContext } from "react";

//Components
import SelectedCam from "./SelectedCam";

//Context
import { CamContext } from "../../App";

const SelectedCams = () => {
    const { selectedCams, setSelectedCams, setCams, socket } = useContext(CamContext);

    const onRemoveCam = (cam) =>{
        setSelectedCams((prevSelectedCams) =>{
            const updatedCams = prevSelectedCams.filter((_cam) => _cam !== cam);
            setCams(updatedCams); // Ensure setCams is called with the updated state
            console.log(updatedCams);
            return updatedCams; // Return the new state to update selectedCams
        });
    }

    return (
        <div className="bg-gray-900 text-white p-2 rounded-lg">
            <h2 className="border-b border-white pb-1 font-semibold">Selected Cameras</h2>
            <ul>
                {selectedCams?.map(cam => (
                    <SelectedCam key={cam} cam={cam} onRemoveCam={onRemoveCam} />
                ))}
            </ul>
            <button disabled={socket === null} onClick={() => setCams(selectedCams)} className="btn !bg-gray-700 hover:!bg-gray-500 !w-full mt-3">Connect</button>
        </div>
    );
}

export default SelectedCams;