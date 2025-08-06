const fetch = require("node-fetch");
module.exports = async (req, res) => {
  const location = req.query.location || "Berlin";
  const API_KEY = "7f1b6a905ecc9a654ae3720e6a575871"; // ⚠️ Consider moving this to ENV on Render

  const weatherIcons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Snow: "❄️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Mist: "🌫️",
  };

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      location
    )}&units=metric&appid=${API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.main || !data.weather) throw new Error("Invalid location");

    const temp = Math.round(data.main.temp);
    const weather = data.weather[0].main;
    const icon = weatherIcons[weather] || "🌡️";

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" font-family="'Segoe UI', sans-serif">
        <rect width="800" height="300" fill="#1e1e1e" rx="20"/>
        <text x="400" y="160" font-size="40" fill="#ffffff" text-anchor="middle">
          ${icon} ${location}: ${weather} (${temp}°C)
        </text>
      </svg>
    `;

    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.send(svg);
  } catch (error) {
    const errorSVG = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="300" font-family="'Segoe UI', sans-serif">
        <rect width="800" height="300" fill="#600"/>
        <text x="400" y="160" fill="#fff" font-size="28" text-anchor="middle">
          Fehler: Ort nicht gefunden
        </text>
      </svg>
    `;
    res.setHeader("Content-Type", "image/svg+xml");
    res.setHeader("Cache-Control", "no-cache");
    res.send(errorSVG);
  }
};
