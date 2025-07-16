const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static frontend from /public
app.use(express.static("public"));

app.listen(PORT, () => {
  console.log(`🌤️ Wetter Widget läuft auf Port ${PORT}`);
});
