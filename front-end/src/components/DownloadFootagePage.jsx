import { useState, useReducer, useContext, useEffect } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import { INITIAL_STATE, ACTIONS, footageReducer } from '../Reducers/footageReducer';

//Context
import { CamContext } from '../App';
import SetCamRange from './SetCamRange';

const CamsList = ({camIps}) =>{
    return (
        <ul>
            {camIps?.map((ip) =>(
                <li className='nice-trans hover:cursor-pointer text-green-500 hover:text-blue-600' key={ip}><Link to={`setCam/${ip}`}>{ip}</Link></li>
            ))}
        </ul>
    );
}

const CamsListDeletable = ({addFootage}) =>{
    useEffect(() => console.log(addFootage) , [addFootage]);

    return(
        <ul>
            {Object.keys(addFootage)?.map((ip) =>(
                <li className='nice-trans hover:cursor-pointer text-green-500 hover:text-blue-600' key={ip}><Link to={`setCam/${ip}`}>{ip}</Link></li>
            ))}
        </ul>
    );
}

const DownloadFootagePage = () => {
    const navigate = useNavigate();
    const convertTime = (date) =>{ return Math.floor(new Date(date).getTime() / 1000); }

    const { serverUrl } = useContext(CamContext);

    //State
    const [camIps, setCamIps] = useState(null);

    // Reducers
    const [addFootage, dispatchAddFootage] = useReducer(footageReducer, INITIAL_STATE);

    const addCamRange = (camIp, start, end) =>{
        dispatchAddFootage({
            type: ACTIONS.ADD_CAM,
            camIp: camIp,
            start: convertTime(start),
            end: convertTime(end)
        });

        navigate('/footage');
    }

    useEffect(() => console.log(addFootage), [addFootage]);

    const getVideo = async () =>{
        // Data is an array of ips with the specified time stamps
        const data = []
        
        try{
            const footage = axios.post();
        }catch(err){
            console.error(err);
        }
    }

    const getArchivedCams = async () => {
        try{
            const response = await axios.get(`${serverUrl}/getFootageIps`);
            if (!response) return;

            const data = response.data;
            setCamIps(data)
        }catch(err){
            console.error(err);
        }
    }

    useEffect(() =>{
        getArchivedCams();
    }, []);

    const onSubmit = async e =>{
        e.preventDefault();

        try{
            const footage = await axios.post(`${serverUrl}/createFootageVid`, addFootage, { headers: {
                'Content-Type': 'application/json'
            }});
        }catch(err){
            console.error(err);
        }
    }
    
    return (
        <form className="size-full flex-grow col-flex-center justify-center gap-1" onSubmit={onSubmit}>
            <Routes>
                <Route path='/' element={
                    <span className='col-flex-center justify-center gap-1'>
                        <div className='text-white font-semibold rounded border border-gray-600 p-2 w-full'>
                            <h2 className='border-b border-white pb-1'>Available Cams</h2>
                            <CamsList camIps={camIps}/>
                        </div>
                        {Object.keys(addFootage)?.length > 0 && <div className='text-white font-semibold rounded border border-gray-600 p-2 w-full'> 
                            <h2 className='border-b border-white pb-1'>Requested Cams</h2>
                            <CamsListDeletable addFootage={addFootage}/>
                        </div>}
                        <button className='btn' type='submit'>Download Footage</button>
                    </span>
                }/>
                <Route path='/setCam/:ip' element={<SetCamRange addFootage={addFootage} dispatchAddFootage={dispatchAddFootage} addCamRange={addCamRange}/>} />
            </Routes>
        </form>
    );
}

export default DownloadFootagePage