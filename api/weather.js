const express = require("express");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;

// Hilfsfunktion für saubere SVG-Ausgabe
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Statische Dateien (Frontend-Formular)
app.use(express.static("public"));

// API-Route für das SVG-Wetter-Widget
app.get("/api/weather", async (req, res) => {
  const location = req.query.location || "Berlin";

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod !== 200) {
      throw new Error(data.message || "Ort nicht gefunden");
    }

    const temp = Math.round(data.main.temp);
    const weather = data.weather[0].main;

    const safeLocation = escapeXml(location);
    const safeWeather = escapeXml(weather);

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500" style="font-family: 'Segoe UI', sans-serif;">
        <rect width="1000" height="500" fill="#1e1e1e" rx="10" />
        <text x="500" y="250" font-size="60" fill="#fff" text-anchor="middle" alignment-baseline="middle">
          ${safeLocation}: ${safeWeather} (${temp}°C)
        </text>
      </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.send(svg);
  } catch (error) {
    const errorSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="500" style="font-family: 'Segoe UI', sans-serif;">
        <rect width="1000" height="500" fill="#600" rx="10" />
        <text x="500" y="250" fill="#fff" font-size="40" text-anchor="middle" alignment-baseline="middle">
          Fehler: Ort nicht gefunden
        </text>
      </svg>
    `;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.send(errorSVG);
  }
});

// Server starten
app.listen(PORT, () => {
  console.log(`🌤️ Wetter Widget läuft auf http://localhost:${PORT}`);
});
