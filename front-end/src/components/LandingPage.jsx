import { useNavigate } from "react-router-dom";

//Components
import SelectServer from "./SelectServer";

//Context
import { CamContext } from "../App";

const LandingPage = () => {
    return (
        <div className="size-full col-flex-center justify-center flex-grow">
            <SelectServer />
        </div>
    );
}

export default LandingPage