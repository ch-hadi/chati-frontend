import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState(1);
  const [socket, setSocket] = useState(null);  // State to store the socket instance

  const handleSendMessage = () => {
    if (newMessage === '') {
      return alert('Empty message not allowed!');
    }

    setMessages([
      ...messages,
      { content: newMessage, isSender: false },
    ]);

    // Check if socket is available before emitting
    if (socket) {
      socket.emit('chat message', { content: newMessage, userId });
    }

    setNewMessage('');
  };

  const handleInput = (e) => {
    setNewMessage(e.target.value);
  };

  useEffect(() => {
    const getUser = () => Math.floor(Math.random() * 10);
    const generatedUserId = getUser();
    setUserId(1);

    const newSocket = io('http://localhost:4000', {
      auth: {
        userId: 1,
      },
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('chat message', (message) => {
      setMessages([...messages, message]);
    });

    // Set the socket instance in the state
    setSocket(newSocket);

    return () => {
      // Clean up the socket connection when the component unmounts
      newSocket.disconnect();
    };
  }, [messages]);

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <ul className="message-list">
        {messages.map((message, index) => (
          <li
            className={!message.isSender ? 'message sender' : 'message receiver'}
            key={index}
          >
            {message.content}
          </li>
        ))}
      </ul>
      <div className="input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => handleInput(e)}
          className="message-input"
        />
        <button onClick={handleSendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
