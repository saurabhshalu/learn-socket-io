import React, { useState, useEffect, useRef } from 'react';

const App = ({ socket }) => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log(`You are connected with Id: ${socket.id}`);
    });
    socket.on('receive-message', (messageObject) => {
      console.log(messageObject);
      setMessages((old) => [...old, messageObject]);
    });
  }, [socket]);

  const [roomId, setRoomId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const joinRoom = () => {
    socket.emit('join-room', roomId);
  };
  const sendMessage = () => {
    setMessages((oldMessages) => [
      ...oldMessages,
      { id: socket.id, message: message },
    ]);
    socket.emit('send-message', message, roomId);
    setMessage('');
  };

  const messageEl = useRef(null);
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }
  }, []);

  return (
    <div style={{ margin: 10 }}>
      <div
        style={{ width: 300, display: 'flex', justifyContent: 'space-between' }}
      >
        <input
          type='text'
          placeholder='room'
          value={roomId}
          style={{ width: 240 }}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={joinRoom}>JOIN</button>
      </div>
      <div
        ref={messageEl}
        style={{
          border: '1px solid red',
          width: 300,
          height: 200,
          marginTop: 10,
          marginBottom: 10,
          overflowY: 'scroll',
        }}
      >
        {messages.map((item, index) => (
          <div key={index}>{item.message}</div>
        ))}
      </div>
      <div
        style={{ width: 300, display: 'flex', justifyContent: 'space-between' }}
      >
        <input
          type='text'
          placeholder='type message'
          value={message}
          style={{ width: 240 }}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;
