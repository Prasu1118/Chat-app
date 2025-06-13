import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    socket.on('chat message', (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    socket.on('typing', (data) => {
      setTyping(data);
    });

    return () => {
      socket.off('chat message');
      socket.off('typing');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  const handleTyping = () => {
    socket.emit('typing', true);
    setTimeout(() => socket.emit('typing', false), 1000);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🗨️ Real-time Chat</h2>
      <div style={{ border: '1px solid gray', padding: 10, height: 300, overflowY: 'auto' }}>
        {chat.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>

      {typing && <p>Someone is typing...</p>}

      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleTyping}
          placeholder="Type message..."
          style={{ padding: 8, width: 300 }}
        />
        <button type="submit" style={{ marginLeft: 10, padding: 8 }}>Send</button>
      </form>
    </div>
  );
}

export default App;
