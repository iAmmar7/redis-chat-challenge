import React from 'react';

export function Channel(props) {
  const { onClick, name, participants, selected } = props;
  const click = () => {
    onClick(props);
  };

  return (
    <div className={`channel-item ${name === selected ? 'channel-item-selected' : ''}`} onClick={click}>
      <div>{name}</div>
      <span>{participants}</span>
    </div>
  );
}
