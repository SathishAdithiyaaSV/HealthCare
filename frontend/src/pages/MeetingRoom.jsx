import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LiveVideo from "../components/LiveVideo";
import ConnectForm from "../components/ConnectForm";
import AgoraRTC, {
  AgoraRTCProvider,
  useRTCClient,
} from "agora-rtc-react";

const MeetingRoom = () => {
  const appId = import.meta.env.VITE_AGORA_APP_ID;
  const agoraClient = useRTCClient(AgoraRTC.createClient({ codec: "vp8", mode: "rtc" }));
  const navigate = useNavigate();

  const handleConnect = (channelName) => {
    navigate(`/meeting-room/${channelName}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Routes>
        <Route
          path=""
          element={
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-100">
              <h2 className="text-xl font-bold mb-4 text-center">Join a Meeting</h2>
              <ConnectForm connectToVideo={handleConnect} />
            </div>
          }
        />
        <Route
          path=":channelName"
          element={
            <AgoraRTCProvider client={agoraClient}>
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
                <h2 className="text-2xl font-bold mb-4">You are in the Meeting Room</h2>
                <LiveVideo />
                <div className="mt-4">
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => navigate('/meeting-room')}>
                    Leave Meeting
                  </button>
                </div>
              </div>
            </AgoraRTCProvider>
          }
        />
      </Routes>
    </div>
  );
};

export default MeetingRoom;
