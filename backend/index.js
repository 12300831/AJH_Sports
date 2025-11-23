// 1. Import required packages
const express = require("express");   // Helps us build the backend server
const cors = require("cors");         // Allows frontend (React) to connect to backend
require("dotenv").config();           // Loads variables from .env file

// 2. Create the backend server app
const app = express();

// 3. Middlewares (they process incoming requests)
app.use(cors());                      // Allows cross-origin requests
app.use(express.json());              // Allows backend to read JSON data (like login forms)

// 4. A test route just to check if backend works
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

// Example: a simple booking API
app.get("/bookings", (req, res) => {
  // For now, we just send some fake data
  const bookings = [
    { id: 1, event: "Table Tennis", user: "Ritesh" },
    { id: 2, event: "Tennis", user: "Alex" }
  ];
  
  res.json(bookings); // sends the data as JSON to the frontend
});


// 5. Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
