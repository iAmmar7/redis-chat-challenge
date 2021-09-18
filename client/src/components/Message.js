import React from 'react';
import dayjs from 'dayjs';

export function Message(props) {
  const { senderName, text, timestamp } = props;

  console.log('Message', props);

  return (
    <div className="message-item">
      <div className="username">
        <b>{senderName}</b>
        <span>{dayjs(timestamp).format('D MMM, h:m A')}</span>
      </div>
      <span>{text}</span>
    </div>
  );
}
