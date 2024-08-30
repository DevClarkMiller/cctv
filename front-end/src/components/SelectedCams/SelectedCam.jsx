
//Icons 
import { RxCross2 } from "react-icons/rx";


const SelectedCam = ({cam, onRemoveCam}) => {
    return (
        <div className="flex justify-between">
            <p>{cam}</p>
            <button onClick={() => onRemoveCam(cam)} className="transition-all duration-300 ease-in-out hover:text-red-500"><RxCross2 /></button>
        </div>
    )
}

export default SelectedCam