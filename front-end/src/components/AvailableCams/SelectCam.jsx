import { useContext, useEffect } from "react";

//Context
import { CamContext } from "../../App";

const SelectCam = ({cam}) => {
    const { selectedCams, setSelectedCams } = useContext(CamContext);

    const handleCheck = (cam) =>{
        if (!selectedCams.includes(cam)){
            setSelectedCams([...selectedCams, cam]);
        }else{
            setSelectedCams(selectedCams.filter(selectedCam => selectedCam !== cam));
        }
    }

    return(
        <li className="flex justify-between">
            <p>{cam}</p>
            <input checked={selectedCams?.includes(cam)} onChange={() => handleCheck(cam)} type="checkbox"></input>
        </li>
    );
}

export default SelectCam;