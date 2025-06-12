import * as THREE from 'https://esm.sh/three@0.152.0';
import { GLTFLoader } from 'https://esm.sh/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';

const viewer = document.getElementById('viewer-container');
const trickButtons = document.querySelectorAll('.trick-button');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

// Click-based load
trickButtons.forEach(button => {
  button.addEventListener('click', () => {
    const trick = button.dataset.trick;
    loadViewer(trick);
  });
});

// Search-based load
if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', () => {
    const input = searchInput.value.trim().toLowerCase();
    if (input) loadViewer(input);
  });
}

function loadViewer(trickName) {
  viewer.classList.remove('hidden');
  viewer.innerHTML = '';

  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset Viewer';
  resetBtn.style.margin = '10px';
  resetBtn.onclick = () => {
    viewer.innerHTML = '';
    viewer.classList.add('hidden');
  };
  viewer.appendChild(resetBtn);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
  camera.position.set(0, 1, 3);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  renderer.setClearColor(0x222222);
  viewer.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 2, 5);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  loader.load(`models/${trickName}.glb`,
    (gltf) => {
      gltf.scene.position.set(0, 0, 0);
      gltf.scene.scale.set(1.5, 1.5, 1.5);
      scene.add(gltf.scene);
    },
    undefined,
    (error) => {
      console.error(`❌ Failed to load model: "${trickName}"`, error);
      const msg = document.createElement('p');
      msg.textContent = `❌ Could not load model for "${trickName}".`;
      msg.style.color = 'red';
      viewer.appendChild(msg);
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();
}

// Highlight matching trick if URL search param exists
const urlParams = new URLSearchParams(window.location.search);
const searchTerm = urlParams.get('search');
if (searchTerm) {
  const allTricks = document.querySelectorAll('.trick-button');
  allTricks.forEach(trick => {
    const name = trick.textContent.toLowerCase();
    if (name.includes(searchTerm)) {
      trick.style.outline = '2px solid #0ff';
      trick.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      trick.style.opacity = '0.3';
    }
  });
}
