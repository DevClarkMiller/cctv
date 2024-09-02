import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LabelDate = ({children, value, onChange}) =>{
    return(
        <span className='col-flex-center text-white'>
            <label className=' font-semibold text-xl'>{children}</label>
            <input value={value} onChange={onChange} className='rounded p-1 bg-[#3f3f3f]' type='datetime-local'></input>
        </span>
    );
}


const SetCamRange = ({addFootage, dispatchAddFootage, addCamRange}) => {
    const { ip } = useParams();

    const [start, setStart] = useState("");
    const [end, setEnd] = useState("");

    const submit = () =>{
        if (!start || !end) return;
        addCamRange(ip, start, end);
    }

    return(
        <div className="col-flex-center gap-3">
            <LabelDate value={start} onChange={(e) => setStart(e.target.value)}>Start</LabelDate>
            <LabelDate value={end} onChange={(e) => setEnd(e.target.value)}>End</LabelDate>
            <button onClick={submit} type="button" className="btn">Submit</button>
        </div>
    );
}

export default SetCamRange