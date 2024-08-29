import { useContext } from "react";

//Context
import { CamContext } from "../App";

const AvailableCams = () => {
    const {availableCams} = useContext(CamContext);

    return (
        <div className="availableCams">
            {availableCams?.map(cam => (
                <div key={cam}>{cam}</div>
            ))}
        </div>
    );
}

export default AvailableCams