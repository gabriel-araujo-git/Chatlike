import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Chat from "./Chat"; // Certifique-se de que esse componente está correto

const API_BASE_URL = "https://run-dev-hol-app-cbc-470141199353.southamerica-east1.run.app";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [notebooks, setNotebooks] = useState([]);
  const [activeNotebook, setActiveNotebook] = useState(null);
  const [editingTitle, setEditingTitle] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      alert("O arquivo é muito grande! (máx: 100MB)");
      return;
    }

    const formData = new FormData();
    formData.append("session_token", ""); // Pode ser vazio
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
        mode:'no-cors'
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar arquivo: ${response.statusText}`);
      }

      const data = await response.json();

      const newNotebook = {
        title: file.name,
        date: new Date().toLocaleDateString("pt-BR"),
        content: null,
        file: file,
      };

      setNotebooks([...notebooks, newNotebook]);
      setActiveNotebook(newNotebook);
      setActivePage("chat");
      setUploadDialogOpen(false);
    } catch (error) {
      console.error("Erro no upload:", error);
      alert("Erro ao enviar o arquivo");
    }
  };

  const handleNotebookClick = (notebook) => {
    setActiveNotebook(notebook);
    setActivePage("chat");
  };

  const handleTitleClick = () => {
    setEditingTitle(true);
  };

  const handleTitleChange = (event) => {
    if (event.key === "Enter" || event.type === "blur") {
      setEditingTitle(false);
      setActiveNotebook({ ...activeNotebook, title: event.target.value });
      setNotebooks(
        notebooks.map((nb) =>
          nb === activeNotebook ? { ...nb, title: event.target.value } : nb
        )
      );
    }
  };

  return (
    <Box sx={{ bgcolor: "#121212", color: "#fff", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ bgcolor: "#1f1f1f" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            NotebookLM
          </Typography>
          <Button color="inherit" onClick={() => setActivePage("home")}>
            Home
          </Button>
        </Toolbar>
      </AppBar>

      {activePage === "home" && (
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Meus notebooks
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<UploadFileIcon />}
            onClick={() => setUploadDialogOpen(true)}
            sx={{ mb: 3 }}
          >
            + Criar novo
          </Button>

          <Grid container spacing={2}>
            {notebooks.map((notebook, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{ bgcolor: "#FF0000", color: "#fff", cursor: "pointer" }}
                  onClick={() => handleNotebookClick(notebook)}
                >
                  <CardContent>
                    <Typography variant="h6">{notebook.title}</Typography>
                    <Typography variant="body2">{notebook.date}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {activePage === "chat" && activeNotebook && (
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid #444",
              pb: 1,
              mb: 2,
            }}
          >
            {editingTitle ? (
              <input
                type="text"
                defaultValue={activeNotebook.title}
                onKeyDown={handleTitleChange}
                onBlur={handleTitleChange}
                autoFocus
                style={{
                  fontSize: "1.5rem",
                  background: "transparent",
                  color: "#fff",
                  border: "none",
                  outline: "none",
                  width: "100%",
                }}
              />
            ) : (
              <Typography
                variant="h5"
                onClick={handleTitleClick}
                sx={{ cursor: "pointer" }}
              >
                {activeNotebook.title}
              </Typography>
            )}
          </Box>
          
          {/* Exibir o Chat passando o notebook ativo */}
          <Chat notebook={activeNotebook} />
        </Box>
      )}

      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)}>
        <DialogTitle>Adicionar fontes</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              border: "1px dashed #ccc",
              p: 3,
              textAlign: "center",
              bgcolor: "#2c2c2c",
            }}
          >
            <Typography variant="body1" sx={{ mb: 2 }}>
              Arraste e solte ou selecione o arquivo para upload
            </Typography>
            <Button variant="contained" component="label">
              Selecionar arquivo
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default App;
