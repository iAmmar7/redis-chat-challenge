import React from 'react';
import { Redirect } from 'react-router-dom';
import socketClient from 'socket.io-client';

import ChannelList from './ChannelList';
import MessagesPanel from './MessagesPanel';
import './chat.scss';

const SERVER = 'http://127.0.0.1:8080';

class Chat extends React.Component {
  state = {
    channels: null,
    socket: null,
    channel: null,
    messages: [],
  };
  socket;

  componentDidMount() {
    this.loadChannels();
    this.loadMessages();
    this.configureSocket();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match?.params?.id !== prevProps.match?.params?.id) {
      this.loadMessages();
    }
  }

  configureSocket = () => {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;

    var socket = socketClient(SERVER);

    // Emit when user joins a channel
    socket.emit('join-channel', { username, channel: id });

    // Listen for server messages
    socket.on('server-message', (message) => {
      if (id === 'random')
        this.setState((prevState) => ({
          ...this.state,
          messages: [...prevState.messages, message],
        }));
    });

    // Listen for new channel messages
    socket.on(`message:${id}`, (message) => {
      this.setState((prevState) => ({
        ...this.state,
        messages: [...prevState.messages, message],
      }));
    });

    socket.on('get-channels', (channels) => {
      this.setState({ channels });
    });

    this.socket = socket;
  };

  // API request to fetch channel names
  loadChannels = async () => {
    fetch('http://localhost:8080/api/getChannels').then(async (response) => {
      let data = await response.json();
      this.setState({ channels: data.channels });
    });
  };

  // API request to fetch channel messages
  loadMessages = async () => {
    const {
      match: { params: { id } = {} },
    } = this.props;

    fetch(`http://localhost:8080/api/getMessages/${id}`).then(async (response) => {
      let data = await response.json();
      this.setState({ messages: data.messages });
    });
  };

  // Change route when user selects a channel
  handleChannelSelect = (channel) => {
    this.props.history.push({
      pathname: '/chat/' + channel.name,
      state: { ...this.props.location.state },
    });
  };

  // Chat message send via socket
  handleSendMessage = (text) => {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;
    this.socket.emit('send-message', { channel: id, username, message: text });
  };

  handleAddChannel = (channel) => {
    this.socket.emit('add-channel', { newChannel: channel });
  };

  handleSearch = (value) => {
    fetch(`http://localhost:8080/api/search?query=${value}`).then(async (response) => {
      let data = await response.json();
      console.log('handleSearhc', data);
    });
  };

  render() {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;
    if (!username) return <Redirect to="/" />;

    return (
      <div className="chat-app">
        <ChannelList
          channels={this.state.channels}
          selected={id}
          onSelectChannel={this.handleChannelSelect}
          onAddChannel={this.handleAddChannel}
        />
        <MessagesPanel
          onSendMessage={this.handleSendMessage}
          messages={this.state.messages}
          username={username}
          handleSearch={this.handleSearch}
        />
      </div>
    );
  }
}

export default Chat;
