import React from 'react';

export default function Channel(props) {
  const { onClick, name, participants, selected, blink } = props;
  const click = () => {
    onClick(props);
  };

  return (
    <div className={`channel-item ${name === selected ? 'channel-item-selected' : ''}`} onClick={click}>
      <div className="channel-title">
        <p>{name}</p>
        {blink && <p className="star">*</p>}
      </div>
      <span>{participants}</span>
    </div>
  );
}
