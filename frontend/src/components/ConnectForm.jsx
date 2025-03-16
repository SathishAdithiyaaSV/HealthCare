import { useState } from 'react';
import logo from './../assets/appointments.png';

const ConnectForm = ({ connectToVideo }) => {
  const [channelName, setChannelName] = useState('');
  const [invalidInputMsg, setInvalidInputMsg] = useState('');

  const handleConnect = (e) => {
    const trimmedChannelName = channelName.trim();

    if (trimmedChannelName === '') {
      e.preventDefault();
      setInvalidInputMsg("Channel name can't be empty.");
      setChannelName('');
      return;
    }

    connectToVideo(trimmedChannelName);
  };

  return (
    <form onSubmit={handleConnect}>
      <img src={logo} className="logo w-32 h-auto mx-auto" alt="logo" />
      <div className="card bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
        <input
          id="channelName"
          type="text"
          placeholder="Channel Name"
          value={channelName}
          onChange={(e) => {
            setChannelName(e.target.value);
            setInvalidInputMsg('');
          }}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Connect
        </button>
        {invalidInputMsg && <p className="text-red-500 mt-2 text-center">{invalidInputMsg}</p>}
      </div>
    </form>
  );
};

export default ConnectForm;
