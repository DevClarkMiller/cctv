import { useRef, useEffect, useState } from "react";

//Components
import CameraGroup from './components/CameraGroup'

function App() {
  return (
    <div className="App">
      <h1>MAL-HOUSE CCTV</h1>
        <CameraGroup nmsUrl={"http://99.243.100.75:8000"}/>
    </div>
  );
}

export default App;
