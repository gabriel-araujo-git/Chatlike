import React, { useState } from 'react';
import './App.css';
import logo from './logo.png';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSendMessage = () => {
    if (userMessage.trim()) {
      const newMessages = [...messages, { sender: 'user', text: userMessage }];
      setMessages(newMessages);
      setUserMessage('');

      // Simulating bot response
      setTimeout(() => {
        setMessages([...newMessages, { sender: 'bot', text: 'Esta é uma resposta automática. Obrigado por sua mensagem!' }]);
      }, 1000);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Verifica se o arquivo é um PDF
      if (!selectedFile.name.endsWith('.pdf')) {
        alert('Por favor, selecione um arquivo PDF!');
        return;
      }
      // Verifica se o arquivo ultrapassa o limite de 6 GB
      if (selectedFile.size > 6 * 1024 * 1024 * 1024) {
        alert('O arquivo é muito grande! O limite é 6 GB.');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      alert('Nenhum arquivo selecionado!');
      return;
    }

    // Simula o processo de upload
    const totalChunks = Math.ceil(file.size / (1024 * 1024 * 10)); // 10 MB por pedaço
    let uploadedChunks = 0;

    const uploadInterval = setInterval(() => {
      uploadedChunks++;
      const progress = Math.min((uploadedChunks / totalChunks) * 100, 100);
      setUploadProgress(progress);

      if (uploadedChunks === totalChunks) {
        clearInterval(uploadInterval);
        alert('Arquivo PDF carregado com sucesso!');
      }
    }, 500); // Simula upload a cada 500ms
  };

  return (
    <div className="container">
      {/* Header Section */}
      <header className="header">
        <img src={logo} alt="Logo Copel" className="logo" />
      </header>

      {/* Upload Section */}
      <div className="upload-section">
        <h2>Upload de Documento (somente PDF)</h2>
        <div className="upload-wrapper">
          <label htmlFor="file-upload" className="upload-label">
            <span className="upload-icon">📁</span>
            Escolha um arquivo PDF para carregar
          </label>
          <input
            type="file"
            id="file-upload"
            className="file-input"
            onChange={handleFileChange}
          />
        </div>
        {file && <p>{file.name} - {Math.round(file.size / (1024 * 1024))} MB</p>}
        <button className="upload-button" onClick={handleFileUpload}>
          Carregar
        </button>
        {uploadProgress > 0 && (
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <h2>Chat</h2>
        <div className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
          />
          <button onClick={handleSendMessage} className="send-button">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
