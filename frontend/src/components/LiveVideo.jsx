import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LocalUser,
  RemoteUser,
  useJoin,
  useLocalCameraTrack,
  useLocalMicrophoneTrack,
  usePublish,
  useRemoteAudioTracks,
  useRemoteUsers,
} from 'agora-rtc-react';

const LiveVideo = () => {
  const appId = 'cb83088f36f2417cb0f2e8677dd5913e';
  const { channelName } = useParams();

  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const navigate = useNavigate();

  useJoin(
    {
      appid: appId,
      channel: channelName,
      token: null,
    },
    activeConnection
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  audioTracks.forEach((track) => track.play());

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-4 justify-center">
        {remoteUsers.map((user) => (
          <div key={user.uid} className="remote-video-container w-64 h-48 bg-black">
            <RemoteUser user={user} />
          </div>
        ))}
      </div>

      <div className="local-video-container w-64 h-48 bg-black relative">
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={micOn}
          playVideo={cameraOn}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex gap-4 mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setMic((prev) => !prev)}
        >
          {micOn ? 'Mute Mic' : 'Unmute Mic'}
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCamera((prev) => !prev)}
        >
          {cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            setActiveConnection(false);
            navigate('/');
          }}
        >
          Disconnect
        </button>
      </div>
    </div>
  );
};

export default LiveVideo;
