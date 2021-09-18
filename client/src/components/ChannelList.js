import React from 'react';
import Channel from './Channel';

export default function ChannelList(props) {
  const { selected, channels } = props;

  const handleClick = (channel) => {
    props.onSelectChannel(channel);
  };

  return (
    <div className="channel-list">
      {channels ? (
        (channels || []).map((c) => (
          <Channel
            key={c.id}
            id={c.id}
            name={c.name}
            participants={c.participants}
            onClick={handleClick}
            selected={selected}
          />
        ))
      ) : (
        <div className="no-content-message">There are no channels to show</div>
      )}
    </div>
  );
}
