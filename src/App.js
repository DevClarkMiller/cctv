import { useRef, useEffect, useState } from "react";
import CameraGroup from './CameraGroup'

function App() {
  return (
    <div className="App">
      <h1>MAL-HOUSE CCTV</h1>
        <CameraGroup nmsUrl={"http://10.0.0.182:8000"}/>
    </div>
  );
}

export default App;
