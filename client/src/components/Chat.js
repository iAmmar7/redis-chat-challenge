import React from 'react';
import { Redirect } from 'react-router-dom';
import socketClient from 'socket.io-client';

import ChannelList from './ChannelList';
import MessagesPanel from './MessagesPanel';
import { SERVER_URL } from '../constants';
import './chat.scss';

class Chat extends React.Component {
  state = {
    channels: null,
    socket: null,
    channel: null,
    messages: [],
    selectedId: null,
  };
  socket;

  componentDidMount() {
    this.loadChannels();
    this.loadMessages();
    this.configureSocket();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match?.params?.id !== prevProps.match?.params?.id) {
      this.loadChannels();
      this.loadMessages();

      const {
        location: { state: { username } = {} },
        match: { params: { id } = {} },
      } = this.props;
      this.socket.emit('change-channel', { username, channel: id });
    }
  }

  componentWillUnmount() {
    this.socket.disconnect();
  }

  configureSocket = () => {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;

    var socket = socketClient(SERVER_URL);

    // Emit when user joins a channel
    socket.emit('join-random', { username, channel: id });

    // Listen for server messages
    socket.on('server-message', (message) => {
      if (id === 'random')
        this.setState((prevState) => ({
          ...this.state,
          messages: [...prevState.messages, message],
        }));
    });

    // Listen for new channel messages
    socket.on(`message`, (message) => {
      this.setState((prevState) => ({
        ...this.state,
        messages: [...prevState.messages, message],
      }));
    });

    // Listen for new message channel blink
    socket.on('channel-blink', (channelName) => {
      if (channelName.channel !== this.props.match.params.id) {
        const { channels } = this.state;
        const index = channels.findIndex((chn) => chn.name === channelName.channel);
        if (index > -1) {
          channels[index] = {
            ...channels[index],
            blink: true,
          };
          this.setState({ channels });
        }
      }
    });

    socket.on('get-channels', (channels) => {
      this.setState({ channels });
    });

    this.socket = socket;
  };

  // API request to fetch channel names
  loadChannels = async () => {
    fetch(`${SERVER_URL}/api/getChannels`).then(async (response) => {
      let data = await response.json();
      this.setState({ channels: data.channels });
    });
  };

  // API request to fetch channel messages
  loadMessages = async () => {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;

    fetch(`${SERVER_URL}/api/getMessages/${username}/${id}`).then(async (response) => {
      let data = await response.json();
      this.setState({ messages: data.messages });
    });
  };

  // Change route when user selects a channel
  handleChannelSelect = (channel) => {
    const { channels } = this.state;
    const index = channels.findIndex((chn) => chn.name === channel.name);
    if (index > -1) {
      channels[index] = {
        ...channels[index],
        blink: false,
      };
      this.setState({ channels });
    }

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
    const {
      match: { params: { id } = {} },
    } = this.props;
    fetch(`${SERVER_URL}/api/search?query=${value}&channel=${id}`).then(async (response) => {
      let data = await response.json();

      if (data.response && data.response.length > 1) {
        const filteredResponse = data.response.filter((item) => item.toString().includes('message:'));
        const selectedId = filteredResponse[0].split(':')[1];
        this.setState({
          selectedId: selectedId,
        });
        const element = document.querySelector(`[id="${filteredResponse[0].split(':')[1]}"]`);

        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }

        setTimeout(() => {
          this.setState({ selectedId: null });
        }, 5000);
      }
    });
  };

  render() {
    const {
      location: { state: { username } = {} },
      match: { params: { id } = {} },
    } = this.props;
    if (!username) return <Redirect to='/' />;

    return (
      <div className='chat-app'>
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
          selectedId={this.state.selectedId}
        />
      </div>
    );
  }
}

export default Chat;
