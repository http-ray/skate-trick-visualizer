const viewer = document.getElementById('viewer-container');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

let trickData = [];

async function loadTricks() {
  const response = await fetch('tricks.json');
  trickData = await response.json();
}

searchBtn.addEventListener('click', () => {
  const input = searchInput.value.trim().toLowerCase();

  const match = trickData.find(t => t.name.toLowerCase() === input);

  if (match) {
    viewer.innerHTML = `
      <h2>${match.name}</h2>
      <p>Difficulty: ${match.difficulty}</p>
      <p>Loading 3D model: ${match.model}</p>
    `;
    // 3D model loading will go here later
  } else {
    viewer.innerHTML = `<p>No trick found for "${input}"</p>`;
  }
});

// Load trick data on page load
window.onload = loadTricks;
