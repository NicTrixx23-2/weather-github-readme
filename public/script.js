function generate() {
  const loc = encodeURIComponent(document.getElementById("location").value.trim());
  const url = `${window.location.origin}/api/app?location=${loc}`;
  document.getElementById("result").innerHTML = `
    <p>Markdown:</p>
    <code>![Wetter](${url})</code>
    <p>Vorschau:</p>
    <img src="${url}" alt="Wetter Widget" style="margin-top:10px; border:1px solid #ccc;" />
  `;
}
