import React, { useState } from "react";

function AddChannel({ onAddChannel }) {
  const [channelInput, setChannelInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddChannel(channelInput);
    setChannelInput("");
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="channel-input">
        <input
          name="add-channel"
          placeholder="New Channel"
          onChange={(e) => setChannelInput(e.target.value)}
          value={channelInput}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default AddChannel;
