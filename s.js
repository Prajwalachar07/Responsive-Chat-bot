const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Replace with your actual API key (store securely using environment variables)
const apiKey = process.env.API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);

async function chatWithGemini(userInput) {
  // Specify the Gemini Pro model for chat-like interactions
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const chatHistory = [
    // Optionally, provide initial conversation history for context
    { role: "user", parts: [{ text: "Hello!" }] },
  ];

  const chat = model.startChat({
    history: chatHistory,
    generationConfig: { maxOutputTokens: 100 }, // Adjust response length as needed
  });

  const result = await chat.sendMessage(userInput);
  const response = await result.response;
  const text = response.text();

  console.log("Gemini response:", text);
  // Update the chat history and display the response to the user (implementation depends on your UI)
}

// Example usage: Simulate user input and call the chat function
const userInput = "i want to love you  ";
chatWithGemini(userInput);