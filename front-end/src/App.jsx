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
  const [serverUrl, setServerUrl] = useState("http://localhost:5410");
  const [availableCams, setAvailableCams] = useState([]);
  const [selectedCams, setSelectedCams] = useState([]);
  const [streamData, setStreamData] = useState(null);

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

  const setCams = () =>{
    // alert("Now fetching cams 👆🤓");

    const data = {
      user: user,
      selected_streams: selectedCams
    }

    socket.emit('select-streams', data);
  }

  const onAvailableCams = availableCams =>{
    console.log(`Available cameras: ${availableCams}`);
    if (availableCams)
      setAvailableCams(availableCams)
  }

  const onStreamsFeed = streams =>{
    if (streams?.length < 0) return console.error("Something went wrong while retrieving stream data!");

    setStreamData(streams);

    socket.emit('fetch-streams', user);
  }

  const onStreamsError = msg =>{
    console.error(msg);
  }

  const onStreamsSet = msg => {
    socket.emit('streams-feed', user);
  }

  useEffect(() =>{
    if (socket){
      socket.on('available-cameras', onAvailableCams);
      socket.on('streams-feed', onStreamsFeed);
      socket.on('streams-error', onStreamsError);
      socket.on('streams-set', onStreamsFeed);
    }
  }, [socket]);

  const sendMessage = () =>{
    if (!socket) return;
    socket.emit('message', 'Hello server!');
  }

  return (
    <CamContext.Provider value={{user, setUser, serverUrl, setServerUrl, socket, setSocket, connectToServer, availableCams, selectedCams, setSelectedCams, streamData, setStreamData, setCams}}>
      <div className="App">
        <Header />
        <Content />
      </div>
    </CamContext.Provider>
  );
}

export default App;
