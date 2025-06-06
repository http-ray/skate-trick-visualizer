import * as THREE from 'https://esm.sh/three@0.152.0';
import { GLTFLoader } from 'https://esm.sh/three@0.152.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://esm.sh/three@0.152.0/examples/jsm/controls/OrbitControls.js';

const viewer = document.getElementById('viewer-container');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');

let trickData = [];

let scene, camera, renderer, loader, controls;

function initViewer() {
  // Clear old canvas if it exists
  const oldCanvas = document.querySelector('canvas');
  if (oldCanvas) oldCanvas.remove();

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(75, viewer.clientWidth / viewer.clientHeight, 0.1, 1000);
  camera.position.set(0, 1, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  viewer.appendChild(renderer.domElement);

  loader = new GLTFLoader();

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);


  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

async function loadTricks() {
  const response = await fetch('tricks.json');
  trickData = await response.json();
}

searchBtn.addEventListener('click', () => {
  const input = searchInput.value.trim().toLowerCase();

  const match = trickData.find(t => t.name.toLowerCase() === input);

  if (match) {
  viewer.innerHTML = ''; // clear previous content
  initViewer();

  loader.load(`models/${match.model}`, (gltf) => {
    scene.add(gltf.scene);
  }, undefined, (error) => {
    console.error('Error loading model:', error);
    viewer.innerHTML = `<p>Failed to load 3D model for "${match.name}"</p>`;
  });
  
    // 3D model loading will go here later
  } else {
    viewer.innerHTML = `<p>No trick found for "${input}"</p>`;
  }
});

// Load trick data on page load
window.onload = loadTricks;
