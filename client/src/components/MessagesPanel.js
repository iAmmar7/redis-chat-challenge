import React, { useState, useRef, useEffect } from 'react';
import { Message } from './Message';

export function MessagesPanel(props) {
  const { onSendMessage, messages, username } = props;
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  const send = () => {
    if (inputValue && inputValue !== '') {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const onEnter = (event) => {
    if (event.key === 'Enter') {
      send();
    }
  };

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  let list = <div className="no-content-message">There are no messages to show</div>;
  if (messages?.length > 0) {
    list = messages.map((msg) =>
      msg?.username ? (
        <Message
          key={msg.timestamp}
          timestamp={msg.timestamp}
          senderName={msg.username}
          text={msg.message}
          username={username}
        />
      ) : (
        <div className="welcome-msg" key={Math.random()}>
          <p>{msg.message}</p>
        </div>
      )
    );
  }
  return (
    <div className="messages-panel">
      <div className="meesages-list">
        {list}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="messages-input">
        <input type="text" onChange={handleInput} onKeyPress={onEnter} value={inputValue} />
        <button onClick={send} disabled={inputValue.length < 1}>
          Send
        </button>
      </div>
    </div>
  );
}
