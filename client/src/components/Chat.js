import React from 'react';
import { Redirect } from 'react-router-dom';
import socketClient from 'socket.io-client';

import { ChannelList } from './ChannelList';
import './chat.scss';
import { MessagesPanel } from './MessagesPanel';

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

    socket.emit('join-channel', { username, channel: id });

    socket.on('server-message', (message) => {
      if (id === 'random')
        this.setState((prevState) => ({
          ...this.state,
          messages: [...prevState.messages, message],
        }));
    });

    socket.on(`message:${id}`, (message) => {
      this.setState((prevState) => ({
        ...this.state,
        messages: [...prevState.messages, message],
      }));
    });

    // socket.on('connection', () => {
    //   if (this.state.channel) {
    //     this.handleChannelSelect(this.state.channel.id);
    //   }
    // });

    // socket.on('channel', (channel) => {
    //   let channels = this.state.channels;
    //   channels.forEach((c) => {
    //     if (c.id === channel.id) {
    //       c.participants = channel.participants;
    //     }
    //   });
    //   this.setState({ channels });
    // });

    this.socket = socket;
  };

  loadChannels = async () => {
    fetch('http://localhost:8080/api/getChannels').then(async (response) => {
      let data = await response.json();
      this.setState({ channels: data.channels });
    });
  };

  loadMessages = async () => {
    const {
      match: { params: { id } = {} },
    } = this.props;

    fetch(`http://localhost:8080/api/getMessages/${id}`).then(async (response) => {
      let data = await response.json();
      this.setState({ messages: data.messages });
    });
  };

  handleChannelSelect = (channel) => {
    this.props.history.push({ pathname: '/chat/' + channel.name, state: { ...this.props.location.state } });
  };

  handleSendMessage = (text) => {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;
    this.socket.emit('send-message', { channel: id, username, message: text });
  };

  render() {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;
    if (!username) return <Redirect to="/" />;

    return (
      <div className="chat-app">
        <ChannelList channels={this.state.channels} selected={id} onSelectChannel={this.handleChannelSelect} />
        <MessagesPanel onSendMessage={this.handleSendMessage} messages={this.state.messages} username={username} />
      </div>
    );
  }
}

export default Chat;
