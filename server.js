const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = "7f1b6a905ecc9a654ae3720e6a575871";

// Static files from /public
app.use(express.static("public"));

// API route: /api/weather?location=Berlin
app.get("/api/weather", async (req, res) => {
  const location = req.query.location || "Berlin";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.main || !data.weather) throw new Error("Invalid location");

    const temp = Math.round(data.main.temp);
    const weather = data.weather[0].main;

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500" font-family=""Segoe UI", sans-serif">
        <rect width="300" height="50" fill="#1e1e1e" rx="10"/>
        <text x="150" y="30" font-size="20" fill="#fff" text-anchor="middle">
          ${location}: ${weather} (${temp}°C)
        </text>
      </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.send(svg);
  } catch (err) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500">
        <rect width="300" height="50" fill="#600"/>
        <text x="150" y="30" fill="#fff" font-size="14" text-anchor="middle">
          Fehler: Ort nicht gefunden
        </text>
      </svg>
    `;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.send(svg);
  }
});

app.listen(PORT, () => {
  console.log(`🌤️ Wetter Widget läuft auf Port ${PORT}`);
});
