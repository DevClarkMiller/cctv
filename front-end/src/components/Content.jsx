import { useContext, useMemo } from "react";

//Components
import SelectServer from "./SelectServer";
import CameraGroup from "./CameraGroup";
import AvailableCams from "./AvailableCams/AvailableCams";
import SelectedCams from "./SelectedCams/SelectedCams";

//Context
import { CamContext } from "../App";

const Content = () => {
    const { selectedCams, availableCams, socket } = useContext(CamContext);

    //Memoized values
    const showCamManagement = useMemo(() => availableCams?.length > 0, [availableCams]);
        
    return (
        <div className="size-full flex flex-col items-center lg:items-start p-3">
            <SelectServer />

            {showCamManagement && <span className="camManagement flex gap-2">
                {availableCams?.length > 0 && <AvailableCams />}
                {selectedCams?.length > 0 && <SelectedCams />}
            </span>}

            {!showCamManagement && <div className="bg-gray-900 p-2 text-white rounded-lg">
                No cams available 🔴
            </div>}
            
            
            
            {availableCams?.length > 0 && <CameraGroup/>}
        </div>
    );
}

export default Content