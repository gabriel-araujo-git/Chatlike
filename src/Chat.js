import React, { useState } from "react";
import "./index.css";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Chat = () => {
  const [messages, setMessages] = useState([]); // Lista de mensagens
  const [input, setInput] = useState(""); // Texto digitado pelo usuário

  // Função para enviar mensagens
  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]); // Adiciona mensagem
      setInput(""); // Limpa o campo de texto
    }
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#1E1E1E", color: "#FFF" }}>
      {/* Cabeçalho */}
      <AppBar position="static" sx={{ bgcolor: "#333" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Untitled notebook
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Área de mensagens */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          {messages.map((message, index) => (
            <ListItem
              key={index}
              sx={{
                display: "flex",
                justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: "8px 16px",
                  maxWidth: "60%",
                  bgcolor: message.sender === "user" ? "#6200EE" : "#444",
                  color: message.sender === "user" ? "#FFF" : "#FFF",
                }}
              >
                <ListItemText primary={message.text} />
              </Paper>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Campo de entrada */}
      <Box
        sx={{
          display: "flex",
          padding: 2,
          borderTop: "1px solid #444",
          backgroundColor: "#2D2D2D",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage(); // Enviar ao pressionar Enter
          }}
          sx={{
            input: { color: "#FFF" },
            fieldset: { borderColor: "#555" },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          sx={{ marginLeft: 1, bgcolor: "#6200EE", color: "#FFF" }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;