import { useContext, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

//Components
import SelectServer from "./SelectServer";
import CameraGroup from "./CameraGroup";
import AvailableCams from "./AvailableCams/AvailableCams";
import SelectedCams from "./SelectedCams/SelectedCams";

//Pages
import LandingPage from "./LandingPage";
import DownloadFootagePage from "./DownloadFootagePage";

//Icons
import { FaDownload } from "react-icons/fa6";

//Context
import { CamContext } from "../App";

const Content = () => {
    const navigate = useNavigate();

    const { selectedCams, availableCams, socket } = useContext(CamContext);

    //Memoized values
    const showCamManagement = useMemo(() => availableCams?.length > 0, [availableCams]);
        
    return (
        <main className="content size-full flex flex-col items-center lg:items-start p-3 flex-grow">
            <Routes>
                <Route path="/" element={<LandingPage />}/>

                <Route path="/main" element={
                    <>
                        <span className="my-3 font-semibold text-2xl flex justify-between gap-3">
                            <p>Download Footage</p>
                            <button onClick={() => navigate('/footage')} className="nice-trans hover:text-blue-600"><FaDownload /></button>
                        </span>

                        {showCamManagement && <span className="camManagement flex gap-2">
                            {availableCams?.length > 0 && <AvailableCams />}
                            {selectedCams?.length > 0 && <SelectedCams />}
                        </span>}

                        {!showCamManagement && <div className="bg-gray-900 p-2 text-white rounded-lg">
                            No cams available 🔴
                        </div>}
                        
                        {showCamManagement && selectedCams?.length > 0 && <CameraGroup/>}
                    </>
                }/>

                <Route path="footage/*" element={<DownloadFootagePage />}/>
            </Routes>
        </main>
    );
}

export default Content