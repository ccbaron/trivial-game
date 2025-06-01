// 1. Use require instead of import
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3001;


// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Cargar preguntas desde JSON. En esta variable dispones siempre de todasl as preguntas de la "base de datos"
const questions = JSON.parse(fs.readFileSync('./questions.json', 'utf-8'));

// Endpoint para obtener una pregunta aleatoria (con filtro por categoría)
app.get('/api/question', (req, res) => {
  const { category } = req.query;

  // Filtrar preguntas por categoría si se proporciona
  const filteredQuestions = category
    ? questions.filter(q => q.category === category)
    : questions;

  // Si no hay preguntas para la categoría indicada, responder con error 404
  if (filteredQuestions.length === 0) {
    return res.status(404).json({ error: 'No hay preguntas para esta categoría.' });
  }

  // Seleccionar una pregunta aleatoria del array filtrado
  const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
  const randomQuestion = filteredQuestions[randomIndex];

  // Enviar la pregunta seleccionada como respuesta JSON
  res.json(randomQuestion);
});

// Endpoint para obtener categorías únicas
app.get('/api/categories', (req, res) => {
  // Obtener todas las categorías únicas de las preguntas
  const uniqueCategories = Array.from(new Set(questions.map(q => q.category)));
  // Enviar las categorías como respuesta JSON
  res.json(uniqueCategories);
});



// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Trivia escuchando en http://localhost:${PORT}`);
});
