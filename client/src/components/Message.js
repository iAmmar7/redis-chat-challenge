import React from 'react';
import dayjs from 'dayjs';

export function Message(props) {
  const { senderName, text, timestamp, username } = props;

  return (
    <div className={`message-item ${senderName === username ? 'message-item-own' : ''}`}>
      <div className="username">
        <b>{senderName}</b>
        <span>{dayjs(timestamp).format('D MMM, h:m A')}</span>
      </div>
      <span>{text}</span>
    </div>
  );
}
