
//Icons 
import { RxCross2 } from "react-icons/rx";


const SelectedCam = ({cam}) => {
    return (
        <div className="flex justify-between">
            <p>{cam}</p>
            <button className="transition-all duration-300 ease-in-out hover:text-red-500"><RxCross2 /></button>
        </div>
    )
}

export default SelectedCam