import React, { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';
import './App.css';

const socket = socketIO('http://localhost:5000/', {
  transports: ['websocket'],
  jsonp: false
});

socket.connect();

socket.on('connect', () => {
  console.log('connected to socket server');
});

const App = () => {
  const [messages, setMessages] = useState([]);
  const [chatroomId, setChatroomId] = useState();
  const [senderId, setSenderId] = useState();
  const [recieverId, setRecieverId] = useState();
  const [socketListening, setSocketListening] = useState(false);

  const chatRoom = 1;

  useEffect(() => {
    socket.on('privateMessage', message => {
      console.log(message);
      setMessages([message, ...messages]);
    });

    return () => {
      socket.removeAllListeners('privateMessage');
    };
  }, [messages]);


  const handleSubmit = event => {
    const body = event.target.value;
    if (event.keyCode === 13 && body) {
      const message = {
        text: body,
        user: {
          _id: 24601
        },
        createdAt: new Date(),
        _id: Math.floor(Math.random() * 1000000 + 1)
      };
      setMessages([message, ...messages]);
      socket.emit('message', {
        message,
        room: chatRoom
      });
      event.target.value = '';
    }
  };

  function listenForMessages() {
    socket.on('private_message_' + recieverId, message => {
      console.log(message);
      setMessages([message, ...messages]);
    });
    setSocketListening(true);
  }

  function handleChatroomInput(e) {
    const value = e.target.value;
    setChatroomId(value);
  }

  function handleSenderIdInput(e) {
    const value = e.target.value;
    setSenderId(value);
  }

  function handleRecieverIdInput(e) {
    const value = e.target.value;
    if (e.keyCode === 13 && value) {
      listenForMessages();
    } else {
      setRecieverId(value);
    }
  }

  const messageList = messages.map((message, index) => {
    return (
      <li key={index}>
        <b>{message.user._id}</b>: {message.text}
      </li>
    );
  });

  return (
    <div className='container'>
      <h1>Hello World!</h1>
      <div>Enter Chatroom Id</div>
      <input
        type="text"
        placeholder="Chatroom"
        value={chatroomId}
        onChange={handleChatroomInput}
      />
      <br/><br/>
      <div>Socket {socketListening ? 'ON' : 'OFF'}</div>
     <div>give Agent Id to initialize Socket</div>
      <input
        type="text"
        placeholder="Enter Id"
        value={recieverId}
        onKeyUp={handleRecieverIdInput}
      />
      <br/><br/>
     <div>Agent id</div>
      <input
        type="text"
        placeholder="Enter Id"
        value={senderId}
        onKeyUp={handleSenderIdInput}
      />
      <br/><br/>
      <input
        type="text"
        placeholder="Enter a message..."
        onKeyUp={handleSubmit}
      />
      <br/>
      <br/>
      <br/>
      {messageList}
    </div>
  );
};

export default App;
