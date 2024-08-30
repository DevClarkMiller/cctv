import { useContext } from "react";

//Components
import SelectServer from "./SelectServer";
import CameraGroup from "./CameraGroup";
import AvailableCams from "./AvailableCams/AvailableCams";
import SelectedCams from "./SelectedCams";

//Context
import { CamContext } from "../App";

const Content = () => {
    const { selectedCams, availableCams } = useContext(CamContext);
        
    return (
        <div className="size-full flex flex-col items-start p-3">
            <SelectServer />

            <span className="flex gap-2">
                {availableCams?.length > 0 && <AvailableCams />}
                {selectedCams?.length > 0 && <SelectedCams />}
            </span>
            <CameraGroup/>
        </div>
    );
}

export default Content