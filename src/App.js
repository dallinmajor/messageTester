import React, { useEffect, useState } from 'react';
import socketIO from 'socket.io-client';

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

  const messageList = messages.map((message, index) => {
    return (
      <li key={index}>
        <b>{message.user._id}</b>: {message.text}
      </li>
    );
  });

  return (
    <>
      <h1>Hello World!</h1>
      <input
        type="text"
        placeholder="Enter a message..."
        onKeyUp={handleSubmit}
      />
      {messageList}
    </>
  );
};

export default App;
