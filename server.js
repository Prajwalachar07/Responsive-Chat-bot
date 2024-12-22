const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();


const app = express();
const port = 3000;

// Replace with your actual API key (store securely using environment variables)


const apiKey = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

// Serve static files from the project folder
app.use(express.static(path.join(__dirname)));

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve the index.html file when accessing the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/chat', async (req, res) => {
  const { message, conversationHistory } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chatHistory = conversationHistory.map(msg => ({
      role: msg.user ? "user" : "bot",
      parts: [{ text: msg.user || msg.bot }]
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: { maxOutputTokens: 100 }, // Adjust response length as needed
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
