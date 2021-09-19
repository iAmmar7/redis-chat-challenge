import React from "react";
import dayjs from "dayjs";

export default function Message(props) {
  const { senderName, text, timestamp, username, id, selectedId } = props;

  return (
    <div
      id={id}
      className={`message-item ${
        senderName === username ? "message-item-own" : ""
      }`}
      style={{ border: selectedId === id ? "2px solid black" : "" }}
    >
      <div className="username">
        <b>{senderName}</b>
        <span>{dayjs(timestamp).format("D MMM, h:m A")}</span>
      </div>
      <span>{text}</span>
    </div>
  );
}
