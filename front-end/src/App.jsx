import { useRef, useEffect, useState, createContext } from "react";
import io from 'socket.io-client';

//Components
import Content from "./components/Content";
import CameraGroup from './components/CameraGroup'
import Header from './components/Header';
import SelectServer from "./components/SelectServer";

//Context
export const CamContext = createContext();

function App() {
  const [user, setUser] = useState('clark');
  const [socket, setSocket] = useState(null);
  const [serverUrl, setServerUrl] = useState("");
  const [availableCams, setAvailableCams] = useState([]);

  const connectToServer = (url) =>{
    console.log(`Now trying to connect to ${serverUrl}`);

    if (serverUrl){
      let sock = io.connect(serverUrl);
      if (sock){
        setSocket(sock);  // Set socket state
        // Then connect as a user
        sock.emit('connect-viewer', user);

      }
    }
  }

  useEffect(() =>{
    if (socket){
      socket.on('available-cameras', (availableCams) =>{
        console.log(`Available cameras: ${availableCams}`);
        if (availableCams)
          setAvailableCams(availableCams)
      });
    }
  }, [socket]);

  const sendMessage = () =>{
    if (!socket) return;
    socket.emit('message', 'Hello server!');
  }

  return (
    <CamContext.Provider value={{user, setUser, serverUrl, setServerUrl, socket, setSocket, connectToServer, availableCams}}>
      <div className="App">
        <Header />
        <Content />
      </div>
    </CamContext.Provider>
  );
}

export default App;
