import React, { useState } from "react";

function AddChannel({ onAddChannel }) {
  const [channelInput, setChannelInput] = useState("");

  const handleClick = () => {
    onAddChannel(channelInput);
    setChannelInput("");
  };
  return (
    <div className="channel-input">
      <input
        name="add-channel"
        placeholder="New Channel"
        onChange={(e) => setChannelInput(e.target.value)}
        value={channelInput}
      />
      <button onClick={handleClick}>Add</button>
    </div>
  );
}

export default AddChannel;
