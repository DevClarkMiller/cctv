import { useRef, useEffect, useState, createContext } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import io from 'socket.io-client';

//Components
import Content from "./components/Content";
import Header from './components/Header';
import LandingPage from "./components/LandingPage";

//Context
export const CamContext = createContext();

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState('clark');
  const [socket, setSocket] = useState(null);
  const [socketLoading, setSocketLoading] = useState(false);
  const [serverUrl, setServerUrl] = useState("http://localhost:5410");
  const [availableCams, setAvailableCams] = useState([]);
  const [selectedCams, setSelectedCams] = useState([]);
  const [streamData, setStreamData] = useState(null);

  //Reducers

  

  const connectToServer = (url) =>{
    setSocketLoading(true);

    if (serverUrl){
      let sock = io.connect(serverUrl);
      if (sock){
        setSocket(sock);  // Set socket state
        // Then connect as a user
        sock.emit('connect-viewer', user);
      }
    }
  }

  const disconnectFromServer = () =>{
    socket.disconnect();
    setSocket(null);
    setAvailableCams([]);
    setSelectedCams([]);
    setStreamData([]);
    navigate('/');
  }

  const setCams = (updatedCams) =>{
    // alert("Now fetching cams 👆🤓");

    const data = {
      user: user,
      selected_streams: selectedCams
    }

    console.log(data);

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

  const onConnect = () => {
    setSocketLoading(false);
    navigate('/main');
  }

  const onSocketLoadFail = () =>{
    setSocketLoading(false);
  }

  useEffect(() =>{
    if (socket){
      socket.on('connect', onConnect);
      socket.on('available-cameras', onAvailableCams);
      socket.on('streams-feed', onStreamsFeed);
      socket.on('streams-error', onStreamsError);
      socket.on('streams-set', onStreamsFeed);  // Streams set just calls streams feed anyways
      socket.on('connect_error', onSocketLoadFail);
      socket.on('connect_timeout', onSocketLoadFail);
    }
  }, [socket]);

  return (
    <CamContext.Provider value={{user, setUser, serverUrl, setServerUrl, socket, setSocket, connectToServer, availableCams, selectedCams, setSelectedCams, streamData, setStreamData, setCams, disconnectFromServer}}>
      <Routes>
        <Route path="/*" element={
          <div className="App size-full min-h-screen flex-grow bg-[#282828]">
            <Header />
            <Content />
          </div>
        }/> 
      </Routes>
    </CamContext.Provider>
  );
}

export default App;
