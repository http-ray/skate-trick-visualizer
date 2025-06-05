document.getElementById('searchBtn').addEventListener('click', () => {
  const trick = document.getElementById('searchInput').value.toLowerCase();
  console.log(`User searched for: ${trick}`);

  // For now, just show the trick name
  const viewer = document.getElementById('viewer-container');
  viewer.innerHTML = `<p>Loading animation for "${trick}"...</p>`;
});
