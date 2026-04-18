import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import "./styles.css";

const sections = [
  {
    id: "about",
    title: "Earth",
    subtitle: "About Me",
    description:
      "I am a Software Engineering student at the University of Alberta (Expected Graduation 2027) with a proven track record of delivering high-impact solutions across multiple internships. My expertise spans full-stack development, performance optimization, and AI integration, with successful tenures at Ericsson, Pason Systems, and ANC. I specialize in building scalable applications that solve complex problems, from RAG chatbots to 5G network testing automation.",
    funFact: "Earth’s core is as hot as the surface of the sun, and it's the only planet in the solar system known to have active plate tectonics.",
    color: "#6cb7ff",
    position: new THREE.Vector3(-100, 5, -45),
    facts: [],
  },
  {
    id: "projects",
    title: "Mars",
    subtitle: "Projects",
    description:
      "Some Stuff I've built.",
    funFact: "Sunsets on Mars are blue! Fine dust in its thin atmosphere scatters red light away, leaving a distinct blue glow around the setting sun.",
    color: "#d96f43",
    position: new THREE.Vector3(155, -4, -90),
    facts: [
      [
        "311 Forecasting System",
        "FastAPI, React, TypeScript, Postgres, LightGBM",
        "ML pipeline integrating real-time environmental data to forecast municipal 311 service volume.",
        { Github: "https://github.com/pratham124/311-forecast-system" }
      ],
      [
        "Pharmacology Learning App",
        "TypeScript, React, Django, PostgreSQL, OpenAI",
        "Full-stack educational platform that generates AI-personalized learning games from uploaded PDFs.",
        { Demo: "https://www.youtube.com/watch?v=dPoCqzmb8Dw" }
      ],
      [
        "RareQuest",
        "JavaScript, Firebase",
        "Educational web game built for a nonprofit to teach rare disease diagnosis.",
        { Github: "https://github.com/owencooke/RQMO12", Website: "https://rqmo12-game.web.app/" }
      ],
      [
        "HomeTrack",
        "Java, Android, Firebase, JUnit",
        "Household inventory management app featuring image-based serial number scanning and smart filtering.",
        { Github: "https://github.com/CMPUT301F23T06/SoftwareSolutionsSquad" }
      ],
    ],
  },
  {
    id: "skills",
    title: "Neptune",
    subtitle: "Skills",
    description:
      "",
    funFact: "It rains diamonds on Neptune! Extreme internal pressure likely squeezes carbon until it crystallizes into solid diamonds that sink toward the core.",
    color: "#4f8cff",
    position: new THREE.Vector3(-540, -12, 410),
    facts: [
      ["Languages", "Python, JavaScript, TypeScript, Java, C#, SQL, Bash, HTML, CSS"],
      ["Frameworks & Libraries", "React, Angular, Node, Spring Boot, .NET, Express, Django, FastAPI, LangChain, Redux, Cypress"],
      ["Cloud & Tools", "Docker, Kubernetes, Jenkins, Azure, Git, Linux, Claude Code, Jira, Confluence, PowerBI"],
      ["Soft Skills", "Teamwork, Communication, Problem Solving, Adaptability, Time Management, Leadership"]
    ],
  },
  {
    id: "experience",
    title: "Jupiter",
    subtitle: "Experience",
    description:
      "Highlights from my internships.",
    funFact: "Jupiter’s Great Red Spot is a gargantuan storm that has raged for at least 350 years and is large enough to swallow Earth twice over.",
    color: "#d9b38c",
    position: new THREE.Vector3(315, 4, 210),
    facts: [
      ["Ericsson PLMS", "Incoming Full Stack Developer Intern", "Tech Stack: Java, Spring Boot, Angular, TypeScript, Kubernetes"],
      ["Ericsson OEM", "Web Developer Intern", "Shipped a LangChain RAG chatbot serving 4,000+ internal users and slashed React feature load times by 62%."],
      ["Ericsson Cloud RAN", "Software Developer Intern", "Built a React/FastAPI app cutting 5G test analysis from 2h to 20m and resolved critical Java memory leaks."],
      ["Pason Systems", "Software Developer Intern", "Optimized a Spring Boot microservice to reduce API latency by 40% and rebuilt Rig Monitoring UI in React."],
      ["ANC", "Software Engineer Intern", "Saved $100K annually with a .NET/React purchase system and accelerated Azure approval workflows by 22%."],
    ],
  },
  {
    id: "contact",
    title: "Saturn",
    subtitle: "Contact",
    description:
      "Feel free to reach out if you'd like to chat about opportunities, experience, resume or anything else!",
    funFact: "Saturn is so light for its size that it would float in water—if you could find a bathtub large enough to hold it.",
    color: "#e6d28a",
    position: new THREE.Vector3(460, -12, -300),
    facts: [
      ["Email", "pratham.sitoula03@gmail.com"],
    ],
    links: [
      { type: "linkedin", url: "https://www.linkedin.com/in/pratham-sitoula/" },
      { type: "github", url: "https://github.com/pratham124" }
    ],
  },
];

function createVoyagerModel(name) {
  const group = new THREE.Group();

  const goldMaterial = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.9, roughness: 0.2, fog: false });
  const dishMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.1, roughness: 0.8, side: THREE.DoubleSide, fog: false });
  const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.5, fog: false });

  // High Gain Antenna (The Dish)
  const dishGeom = new THREE.CylinderGeometry(2.0, 0.4, 0.6, 24, 1, true);
  const dish = new THREE.Mesh(dishGeom, dishMaterial);
  dish.rotation.x = Math.PI / 2;
  group.add(dish);

  // Central Bus
  const busGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.8, 10);
  const bus = new THREE.Mesh(busGeom, goldMaterial);
  bus.rotation.x = Math.PI / 2;
  bus.position.set(0, 0, -0.7);
  group.add(bus);

  // RTG Boom
  const rtgBoomGeom = new THREE.BoxGeometry(0.1, 0.1, 2.5);
  const rtgBoom = new THREE.Mesh(rtgBoomGeom, darkMaterial);
  rtgBoom.position.set(1.2, 0, -0.6);
  rtgBoom.rotation.y = 0.4;
  group.add(rtgBoom);

  // RTGs
  const rtgGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
  const rtg = new THREE.Mesh(rtgGeom, darkMaterial);
  rtg.position.set(2.2, 0, -1.2);
  rtg.rotation.z = Math.PI / 2;
  group.add(rtg);

  // Science Boom
  const sciBoomGeom = new THREE.BoxGeometry(0.1, 0.1, 3.5);
  const sciBoom = new THREE.Mesh(sciBoomGeom, darkMaterial);
  sciBoom.position.set(-1.6, 1.2, -0.6);
  sciBoom.rotation.y = -0.4;
  sciBoom.rotation.z = 0.4;
  group.add(sciBoom);

  group.scale.setScalar(1.1);

  // Add a tiny light to the probe so it's visible in deep space
  const light = new THREE.PointLight(0xffffff, 2.5, 30);
  light.position.set(0, 0, 0);
  group.add(light);

  group.userData = { name };
  return group;
}

function createAsteroidBelt() {
  const count = 8000;
  const geom = new THREE.IcosahedronGeometry(1.0, 0); // Flat-shaded rocks
  const mat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9, flatShading: true });
  const mesh = new THREE.InstancedMesh(geom, mat, count);

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const scale = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    // Toroidal distribution
    const radius = THREE.MathUtils.randFloat(240, 310);
    const angle = Math.random() * Math.PI * 2;
    const yShift = THREE.MathUtils.randFloatSpread(18);

    position.set(Math.cos(angle) * radius, yShift, Math.sin(angle) * radius);
    rotation.set(Math.random(), Math.random(), Math.random());
    const s = Math.random() * 0.9 + 0.15;
    scale.set(s, s, s);

    matrix.compose(position, new THREE.Quaternion().setFromEuler(rotation), scale);
    mesh.setMatrixAt(i, matrix);
  }

  return mesh;
}

/* --- Sound Engine (Synthesized) --- */
const SoundEngine = {
  ctx: null,
  hum: null,
  gain: null,
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Ambient Deep Space Hum
    this.hum = this.ctx.createOscillator();
    this.hum.type = 'sine';
    this.hum.frequency.setValueAtTime(45, this.ctx.currentTime);

    this.gain = this.ctx.createGain();
    this.gain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    this.hum.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.hum.start();
  },
  playWhoosh(intensity) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1, this.ctx.currentTime + 1.2);
    g.gain.setValueAtTime(intensity * 0.1, this.ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.2);
    osc.connect(g);
    g.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);
  }
};

window.addEventListener("pointerdown", () => SoundEngine.init(), { once: true });
window.addEventListener("keydown", () => SoundEngine.init(), { once: true });

/* --- Comet Easter Egg --- */
function createComet() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.5, 2),
    new THREE.MeshBasicMaterial({ color: 0xccfcff })
  );
  group.add(core);

  const particleCount = 200;
  const positions = new Float32Array(particleCount * 3);
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.15,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  group.add(particles);

  group.userData = {
    positions,
    isActive: false,
    velocity: new THREE.Vector3(),
    spawnTimer: 0
  };

  return group;
}

/* --- Space Dust --- */
function createSpaceDust() {
  const count = 4000;
  const geom = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = THREE.MathUtils.randFloatSpread(400);
    positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(400);
    positions[i * 3 + 2] = THREE.MathUtils.randFloatSpread(400);
  }
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x88ccff,
    size: 0.25,
    transparent: true,
    opacity: 0.35,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  return new THREE.Points(geom, mat);
}

function updateSpaceDust() {
  if (!spaceDust || !rocket) return;
  const size = 400;
  spaceDust.position.x = Math.round(rocket.position.x / size) * size;
  spaceDust.position.y = Math.round(rocket.position.y / size) * size;
  spaceDust.position.z = Math.round(rocket.position.z / size) * size;
}

/* --- Deep Space Nebulas --- */
function createNebulaField() {
  const group = new THREE.Group();
  const textures = [
    textureLoader.load("/root/.gemini/antigravity/brain/f32fe163-0db4-4ab3-acba-99d76f7d8053/nebula_texture_1_1776503578944.png"),
    textureLoader.load("/root/.gemini/antigravity/brain/f32fe163-0db4-4ab3-acba-99d76f7d8053/nebula_texture_2_1776503596828.png")
  ];

  for (let i = 0; i < 8; i++) {
    const tex = textures[i % textures.length];
    const mat = new THREE.MeshBasicMaterial({
      map: tex,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide
    });

    const size = THREE.MathUtils.randFloat(800, 1400);
    const geom = new THREE.PlaneGeometry(size, size);
    const mesh = new THREE.Mesh(geom, mat);

    const radius = THREE.MathUtils.randFloat(1600, 1900);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    mesh.position.setFromSphericalCoords(radius, phi, theta);
    mesh.lookAt(0, 0, 0);
    mesh.rotation.z = Math.random() * Math.PI * 2;
    
    group.add(mesh);
  }

  return group;
}

/* --- Navigation Scanner --- */
function createScannerIcons() {
  const scannerContainer = document.getElementById("nav-scanner");
  if (!scannerContainer) return null;
  
  const bodies = [
    { name: "Sun", color: "#ffb347", type: 'sun' },
    { name: "Earth", color: "#6cb7ff", id: "about" },
    { name: "Mars", color: "#d96f43", id: "projects" },
    { name: "Jupiter", color: "#d9b38c", id: "experience" },
    { name: "Saturn", color: "#e6d28a", id: "contact" },
    { name: "Neptune", color: "#4f8cff", id: "skills" }
  ];

  return bodies.map(body => {
    const el = document.createElement("div");
    el.className = "scanner-icon";
    el.innerText = body.name[0];
    el.style.borderColor = body.color;
    el.title = body.name;
    scannerContainer.appendChild(el);

    const arrow = document.createElement("div");
    arrow.className = "scanner-arrow";
    arrow.innerText = "▲";
    scannerContainer.appendChild(arrow);
    
    el.onclick = () => {
        if (body.type === 'sun') {
            beginAutoPilot({ title: "Sun", position: new THREE.Vector3(0,0,0), id: 'sun' }, true);
        } else {
            const targetSection = sections.find(s => s.id === body.id);
            if (targetSection) beginAutoPilot(targetSection, true);
        }
    };

    return { name: body.name, el, arrow, id: body.id, color: body.color, type: body.type };
  });
}

const scannerBodyPos = new THREE.Vector3();
function updateScanner() {
  if (!scannerIcons || !camera) return;

  const width = window.innerWidth;
  const height = window.innerHeight;
  const centerX = width / 2;
  const centerY = height / 2;
  const margin = 45;

  scannerIcons.forEach(icon => {
    let targetObj;
    if (icon.type === "sun") {
        targetObj = sunGroup;
    } else {
        targetObj = getPlanetGroup(sections.find(s => s.id === icon.id));
    }

    if (!targetObj) return;

    targetObj.getWorldPosition(scannerBodyPos);
    const pos = scannerBodyPos.clone().project(camera);
    
    const x = (pos.x * 0.5 + 0.5) * width;
    const y = -(pos.y * 0.5 - 0.5) * height;
    
    const isBehind = pos.z > 1;
    const isOffscreen = isBehind || x < margin || x > width - margin || y < margin || y > height - margin;

    if (isOffscreen) {
      let edgeX = x;
      let edgeY = y;
      
      if (isBehind) {
          edgeX = width - x;
          edgeY = height - y;
      }

      const dx = edgeX - centerX;
      const dy = edgeY - centerY;
      const angle = Math.atan2(dy, dx);
      
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const boxWidth = width - margin * 2;
      const boxHeight = height - margin * 2;
      const scale = Math.min(boxWidth/2 / Math.abs(cos), boxHeight/2 / Math.abs(sin));
      
      icon.el.style.transform = `translate(${centerX + cos * scale - 22}px, ${centerY + sin * scale - 22}px)`;
      icon.el.style.opacity = "0.6";
      
      icon.arrow.style.display = "block";
      icon.arrow.style.transform = `translate(${centerX + cos * (scale - 32)}px, ${centerY + sin * (scale - 32)}px) rotate(${angle + Math.PI/2}rad)`;
      icon.arrow.style.color = icon.color;
    } else {
      icon.el.style.transform = `translate(${x - 22}px, ${y - 22}px)`;
      icon.el.style.opacity = "1";
      icon.arrow.style.display = "none";
    }
  });
}

const LAYOUT_PRESETS = {
  desktop: {
    scale: 1,
    fov: 62,
    chaseDistance: 25.0,
    chaseHeight: 8.0,
    positions: {
      about: new THREE.Vector3(-100, 5, -45),
      projects: new THREE.Vector3(155, -4, -90),
      skills: new THREE.Vector3(-540, -12, 410),
      experience: new THREE.Vector3(315, 4, 210),
      contact: new THREE.Vector3(460, -12, -300),
    },
  },
  tablet: {
    scale: 0.92,
    fov: 64,
    chaseDistance: 28.0,
    chaseHeight: 9.5,
    positions: {
      about: new THREE.Vector3(-100, 5, -45),
      projects: new THREE.Vector3(155, -4, -90),
      skills: new THREE.Vector3(-540, -12, 410),
      experience: new THREE.Vector3(315, 4, 210),
      contact: new THREE.Vector3(460, -12, -300),
    },
  },
  mobile: {
    scale: 0.68,
    fov: 72,
    chaseDistance: 32.0,
    chaseHeight: 12.0,
    positions: {
      about: new THREE.Vector3(-100, 5, -45),
      projects: new THREE.Vector3(155, -4, -90),
      skills: new THREE.Vector3(-540, -12, 410),
      experience: new THREE.Vector3(315, 4, 210),
      contact: new THREE.Vector3(460, -12, -300),
    },
  },
};

const canvas = document.querySelector(".scene-canvas");
const statusPill = document.getElementById("status-pill");
const titleEl = document.getElementById("section-title");
const descriptionEl = document.getElementById("section-description");
const pointsEl = document.getElementById("section-points");
const infoCardEl = document.querySelector(".info-card");
const sunBurnOverlay = document.getElementById("sun-burn-overlay");
const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");

const pointerQuery = window.matchMedia("(pointer: coarse)");
const mobileQuery = window.matchMedia("(max-width: 900px)");
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const yAxis = new THREE.Vector3(0, 1, 0);
const boosterFlames = [];
const cameraLookOffset = new THREE.Vector3(0, 1.15, 0);
const movementBoundsMin = new THREE.Vector3(-1200, -250, -1200);
const movementBoundsMax = new THREE.Vector3(1200, 250, 1200);
const asteroidLabelWorldPosition = new THREE.Vector3();
const trailCamUp = new THREE.Vector3(0, 1, 0);
const trailSegmentDirection = new THREE.Vector3();
const trailPerpendicular = new THREE.Vector3();
const smokeBackDirection = new THREE.Vector3();
const cinematicNearPosition = new THREE.Vector3();
const cinematicFarPosition = new THREE.Vector3(0, 8, 400);
const slingshotPull = new THREE.Vector3();
const voyagerWorldPosition = new THREE.Vector3();
const voyagerProjectedPosition = new THREE.Vector3();
const voyagerFrustum = new THREE.Frustum();
const voyagerFrustumMatrix = new THREE.Matrix4();
const collisionOffset = new THREE.Vector3();
const collisionNormal = new THREE.Vector3();

// --- New Polish Systems ---
let spaceDust = null;
let scannerIcons = null;
let nebulaField = null;
let planetIconsCreated = false;

const scannerUpdateInterval = 16; 
let lastScannerUpdateTime = 0;

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight, false);

let isLoaded = false;
let cinematicFadeValue = 1.0;

const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const percent = Math.floor((itemsLoaded / itemsTotal) * 100);
  const textEl = document.getElementById("loader-text");
  if (textEl) {
    textEl.textContent = `Loading Universe... ${percent}%`;
  }
};

loadingManager.onLoad = () => {
  setTimeout(() => {
    const overlay = document.getElementById("loader-overlay");
    if (overlay) {
      overlay.classList.add("fade-out");
    }
    isLoaded = true;
  }, 400);
};

const scene = new THREE.Scene();
const textureLoader = new THREE.TextureLoader(loadingManager);

const asteroidBelt = createAsteroidBelt();
scene.add(asteroidBelt);

const comet = createComet();
scene.add(comet);
comet.position.set(0, 500, 0);

const voyagerStartDist1 = 24430150000; // Approx km for V1
const voyagerStartDist2 = 20385920000; // Approx km for V2
const voyagerSpeed1 = 0.01699; // km per ms (approximating ~17 km/s)
const voyagerSpeed2 = 0.01537; // km per ms (approximating ~15.4 km/s)
const missionStartTime = performance.now();

function createDeepSpaceLabel(name, fact) {
  const container = document.createElement('div');
  container.id = `label-${name.replace(' ', '').toLowerCase()}`;
  container.style.position = 'absolute';
  container.style.width = '220px';
  container.style.padding = '12px 18px';
  container.style.background = 'rgba(10, 20, 35, 0.85)';
  container.style.border = '2px solid rgba(130, 180, 255, 0.5)';
  container.style.borderRadius = '2px'; // Sharp tech look
  container.style.backdropFilter = 'blur(6px)';
  container.style.color = '#eef2ff';
  container.style.fontFamily = 'Space Grotesk, sans-serif';
  container.style.fontSize = '0.9rem';
  container.style.opacity = '0';
  container.style.pointerEvents = 'none';
  container.style.transition = 'opacity 0.4s ease';
  container.style.boxShadow = '0 0 20px rgba(130, 180, 255, 0.2)';
  container.style.zIndex = '5';

  container.innerHTML = `
    <div class="hud-tether" style="position: absolute; top: 50%; right: 100%; height: 2px; width: 40px; background: linear-gradient(to right, transparent, rgba(130, 180, 255, 0.6)); transform-origin: right center;"></div>
    <div class="offscreen-arrow" style="position: absolute; top: 50%; left: -30px; transform: translateY(-50%) rotate(0deg); color: #6cb7ff; font-size: 1.2rem; display: none;">▶</div>
    <em style="display: block; margin-bottom: 6px; color: #a3c2ff; font-size: 0.7rem; font-style: normal; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 700;">📡 Transmission: ${name}</em>
    <span style="font-family: 'Courier New', monospace; font-size: 0.85rem; color: #6cb7ff;">Distance: ${fact}</span>
  `;

  document.getElementById('asteroid-labels-container').appendChild(container);
  return container;
}

const voyager1 = createVoyagerModel("Voyager 1");
voyager1.position.set(600, 200, -700);
voyager1.rotation.set(0.5, 0.2, 0.1);
const voyager1Label = createDeepSpaceLabel("Voyager 1", "24.4 Billion km");
voyager1.userData.label = voyager1Label;
scene.add(voyager1);

const voyager2 = createVoyagerModel("Voyager 2");
voyager2.position.set(-800, -150, 700);
voyager2.rotation.set(-0.3, 0.5, -0.4);
const voyager2Label = createDeepSpaceLabel("Voyager 2", "20.3 Billion km");
voyager2.userData.label = voyager2Label;
scene.add(voyager2);
scene.fog = new THREE.Fog(0x020612, 100, 1200);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 8, 18);

scene.add(new THREE.AmbientLight(0xd8f8ff, 1.35));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
keyLight.position.set(18, 20, 10);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x8cc8ff, 25, 120, 2);
rimLight.position.set(-22, 8, -10);
scene.add(rimLight);

// --- Post Processing (Bloom) ---
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.65, // strength
  0.4,  // radius
  0.85  // threshold
);

const outputPass = new OutputPass();

const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
composer.addPass(outputPass);

const starGeometry = new THREE.BufferGeometry();
const starCount = 3000;
const starPositions = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);
const c = new THREE.Color();
const starDirection = new THREE.Vector3();

for (let i = 0; i < starCount; i++) {
  const o = i * 3;
  // Distribute stars across a large shell so the full sky stays populated.
  starDirection
    .set(
      THREE.MathUtils.randFloatSpread(2),
      THREE.MathUtils.randFloatSpread(2),
      THREE.MathUtils.randFloatSpread(2),
    )
    .normalize()
    .multiplyScalar(THREE.MathUtils.randFloat(1400, 1800));
  starPositions[o] = starDirection.x;
  starPositions[o + 1] = starDirection.y;
  starPositions[o + 2] = starDirection.z;

  // Blend temperatures: mostly cool blues and stark white, with rare hot oranges
  const hue = Math.random() > 0.8 ? THREE.MathUtils.randFloat(0.05, 0.1) : THREE.MathUtils.randFloat(0.55, 0.65);
  c.setHSL(hue, THREE.MathUtils.randFloat(0.4, 0.9), THREE.MathUtils.randFloat(0.5, 1.0));
  starColors[o] = c.r;
  starColors[o + 1] = c.g;
  starColors[o + 2] = c.b;
}

starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.75,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  }),
);
scene.add(stars);

// Deep space dynamic backdrop map
const galaxyMesh = new THREE.Mesh(
  new THREE.SphereGeometry(1300, 64, 64),
  new THREE.MeshBasicMaterial({
    map: textureLoader.load("/textures/galaxy_starfield.png"),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
    fog: false,
  })
);
scene.add(galaxyMesh);

const orbitRingMaterial = new THREE.MeshBasicMaterial({
  color: 0x284055,
  transparent: true,
  opacity: 0.42,
});

const rocket = new THREE.Group();

/* ── Materials ── */
const reflectiveSilver = new THREE.MeshStandardMaterial({
  color: 0xcdcdcd,
  metalness: 1.0,
  roughness: 0.2,
});
const whiteBody = new THREE.MeshStandardMaterial({
  color: 0xeeeeee,
  metalness: 0.1,
  roughness: 0.7,
});
const blackTPS = new THREE.MeshStandardMaterial({
  color: 0x111111,
  metalness: 0.2,
  roughness: 0.6,
});
const darkGreyTrim = new THREE.MeshStandardMaterial({
  color: 0x333333,
  metalness: 0.3,
  roughness: 0.5,
});
const redTrim = new THREE.MeshStandardMaterial({
  color: 0xcc2222,
  metalness: 0.1,
  roughness: 0.6,
});
const solarPanelMaterial = new THREE.MeshStandardMaterial({
  color: 0x1b1b1b,
  metalness: 0.3,
  roughness: 0.3,
});
const solarPanelFrame = new THREE.MeshStandardMaterial({
  color: 0x444444,
  metalness: 0.6,
  roughness: 0.4,
});

/* ── European Service Module (ESM) — short white cylinder ── */
const serviceModule = new THREE.Mesh(
  new THREE.CylinderGeometry(0.55, 0.55, 1.2, 32),
  whiteBody,
);
serviceModule.rotation.z = Math.PI / 2;
serviceModule.position.x = -0.6;
rocket.add(serviceModule);

/* ESM small details/bumps */
for (let i = 0; i < 8; i++) {
  const eqAngle = (i * Math.PI) / 4;
  const bump = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.08, 0.08),
    darkGreyTrim,
  );
  bump.position.set(
    -0.6,
    Math.cos(eqAngle) * 0.56,
    Math.sin(eqAngle) * 0.56,
  );
  bump.rotation.x = eqAngle;
  rocket.add(bump);
}

/* ── Crew Module Adapter (CMA) — white ring ── */
const cma = new THREE.Mesh(
  new THREE.CylinderGeometry(0.55, 0.55, 0.4, 32),
  whiteBody,
);
cma.rotation.z = Math.PI / 2;
cma.position.x = 0.2;
rocket.add(cma);

/* Fake red NASA logo block on CMA */
const logoBlock = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 0.02, 0.4),
  redTrim,
);
logoBlock.position.set(0.2, 0.55, 0);
rocket.add(logoBlock);

/* ── Heat shield ( prominent dark ring at capsule base ) ── */
const heatShield = new THREE.Mesh(
  new THREE.CylinderGeometry(0.58, 0.58, 0.1, 32),
  blackTPS,
);
heatShield.rotation.z = Math.PI / 2;
heatShield.position.x = 0.45;
rocket.add(heatShield);

/* ── Crew Module — shiny silver conical capsule ── */
const crewModule = new THREE.Mesh(
  new THREE.CylinderGeometry(0.25, 0.58, 1.0, 32),
  reflectiveSilver,
);
crewModule.rotation.z = Math.PI / 2;
crewModule.position.x = 1.0;
rocket.add(crewModule);

/* CM dark panels / windows (fake them with small dark boxes) */
for (let i = 0; i < 4; i++) {
  const wAngle = (i * Math.PI) / 2 + Math.PI / 4;
  const windowNode = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.5, 0.35),
    blackTPS,
  );
  windowNode.position.set(
    1.0,
    Math.cos(wAngle) * 0.35,
    Math.sin(wAngle) * 0.35,
  );
  windowNode.rotation.x = wAngle;
  windowNode.rotation.z = -0.28;
  rocket.add(windowNode);
}

/* ── Forward Bay Cover / Nose (black cap) ── */
const noseCap = new THREE.Mesh(
  new THREE.CylinderGeometry(0.12, 0.25, 0.4, 32),
  blackTPS,
);
noseCap.rotation.z = Math.PI / 2;
noseCap.position.x = 1.7;
rocket.add(noseCap);

/* Docking port ring */
const dockRing = new THREE.Mesh(
  new THREE.CylinderGeometry(0.1, 0.12, 0.1, 16),
  reflectiveSilver,
);
dockRing.rotation.z = Math.PI / 2;
dockRing.position.x = 1.95;
rocket.add(dockRing);

/* ── Solar Array Panels — 4 long narrow wings swept back ── */
for (let i = 0; i < 4; i++) {
  const angle = (i * Math.PI) / 2 + Math.PI / 4;
  const panelGroup = new THREE.Group();
  panelGroup.rotation.order = 'ZYX';

  /* Panel boom */
  const arm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.8, 6),
    solarPanelFrame,
  );
  arm.position.y = 0.95;
  panelGroup.add(arm);

  /* Panel surface (long radially along Y, thin along Z) */
  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 2.8, 0.02),
    solarPanelMaterial,
  );
  panel.position.y = 2.75;
  panelGroup.add(panel);

  /* Panel cell dividers */
  const redDividerMat = new THREE.MeshStandardMaterial({ color: 0x8a3232, metalness: 0.1 });
  for (let j = -3; j <= 3; j++) {
    const divider = new THREE.Mesh(
      new THREE.BoxGeometry(0.62, 0.01, 0.03),
      redDividerMat,
    );
    divider.position.set(0, 2.75 + j * 0.4, 0);
    panelGroup.add(divider);
  }

  /* Sweep panels backward */
  panelGroup.position.x = -0.6;
  panelGroup.rotation.z = 0.35; // sweep back towards -X
  panelGroup.rotation.x = angle; // roll around the rocket body
  rocket.add(panelGroup);
}

/* ── OMS-E Engine nozzle ── */
const engineBell = new THREE.Mesh(
  new THREE.ConeGeometry(0.18, 0.4, 16),
  darkGreyTrim,
);
engineBell.rotation.z = Math.PI / 2;
engineBell.position.x = -1.4;
rocket.add(engineBell);

/* ── Aft cover / service module base ── */
const aftCover = new THREE.Mesh(
  new THREE.CylinderGeometry(0.5, 0.55, 0.2, 32),
  whiteBody,
);
aftCover.rotation.z = Math.PI / 2;
aftCover.position.x = -1.3;
rocket.add(aftCover);

/* ── RCS thruster pods ── */
for (let i = 0; i < 4; i++) {
  const rcsAngle = (i * Math.PI) / 2;
  const rcs = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.1, 0.1),
    darkGreyTrim,
  );
  rcs.position.set(
    -0.1,
    Math.cos(rcsAngle) * 0.58,
    Math.sin(rcsAngle) * 0.58,
  );
  rocket.add(rcs);
}

/* ── Main exhaust flame ── */
const flame = new THREE.Mesh(
  new THREE.ConeGeometry(0.18, 0.9, 16),
  new THREE.MeshBasicMaterial({
    color: 0xffd36f,
    transparent: true,
    opacity: 0.88,
  }),
);
flame.rotation.z = Math.PI / 2;
flame.position.x = -1.75;
rocket.add(flame);

const flameCore = new THREE.Mesh(
  new THREE.ConeGeometry(0.1, 0.65, 14),
  new THREE.MeshBasicMaterial({
    color: 0xfffbde,
    transparent: true,
    opacity: 0.92,
  }),
);
flameCore.rotation.z = Math.PI / 2;
flameCore.position.x = -1.85;
rocket.add(flameCore);

const exhaustHalo = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  new THREE.MeshBasicMaterial({
    color: 0xffd087,
    transparent: true,
    opacity: 0.42,
  }),
);
exhaustHalo.position.x = -1.55;
rocket.add(exhaustHalo);

rocket.position.set(0, 0, 0);
rocket.rotation.y = 0;
scene.add(rocket);

const rocketVelocity = new THREE.Vector3();
const autopilotTarget = new THREE.Vector3();
const cameraLookTarget = new THREE.Vector3();
const desiredCameraPosition = new THREE.Vector3();
const tempDirection = new THREE.Vector3();
const forwardDirection = new THREE.Vector3();
const horizontalForward = new THREE.Vector3();
const cameraOffset = new THREE.Vector3();
const trailAnchor = new THREE.Vector3();
const zoomStep = 0.18;
const minZoomScale = 1;
const maxZoomScale = 2.3;
const dockRadius = 9.2;
const undockRadius = 12.8;
const trailLength = 28;

let zoomScale = 1;
let cameraPitch = 0.08;
let sceneScaleFactor = 1;
let currentLayout = LAYOUT_PRESETS.desktop;
let activeSection = null;
let dockCandidate = null;
let autoPilotSection = null;
let undockGraceSection = null;
let undockGraceTime = 0;
let isAutoPiloting = false;
let usePostProcessing = true;
let lastStatusText = "";
let lastHudSyncTime = -Infinity;
let sunBurnTime = 0;
let sunRespawnTimer = 0;

const HUD_SYNC_INTERVAL_MS = 125;

const keyboard = new Set();
const planets = [];
const clickablePlanets = [];
const trailPoints = Array.from({ length: trailLength }, () => new THREE.Vector3());

/* ── Exhaust ribbon (triangle strip) ── */
const ribbonSegments = trailLength;
const ribbonVertCount = ribbonSegments * 2;
const ribbonPositions = new Float32Array(ribbonVertCount * 3);
const ribbonColors = new Float32Array(ribbonVertCount * 4);
const ribbonGeometry = new THREE.BufferGeometry();
ribbonGeometry.setAttribute("position", new THREE.BufferAttribute(ribbonPositions, 3));
ribbonGeometry.setAttribute("color", new THREE.BufferAttribute(ribbonColors, 4));

const ribbonIndices = [];
for (let i = 0; i < ribbonSegments - 1; i++) {
  const a = i * 2;
  const b = a + 1;
  const c = a + 2;
  const d = a + 3;
  ribbonIndices.push(a, b, c, b, d, c);
}
ribbonGeometry.setIndex(ribbonIndices);

const ribbonMaterial = new THREE.MeshBasicMaterial({
  vertexColors: true,
  transparent: true,
  side: THREE.DoubleSide,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const ribbonMesh = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
scene.add(ribbonMesh);

/* ── Smoke particles ── */
const smokeCount = 40;
const smokeParticles = [];
const smokeGroup = new THREE.Group();
scene.add(smokeGroup);

const smokeCanvas = document.createElement("canvas");
smokeCanvas.width = 64;
smokeCanvas.height = 64;
const smokeCtx = smokeCanvas.getContext("2d");
const smokeGrad = smokeCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
smokeGrad.addColorStop(0, "rgba(255, 200, 120, 0.7)");
smokeGrad.addColorStop(0.3, "rgba(200, 140, 80, 0.35)");
smokeGrad.addColorStop(0.7, "rgba(120, 90, 60, 0.12)");
smokeGrad.addColorStop(1, "rgba(60, 40, 30, 0)");
smokeCtx.fillStyle = smokeGrad;
smokeCtx.fillRect(0, 0, 64, 64);

const smokeTexture = new THREE.CanvasTexture(smokeCanvas);

for (let i = 0; i < smokeCount; i++) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: smokeTexture,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  sprite.scale.setScalar(0.01);
  smokeGroup.add(sprite);
  smokeParticles.push({
    sprite,
    life: 0,
    maxLife: 0,
    velocity: new THREE.Vector3(),
    active: false,
  });
}

let smokeSpawnTimer = 0;

const exhaustPlume = new THREE.Group();
const plumeOuter = new THREE.Mesh(
  new THREE.ConeGeometry(0.22, 1.35, 18),
  new THREE.MeshBasicMaterial({
    color: 0xffa23c,
    transparent: true,
    opacity: 0.42,
  }),
);
plumeOuter.rotation.z = Math.PI / 2;
plumeOuter.position.x = -1.95;
exhaustPlume.add(plumeOuter);

const plumeInner = new THREE.Mesh(
  new THREE.ConeGeometry(0.12, 0.92, 16),
  new THREE.MeshBasicMaterial({
    color: 0xfff0b0,
    transparent: true,
    opacity: 0.68,
  }),
);
plumeInner.rotation.z = Math.PI / 2;
plumeInner.position.x = -1.8;
exhaustPlume.add(plumeInner);

const plumeGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.16, 14, 14),
  new THREE.MeshBasicMaterial({
    color: 0xfff4c5,
    transparent: true,
    opacity: 0.75,
  }),
);
plumeGlow.position.x = -1.55;
exhaustPlume.add(plumeGlow);

const shockDiamonds = [];
for (let index = 0; index < 3; index += 1) {
  const diamond = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.1 - index * 0.018, 0),
    new THREE.MeshBasicMaterial({
      color: index === 0 ? 0xfff8db : 0xffc56d,
      transparent: true,
      opacity: 0.55 - index * 0.1,
    }),
  );
  diamond.rotation.z = Math.PI / 4;
  diamond.position.x = -1.85 - index * 0.28;
  exhaustPlume.add(diamond);
  shockDiamonds.push(diamond);
}

rocket.add(exhaustPlume);

for (const point of trailPoints) {
  point.copy(rocket.position);
}

function makeNoiseLayer(ctx, size, color, count, minRadius, maxRadius, alpha = 1) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  for (let index = 0; index < count; index += 1) {
    ctx.beginPath();
    ctx.arc(
      Math.random() * size,
      Math.random() * size,
      THREE.MathUtils.randFloat(minRadius, maxRadius),
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.restore();
}

const planetTextures = {
  Sun: textureLoader.load("/textures/sunmap.jpg"),
  Earth: textureLoader.load("/textures/earthmap1k.jpg"),
  Mars: textureLoader.load("/textures/marsmap1k.jpg"),
  Jupiter: textureLoader.load("/textures/jupitermap.jpg"),
  Saturn: textureLoader.load("/textures/saturnmap.jpg"),
  Neptune: null,
  Moon: textureLoader.load("/textures/moonmap1k.jpg"),
};

function createSaturnRingTexture() {
  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  const center = size / 2;

  const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
  grad.addColorStop(0.0, "rgba(0,0,0,0)");
  grad.addColorStop(0.5, "rgba(0,0,0,0)");
  grad.addColorStop(0.52, "rgba(100,90,80, 0.4)");
  grad.addColorStop(0.55, "rgba(150,135,110, 0.7)");
  grad.addColorStop(0.68, "rgba(220,205,170, 0.95)");
  grad.addColorStop(0.72, "rgba(235,225,190, 0.98)");
  grad.addColorStop(0.74, "rgba(0,0,0,0.2)");
  grad.addColorStop(0.76, "rgba(0,0,0,0.2)");
  grad.addColorStop(0.77, "rgba(180,165,135, 0.85)");
  grad.addColorStop(0.88, "rgba(160,140,110, 0.6)");
  grad.addColorStop(0.92, "rgba(90,80,70, 0.3)");
  grad.addColorStop(1.0, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  for (let i = 0; i < 300; i++) {
    const radius = THREE.MathUtils.randFloat(center * 0.51, center * 0.95);
    const width = THREE.MathUtils.randFloat(0.5, 2.0);
    const isDark = Math.random() > 0.5;
    const alpha = THREE.MathUtils.randFloat(0.05, 0.15);
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.lineWidth = width;
    ctx.strokeStyle = isDark ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createPlanetTexture(name, baseColor) {
  const size = 1024;
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = size;
  textureCanvas.height = size;
  const ctx = textureCanvas.getContext("2d");
  const base = new THREE.Color(baseColor);

  if (name === "Sun") {
    const solarGradient = ctx.createRadialGradient(
      size * 0.45,
      size * 0.42,
      size * 0.12,
      size * 0.5,
      size * 0.5,
      size * 0.5,
    );
    solarGradient.addColorStop(0, "#fff7c2");
    solarGradient.addColorStop(0.28, "#ffd36a");
    solarGradient.addColorStop(0.58, "#ff9a3d");
    solarGradient.addColorStop(1, "#b84518");
    ctx.fillStyle = solarGradient;
    ctx.fillRect(0, 0, size, size);

    for (let index = 0; index < 22; index += 1) {
      const flareRadius = size * THREE.MathUtils.randFloat(0.12, 0.32);
      const x = size * THREE.MathUtils.randFloat(0.18, 0.82);
      const y = size * THREE.MathUtils.randFloat(0.18, 0.82);
      const flare = ctx.createRadialGradient(x, y, 0, x, y, flareRadius);
      flare.addColorStop(0, "rgba(255, 247, 194, 0.95)");
      flare.addColorStop(0.35, "rgba(255, 192, 96, 0.35)");
      flare.addColorStop(1, "rgba(255, 128, 56, 0)");
      ctx.fillStyle = flare;
      ctx.beginPath();
      ctx.arc(x, y, flareRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    makeNoiseLayer(ctx, size, "#fff1ab", 220, 18, 56, 0.08);
    makeNoiseLayer(ctx, size, "#ff8a3c", 180, 10, 32, 0.12);

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  }

  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, `#${base.clone().offsetHSL(0, 0.03, 0.12).getHexString()}`);
  gradient.addColorStop(1, `#${base.clone().offsetHSL(0, -0.04, -0.14).getHexString()}`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  if (name === "Earth") {
    makeNoiseLayer(ctx, size, "#297a4d", 160, 18, 68, 0.95);
    makeNoiseLayer(ctx, size, "#4cb4f4", 100, 12, 36, 0.24);
    makeNoiseLayer(ctx, size, "#f7fcff", 130, 14, 44, 0.3);
  }

  if (name === "Mars") {
    makeNoiseLayer(ctx, size, "#9f482a", 180, 14, 42, 0.42);
    makeNoiseLayer(ctx, size, "#75321d", 120, 10, 28, 0.3);
    makeNoiseLayer(ctx, size, "#e2ac84", 130, 10, 30, 0.18);
  }

  if (name === "Neptune") {
    for (let index = 0; index < 16; index += 1) {
      const y = (index / 16) * size;
      const bandHeight = size / 16 + THREE.MathUtils.randFloat(-8, 10);
      const stripe = base
        .clone()
        .offsetHSL(
          THREE.MathUtils.randFloat(-0.01, 0.01),
          THREE.MathUtils.randFloat(-0.04, 0.04),
          THREE.MathUtils.randFloat(-0.14, 0.12),
        );
      ctx.fillStyle = `#${stripe.getHexString()}`;
      ctx.fillRect(0, y, size, bandHeight);
    }
    makeNoiseLayer(ctx, size, "#86b9ff", 120, 10, 28, 0.18);
    makeNoiseLayer(ctx, size, "#d8ecff", 60, 18, 40, 0.08);
  }

  if (name === "Jupiter" || name === "Saturn") {
    const bands = name === "Jupiter" ? 14 : 18;
    for (let index = 0; index < bands; index += 1) {
      const y = (index / bands) * size;
      const bandHeight = size / bands + THREE.MathUtils.randFloat(-10, 14);
      const stripe = base
        .clone()
        .offsetHSL(
          THREE.MathUtils.randFloat(-0.01, 0.01),
          THREE.MathUtils.randFloat(-0.05, 0.03),
          THREE.MathUtils.randFloat(-0.18, 0.18),
        );
      ctx.fillStyle = `#${stripe.getHexString()}`;
      ctx.fillRect(0, y, size, bandHeight);
    }
    makeNoiseLayer(ctx, size, "#f5e2c0", 160, 12, 34, 0.15);
  }

  if (name === "Jupiter") {
    ctx.save();
    ctx.fillStyle = "rgba(196, 103, 72, 0.62)";
    ctx.beginPath();
    ctx.ellipse(size * 0.68, size * 0.58, 110, 72, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(textureCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

function createPlanet(section, isInteractive = true) {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(section.color);
  const planetConfig = {
    Sun: { radius: 22.0, glowRadius: 26.0, ringRadius: null, emissive: "#ff9d36", emissiveIntensity: 2.8 },
    Earth: { radius: 4.5, glowRadius: 5.3, ringRadius: null },
    Mars: { radius: 3.5, glowRadius: 4.2, ringRadius: null },
    Neptune: { radius: 6.5, glowRadius: 7.6, ring: null },
    Jupiter: { radius: 10.0, glowRadius: 11.5, ring: null },
    Saturn: { radius: 9.0, glowRadius: 10.5, ring: { inner: 11.0, outer: 22.0 } },
  }[section.title] || { radius: 4.5, glowRadius: 5.3, ring: null };

  const isSun = section.title === "Sun";
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(planetConfig.radius, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: planetTextures[section.title] || createPlanetTexture(section.title, section.color),
      emissive: isSun ? 0xffffff : (planetConfig.emissive || 0x000000),
      emissiveMap: isSun ? planetTextures["Sun"] : null,
      emissiveIntensity: isSun ? 2.8 : (planetConfig.emissiveIntensity || 0),
      roughness: isSun ? 1.0 : 0.92,
      metalness: isSun ? 0.0 : 0.02,
    }),
  );
  group.add(planet);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(planetConfig.glowRadius, 32, 32),
    new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.11,
      depthWrite: false,
    }),
  );
  group.add(glow);

  let corona = null;
  if (section.title === "Sun") {
    corona = new THREE.Mesh(
      new THREE.SphereGeometry(planetConfig.glowRadius * 1.18, 32, 32),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color("#ffbf66"),
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    group.add(corona);

    const starLight = new THREE.PointLight(0xffbd66, 18, 140, 1.4);
    starLight.position.set(0, 0, 0);
    group.add(starLight);
  }

  let ring = null;
  if (planetConfig.ring) {
    ring = new THREE.Mesh(
      new THREE.RingGeometry(planetConfig.ring.inner, planetConfig.ring.outer, 128),
      new THREE.MeshStandardMaterial({
        map: createSaturnRingTexture(),
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1,
      })
    );
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = 0.48;
    group.add(ring);
  }

  let moonGroup = null;
  if (section.title === "Earth") {
    moonGroup = new THREE.Group();
    const moon = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 32, 32),
      new THREE.MeshStandardMaterial({
        map: planetTextures["Moon"],
        roughness: 1.0,
        metalness: 0.0,
      })
    );
    moon.position.set(8.5, 0, 0);
    moonGroup.rotation.x = 0.15;
    moonGroup.rotation.z = 0.1;

    moonGroup.add(moon);
    group.add(moonGroup);
  }

  let asteroidData = null;
  if (section.funFact) {
    const asteroidGroup = new THREE.Group();
    let anchorMesh;
    if (section.title === "Earth") {
      anchorMesh = new THREE.Group();

      const moduleMaterial = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.3, roughness: 0.7 });
      const trussMaterial = new THREE.MeshStandardMaterial({ color: 0xcdcdcd, metalness: 0.9, roughness: 0.2 });
      const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x1e3f66, metalness: 0.5, roughness: 0.4 });

      // Main pressurized modules (Central spine)
      const coreModule = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2.0, 16), moduleMaterial);
      coreModule.rotation.z = Math.PI / 2;

      // Transverse truss (Long backbone holding panels)
      const mainTruss = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.0, 8), trussMaterial);

      // Cross habitation module
      const habModule = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.2, 16), moduleMaterial);
      habModule.position.set(0.4, 0, 0);

      // Distinctive 4-wing Solar Array system
      const panelGeom = new THREE.BoxGeometry(0.6, 0.04, 1.5);

      const p1 = new THREE.Mesh(panelGeom, panelMaterial);
      p1.position.set(0, 1.5, -0.9);

      const p2 = new THREE.Mesh(panelGeom, panelMaterial);
      p2.position.set(0, 1.5, 0.9);

      const p3 = new THREE.Mesh(panelGeom, panelMaterial);
      p3.position.set(0, -1.5, -0.9);

      const p4 = new THREE.Mesh(panelGeom, panelMaterial);
      p4.position.set(0, -1.5, 0.9);

      anchorMesh.add(coreModule, mainTruss, habModule, p1, p2, p3, p4);
      anchorMesh.scale.setScalar(0.4);
    } else if (section.title === "Sun") {
      anchorMesh = new THREE.Group();

      const shieldMaterial = new THREE.MeshStandardMaterial({ color: 0xeaeaea, metalness: 0.1, roughness: 0.9, flatShading: true });
      const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8, roughness: 0.4 });
      const panelMaterial = new THREE.MeshStandardMaterial({ color: 0x112244, metalness: 0.5, roughness: 0.5 });

      const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.1, 16), shieldMaterial);
      shield.rotation.x = Math.PI / 2;
      shield.position.set(0, 0, 0.6);

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.8, 6), bodyMaterial);
      body.rotation.x = Math.PI / 2;
      body.position.set(0, 0, 0);

      const panelGeom = new THREE.BoxGeometry(1.6, 0.05, 0.5);
      const pL = new THREE.Mesh(panelGeom, panelMaterial);
      pL.position.set(-1.0, 0, -0.2);
      pL.rotation.y = 0.35;

      const pR = new THREE.Mesh(panelGeom, panelMaterial);
      pR.position.set(1.0, 0, -0.2);
      pR.rotation.y = -0.35;

      const boom = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2), shieldMaterial);
      boom.rotation.x = Math.PI / 2;
      boom.position.set(0, 0, -0.8);

      anchorMesh.add(shield, body, pL, pR, boom);
      anchorMesh.scale.setScalar(0.6);
    } else {
      anchorMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(Math.random() * 0.4 + 0.6, 0),
        new THREE.MeshStandardMaterial({
          color: 0x777777,
          roughness: 0.9,
          metalness: 0.1,
          flatShading: true
        })
      );
    }

      const probeAltitude = section.title === "Sun" ? planetConfig.radius + 12.5 : planetConfig.radius + 6.5;
      anchorMesh.position.set(probeAltitude, 3.5, 0);
    asteroidGroup.rotation.x = Math.random() * Math.PI;
    asteroidGroup.rotation.z = Math.random() * Math.PI;

    asteroidGroup.add(anchorMesh);
    group.add(asteroidGroup);

    const labelDiv = document.createElement('div');
    labelDiv.style.position = 'absolute';
    labelDiv.style.width = '240px';
    labelDiv.style.padding = '12px 16px';
    labelDiv.style.background = 'rgba(10, 20, 35, 0.7)';
    labelDiv.style.border = '1px solid rgba(130, 180, 255, 0.3)';
    labelDiv.style.borderRadius = '8px';
    labelDiv.style.backdropFilter = 'blur(4px)';
    labelDiv.style.color = '#eef2ff';
    labelDiv.style.fontFamily = 'Space Grotesk, sans-serif';
    labelDiv.style.fontSize = '0.85rem';
    labelDiv.style.lineHeight = '1.4';
    labelDiv.style.opacity = '0';
    labelDiv.style.pointerEvents = 'none';
    labelDiv.style.transition = 'opacity 0.4s ease'; // Fades smoothly on approach
    labelDiv.style.transform = 'translate(15px, -50%)'; // Offset from asteroid center
    const labelTitle = section.title === "Sun" ? "Solar Probe" : "Astronomy Fact";
    labelDiv.innerHTML = `<em style="display: block; margin-bottom: 6px; color: #a3c2ff; font-size: 0.7rem; font-style: normal; letter-spacing: 0.05em; text-transform: uppercase;">${labelTitle}</em>${section.funFact}`;

    document.getElementById('asteroid-labels-container').appendChild(labelDiv);

    asteroidData = {
      group: asteroidGroup,
      mesh: anchorMesh,
      label: labelDiv
    };
  }

  group.position.copy(section.position);
  group.userData = {
    section,
    ring,
    corona,
    glow,
    moonGroup,
    asteroidData,
    radius: planetConfig.radius,
  };
  scene.add(group);
  if (isInteractive) {
    planets.push(group);
    clickablePlanets.push(planet);
  }

  return group;
}

sections.forEach((section) => createPlanet(section));
const sunGroup = createPlanet(
  {
    id: "sun",
    title: "Sun",
    subtitle: "Sun",
    description: "",
    color: "#ffb347",
    position: new THREE.Vector3(0, 0, 0),
    facts: [],
    funFact: "Parker Solar Probe: The fastest human-made object ever, reaching over 600,000 km/h as it 'touches' the Sun's atmosphere to study the corona.",
  },
  false,
);

const aboutSection = sections.find((section) => section.id === "about");

// --- Initialize Polish Systems ---
spaceDust = createSpaceDust();
scene.add(spaceDust);

scannerIcons = createScannerIcons();

nebulaField = createNebulaField();
scene.add(nebulaField);

function getPlanetGroup(section) {
  if (section?.id === 'sun') return sunGroup;
  return planets.find((planetGroup) => planetGroup.userData.section.id === section.id) || null;
}

function getSectionPosition(section) {
  return getPlanetGroup(section)?.position || section.position;
}

function getPlanetDockMetrics(section) {
  const planetGroup = getPlanetGroup(section);
  if (!planetGroup) {
    return {
      dockRadius: dockRadius * sceneScaleFactor,
      undockRadius: undockRadius * sceneScaleFactor,
    };
  }

  const collisionRadius = planetGroup.userData.radius * sceneScaleFactor + 1.6;
  return {
    dockRadius: Math.max(dockRadius * sceneScaleFactor, collisionRadius + 0.9),
    undockRadius: Math.max(undockRadius * sceneScaleFactor, collisionRadius + 3.2),
  };
}

function getResponsiveLayout() {
  if (window.innerWidth < 700 || window.innerHeight < 620) {
    return LAYOUT_PRESETS.mobile;
  }

  if (window.innerWidth < 960 || window.innerHeight < 680) {
    return LAYOUT_PRESETS.tablet;
  }

  return LAYOUT_PRESETS.desktop;
}

function applyResponsiveSceneLayout() {
  const previousScale = sceneScaleFactor;
  currentLayout = getResponsiveLayout();
  sceneScaleFactor = currentLayout.scale;

  planets.forEach((planetGroup) => {
    planetGroup.scale.setScalar(sceneScaleFactor);
    planetGroup.position.copy(currentLayout.positions[planetGroup.userData.section.id]);
  });
  sunGroup.scale.setScalar(sceneScaleFactor);

  if (activeSection && !isAutoPiloting) {
    const { dockRadius: activeDockRadius } = getPlanetDockMetrics(activeSection);
    rocket.position.copy(getSectionPosition(activeSection)).add(new THREE.Vector3(-activeDockRadius, 0, 0));
  } else if (!activeSection && !isAutoPiloting && previousScale !== 0) {
    rocket.position.multiplyScalar(sceneScaleFactor / previousScale);
  }

  if (isAutoPiloting && autoPilotSection) {
    autopilotTarget.copy(getSectionPosition(autoPilotSection));
  }
}

function setContent(section, customText) {
  infoCardEl.classList.toggle("is-hidden", !section);

  if (!section) {
    titleEl.textContent = "";
    descriptionEl.textContent = "";
    pointsEl.innerHTML = "";
    return;
  }

  titleEl.textContent = section ? section.subtitle : "Explore the system";
  descriptionEl.textContent =
    customText ||
    (section
      ? section.description
      : "Click a planet to jump to a section, or fly around manually with the arrow keys.");

  pointsEl.innerHTML = "";

  const items = section
    ? (Array.isArray(section.facts) ? section.facts : [])
    : [
      ["Desktop", "Use the keypad or keyboard to steer manually, or click a planet to travel there."],
      ["Mobile", "Tap a planet to travel there, then use the zoom buttons to adjust your distance."],
      ["Scene", "A 3D universe with textured solar-system bodies and a chase camera behind the rocket."],
      ["Portfolio", "Swap placeholder copy with your real story, experience, and contact links."],
    ];

  items.forEach((item) => {
    const pill = document.createElement("article");
    pill.className = "info-pill";
    if (items.length === 1) {
      pill.style.gridColumn = "1 / -1";
    }

    const label = item[0];
    let title = null;
    let value = item[1];
    let linksObj = null;

    if (item.length >= 3) {
      title = item[1];
      value = item[2];
    }
    if (item.length === 4) {
      linksObj = item[3];
    }

    let innerHTML = "";

    if (linksObj) {
      const linkStr = Object.entries(linksObj)
        .filter(([_, url]) => url)
        .map(([key, url]) => {
          let svg = '';
          const lKey = key.toLowerCase();
          if (lKey === 'github') {
            svg = `<svg style="width:1.15em; height:1.15em;" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
          } else if (lKey === 'demo') {
            svg = `<svg style="width:1.25em; height:1.25em;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>`;
          } else {
            svg = `<svg style="width:1.15em; height:1.15em;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
          }
          return `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${key}" style="color: var(--cyan); text-decoration: none; transition: color 0.15s, transform 0.15s; display: inline-flex; align-items: center;" onmouseover="this.style.color='#fff'; this.style.transform='scale(1.1)';" onmouseout="this.style.color='var(--cyan)'; this.style.transform='scale(1)';">${svg}</a>`;
        })
        .join('');

      innerHTML = `<div style="margin-bottom: 0.2rem; display: flex; align-items: center; justify-content: space-between;"><strong style="margin-bottom: 0;">${label}</strong> <span style="display: flex; gap: 0.6rem; align-items: center; opacity: 0.85;">${linkStr}</span></div>`;
    } else {
      innerHTML = `<strong>${label}</strong>`;
    }

    if (title) {
      innerHTML += `<em>${title}</em>`;
    }

    const renderedValue = typeof value === "string" ? value : String(value ?? "");

    if (renderedValue.includes("@")) {
      innerHTML += `<span><a href="mailto:${renderedValue}" style="color: inherit; text-decoration: none;">${renderedValue}</a></span>`;
    } else {
      innerHTML += `<span>${renderedValue}</span>`;
    }

    pill.innerHTML = innerHTML;
    pointsEl.appendChild(pill);
  });

  if (section && section.links) {
    const linksContainer = document.createElement("div");
    linksContainer.className = "social-links";
    section.links.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "social-icon";
      if (link.type === "linkedin") {
        a.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>`;
      } else if (link.type === "github") {
        a.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`;
      }
      linksContainer.appendChild(a);
    });
    pointsEl.appendChild(linksContainer);
  }
}

function updateStatus(text) {
  if (text === lastStatusText) {
    return;
  }
  lastStatusText = text;
  statusPill.textContent = text;
}

function beginAutoPilot(section, isManualTrigger = false) {
  if (!section) return;

  if (activeSection && activeSection.id !== section.id) {
    undockGraceSection = activeSection;
    undockGraceTime = 0.9;
    const currentSectionPosition = getSectionPosition(activeSection);
    const { undockRadius: currentUndockRadius } = getPlanetDockMetrics(activeSection);
    collisionOffset.copy(rocket.position).sub(currentSectionPosition);

    if (collisionOffset.lengthSq() < 0.001) {
      collisionOffset.set(-1, 0, 0);
    }

    collisionOffset.normalize();
    rocket.position.copy(currentSectionPosition).addScaledVector(collisionOffset, currentUndockRadius + 0.25);
  }

  dockCandidate = section;
  autoPilotSection = section;
  autopilotTarget.copy(getSectionPosition(section));
  isAutoPiloting = true;
  activeSection = null;
  setContent(null);
  updateStatus(`Autopilot set for ${section.title}`);
}

function dockWith(section) {
  const { dockRadius: targetDockRadius } = getPlanetDockMetrics(section);
  activeSection = section;
  autoPilotSection = null;
  undockGraceSection = null;
  undockGraceTime = 0;
  dockCandidate = section;
  isAutoPiloting = false;
  rocketVelocity.multiplyScalar(0);
  rocket.position.copy(getSectionPosition(section)).add(new THREE.Vector3(-targetDockRadius, 0, 0));
  updateStatus(`Docked at ${section.title}`);
  setContent(section, section.description);
}

function undockFrom(section) {
  if (!section) {
    return;
  }

  activeSection = null;
  autoPilotSection = null;
  undockGraceSection = null;
  undockGraceTime = 0;
  updateStatus(`Departed ${section.title}`);
  setContent(null);
}

function respawnAtEarth(isIncinerated = false) {
  if (!aboutSection) {
    return;
  }

  keyboard.clear();
  rocketVelocity.set(0, 0, 0);
  zoomScale = minZoomScale;
  dockWith(aboutSection);
  rocket.rotation.set(0, 0, 0);
  cameraPitch = 0.08;
  sunBurnTime = 0;
  sunRespawnTimer = 0;
  if (sunBurnOverlay) {
    sunBurnOverlay.style.opacity = "0";
  }
  if (isIncinerated) {
    updateStatus("Incinerated by the Sun. Respawned at Earth.");
  }
}

function triggerSunBurn() {
  if (sunRespawnTimer > 0) {
    return;
  }

  isAutoPiloting = false;
  autoPilotSection = null;
  activeSection = null;
  dockCandidate = null;
  undockGraceSection = null;
  undockGraceTime = 0;
  keyboard.clear();
  rocketVelocity.set(0, 0, 0);
  setContent(null);
  updateStatus("Solar incineration imminent");
  sunBurnTime = 0.75;
  sunRespawnTimer = 0.75;
}

function isMobileMode() {
  return mobileQuery.matches || pointerQuery.matches;
}

function updateDockCandidate() {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  [...planets, sunGroup].forEach((planetGroup, index) => {
    const section = planetGroup.userData.section;
    const distance = rocket.position.distanceTo(planetGroup.position);
    const pulse = 0.5 + Math.sin(performance.now() * 0.0012 + index) * 0.12;
    const { undockRadius: effectiveUndockRadius } = getPlanetDockMetrics(section);
    const revealRange = planetGroup.userData.section.id === "sun" ? 45 : 18;
    const factRevealRadius = effectiveUndockRadius + revealRange * sceneScaleFactor;
    const factFullOpacityRadius = effectiveUndockRadius + (planetGroup.userData.section.id === "sun" ? 15 : 5) * sceneScaleFactor;

    planetGroup.rotation.y += 0.0015 + index * 0.00025;
    planetGroup.userData.glow.material.opacity = distance < effectiveUndockRadius ? 0.22 + pulse : 0.1 + pulse * 0.35;
    if (planetGroup.userData.corona) {
      planetGroup.userData.corona.material.opacity = distance < effectiveUndockRadius ? 0.18 + pulse * 0.2 : 0.1 + pulse * 0.14;
      planetGroup.userData.corona.scale.setScalar(1 + pulse * 0.08);
    }
    if (planetGroup.userData.ring) {
      planetGroup.userData.ring.material.opacity = distance < effectiveUndockRadius ? 1.0 : 0.85;
    }
    if (planetGroup.userData.moonGroup) {
      planetGroup.userData.moonGroup.rotation.y -= 0.003;
      planetGroup.userData.moonGroup.children[0].rotation.y -= 0.005;
    }

    if (planetGroup.userData.asteroidData) {
      const ast = planetGroup.userData.asteroidData;

      const orbitSpeed = planetGroup.userData.section.id === "sun" ? 0.012 : 0.002;
      ast.group.rotation.y -= orbitSpeed;
      ast.mesh.rotation.x += 0.004;
      ast.mesh.rotation.y += 0.005;

      if (distance < factRevealRadius) {
        ast.mesh.getWorldPosition(asteroidLabelWorldPosition);
        asteroidLabelWorldPosition.project(camera);

        const x = (asteroidLabelWorldPosition.x * 0.5 + 0.5) * window.innerWidth;
        const y = -(asteroidLabelWorldPosition.y * 0.5 - 0.5) * window.innerHeight;

        ast.label.style.left = `${x}px`;
        ast.label.style.top = `${y}px`;
        ast.label.style.opacity = distance < factFullOpacityRadius ? "1" : "0";
      } else {
        ast.label.style.opacity = "0";
      }
    }

    if (distance < nearestDistance) {
      nearest = section;
      nearestDistance = distance;
    }
  });

  const nearestMetrics = nearest
    ? getPlanetDockMetrics(nearest)
    : {
      dockRadius: dockRadius * sceneScaleFactor,
      undockRadius: undockRadius * sceneScaleFactor,
    };
  const effectiveDockRadius = nearestMetrics.dockRadius;
  const effectiveUndockRadius = nearestMetrics.undockRadius;

  dockCandidate = nearestDistance < effectiveUndockRadius ? nearest : null;

  const isActiveAutoPilotArrival = isAutoPiloting && autoPilotSection?.id === nearest?.id;
  const shouldSuppressImmediateRedock =
    isAutoPiloting && autoPilotSection && autoPilotSection.id !== nearest?.id;

  if (activeSection && activeSection.id === nearest?.id && nearestDistance > effectiveUndockRadius) {
    undockFrom(activeSection);
  } else if (
    !activeSection &&
    nearest &&
    !shouldSuppressImmediateRedock &&
    (nearestDistance < effectiveDockRadius || (isActiveAutoPilotArrival && nearestDistance < effectiveUndockRadius))
  ) {
    dockWith(nearest);
  } else if (activeSection && dockCandidate?.id === activeSection.id && nearestDistance < effectiveDockRadius) {
    updateStatus(`Docked at ${activeSection.title}`);
  } else if (dockCandidate && !isMobileMode() && !activeSection && !isAutoPiloting) {
    updateStatus(`Approaching ${dockCandidate.title}. Auto-docking when close enough.`);
  } else if (!activeSection && !isAutoPiloting) {
    updateStatus("Cruising open space");
  }
}

function handleDesktopMovement(delta) {
  const yawRate = 2.4 * delta;
  const thrust = keyboard.has("Shift") ? 24.0 : 12.0;
  const drag = 0.92;
  const liftSpeed = keyboard.has("Shift") ? 18.0 : 10.0;

  if (keyboard.has("ArrowLeft") || keyboard.has("a") || keyboard.has("4")) {
    rocket.rotation.y -= yawRate;
  }

  if (keyboard.has("ArrowRight") || keyboard.has("d") || keyboard.has("6")) {
    rocket.rotation.y += yawRate;
  }

  if (keyboard.has("ArrowUp") || keyboard.has("w") || keyboard.has("8")) {
    forwardDirection.set(1, 0, 0);
    forwardDirection.applyAxisAngle(yAxis, rocket.rotation.y);
    rocketVelocity.add(forwardDirection.multiplyScalar(thrust * delta));
  }

  if (keyboard.has("ArrowDown") || keyboard.has("s") || keyboard.has("2")) {
    forwardDirection.set(-1, 0, 0);
    forwardDirection.applyAxisAngle(yAxis, rocket.rotation.y);
    rocketVelocity.add(forwardDirection.multiplyScalar(thrust * 0.55 * delta));
  }

  if (keyboard.has("q")) {
    rocket.position.y += liftSpeed * delta;
  }

  if (keyboard.has("elevdown")) {
    rocket.position.y -= liftSpeed * delta;
  }

  if (keyboard.has("9")) {
    rocket.position.y += liftSpeed * delta;
  }

  if (keyboard.has("3")) {
    rocket.position.y -= liftSpeed * delta;
  }

  let verticalInput = 0;
  if (keyboard.has("q") || keyboard.has("9")) verticalInput += 1;
  if (keyboard.has("elevdown") || keyboard.has("3")) verticalInput -= 1;
  const targetPitch = verticalInput * 0.44;

  rocket.rotation.z = THREE.MathUtils.lerp(rocket.rotation.z, rocketVelocity.length() * 0.02, 0.08);
  rocket.rotation.x = THREE.MathUtils.lerp(rocket.rotation.x, targetPitch, 0.08);

  rocketVelocity.multiplyScalar(drag);
  rocket.position.add(rocketVelocity);
  rocket.position.clamp(movementBoundsMin, movementBoundsMax);

  flame.scale.setScalar(0.9 + Math.min(rocketVelocity.length() * 0.22, 0.95));
  flame.material.opacity = 0.55 + Math.min(rocketVelocity.length() * 0.16, 0.35);
}

function handleAutoPilot(delta) {
  tempDirection.copy(autopilotTarget).sub(rocket.position);
  const distance = tempDirection.length();

  if (autoPilotSection) {
    const { dockRadius: targetDockRadius } = getPlanetDockMetrics(autoPilotSection);
    const distanceToPlanet = rocket.position.distanceTo(getSectionPosition(autoPilotSection));
    if (distanceToPlanet < targetDockRadius) {
      dockWith(autoPilotSection);
      return;
    }
  }

  if (distance < 0.15) {
    isAutoPiloting = false;
    autoPilotSection = null;
    return;
  }

  const direction = tempDirection.normalize();
  rocket.position.add(direction.multiplyScalar(Math.min(distance, delta * 45.0)));

  const yaw = Math.atan2(direction.z, direction.x);

  rocket.rotation.y = THREE.MathUtils.lerp(rocket.rotation.y, yaw, 0.08);
  cameraPitch = THREE.MathUtils.lerp(cameraPitch, THREE.MathUtils.clamp(direction.y * 0.55, -0.22, 0.22), 0.06);
  rocket.rotation.z = THREE.MathUtils.lerp(rocket.rotation.z, 0.06, 0.08);
  rocket.rotation.x = THREE.MathUtils.lerp(rocket.rotation.x, -cameraPitch * 0.14, 0.08);
  flame.scale.setScalar(1.15);
  flame.material.opacity = 0.95;
}

function updateTrail() {
  const delta = Math.min((performance.now() - lastTime) / 1000, 0.05) || 0.016;

  trailAnchor.set(-1.65, 0, 0);
  trailAnchor.applyAxisAngle(yAxis, rocket.rotation.y);
  trailAnchor.add(rocket.position);

  for (let index = trailLength - 1; index > 0; index -= 1) {
    trailPoints[index].lerp(trailPoints[index - 1], 0.78);
  }

  const speed = Math.min(rocketVelocity.length() * 0.9 + (isAutoPiloting ? 0.7 : 0), 1.2);
  trailPoints[0].lerp(trailAnchor, 0.34 + speed * 0.2);

  /* ── Ribbon geometry ── */
  const pulse = performance.now() * 0.03;

  for (let i = 0; i < ribbonSegments; i++) {
    const t = i / (ribbonSegments - 1);
    const baseWidth = (0.35 + speed * 0.45) * (1 - t * t);
    const turbulence = Math.sin(pulse * 1.2 + i * 0.7) * 0.06 * (1 - t);
    const width = Math.max(baseWidth + turbulence, 0);

    if (i < ribbonSegments - 1) {
      trailSegmentDirection.copy(trailPoints[i + 1]).sub(trailPoints[i]).normalize();
    }
    trailPerpendicular.crossVectors(trailSegmentDirection, trailCamUp).normalize().multiplyScalar(width);

    const vi = i * 6;
    ribbonPositions[vi] = trailPoints[i].x + trailPerpendicular.x;
    ribbonPositions[vi + 1] = trailPoints[i].y + trailPerpendicular.y;
    ribbonPositions[vi + 2] = trailPoints[i].z + trailPerpendicular.z;
    ribbonPositions[vi + 3] = trailPoints[i].x - trailPerpendicular.x;
    ribbonPositions[vi + 4] = trailPoints[i].y - trailPerpendicular.y;
    ribbonPositions[vi + 5] = trailPoints[i].z - trailPerpendicular.z;

    const ci = i * 8;
    const alpha = (1 - t * t) * (0.25 + speed * 0.55);
    const r = THREE.MathUtils.lerp(1.0, 0.95, t);
    const g = THREE.MathUtils.lerp(0.75, 0.3, t);
    const b = THREE.MathUtils.lerp(0.35, 0.08, t);
    ribbonColors[ci] = r;
    ribbonColors[ci + 1] = g;
    ribbonColors[ci + 2] = b;
    ribbonColors[ci + 3] = alpha;
    ribbonColors[ci + 4] = r;
    ribbonColors[ci + 5] = g;
    ribbonColors[ci + 6] = b;
    ribbonColors[ci + 7] = alpha;
  }

  ribbonGeometry.attributes.position.needsUpdate = true;
  ribbonGeometry.attributes.color.needsUpdate = true;

  /* ── Smoke particles ── */
  smokeSpawnTimer += delta;
  const spawnInterval = speed > 0.15 ? 0.03 : 0.08;

  if (smokeSpawnTimer >= spawnInterval) {
    smokeSpawnTimer = 0;
    const inactive = smokeParticles.find((p) => !p.active);
    if (inactive) {
      inactive.active = true;
      inactive.life = 0;
      inactive.maxLife = 1.2 + Math.random() * 1.2;
      inactive.sprite.position.copy(trailAnchor);
      smokeBackDirection.set(-1, 0, 0).applyAxisAngle(yAxis, rocket.rotation.y);
      inactive.velocity.copy(smokeBackDirection).multiplyScalar(1.5 + speed * 2.5);
      inactive.velocity.x += (Math.random() - 0.5) * 0.8;
      inactive.velocity.y += (Math.random() - 0.5) * 0.6;
      inactive.velocity.z += (Math.random() - 0.5) * 0.8;
    }
  }

  smokeParticles.forEach((p) => {
    if (!p.active) return;
    p.life += delta;
    const t = p.life / p.maxLife;
    if (t >= 1) {
      p.active = false;
      p.sprite.material.opacity = 0;
      p.sprite.scale.setScalar(0.01);
      return;
    }
    p.sprite.position.addScaledVector(p.velocity, delta);
    p.velocity.multiplyScalar(0.97);
    const size = (0.3 + speed * 0.5) * (0.3 + t * 2.5);
    p.sprite.scale.setScalar(size);
    const fadeIn = Math.min(t * 8, 1);
    const fadeOut = 1 - t * t;
    p.sprite.material.opacity = fadeIn * fadeOut * (0.2 + speed * 0.35);
  });

  /* ── Plume, flame & effects ── */
  const flicker = 0.92 + Math.sin(pulse) * 0.08;
  const burnBoost = sunBurnTime > 0 ? 1 + (sunBurnTime / 0.75) * 2.2 : 1;
  const plumeStrength = 1 + speed * 0.95;
  plumeOuter.scale.set(
    (1.15 + speed * 0.85) * burnBoost,
    (0.92 + speed * 0.45) * burnBoost,
    (0.92 + speed * 0.45) * burnBoost,
  );
  plumeInner.scale.set(
    (1.05 + speed * 0.72) * burnBoost,
    (0.92 + speed * 0.34) * burnBoost,
    (0.92 + speed * 0.34) * burnBoost,
  );
  plumeGlow.scale.setScalar((0.95 + speed * 0.58) * burnBoost);
  plumeOuter.material.opacity = Math.min(0.24 + speed * 0.42 + (burnBoost - 1) * 0.22, 1);
  plumeInner.material.opacity = Math.min(0.34 + speed * 0.5 + (burnBoost - 1) * 0.2, 1);
  plumeGlow.material.opacity = Math.min((0.38 + speed * 0.48 + (burnBoost - 1) * 0.18) * flicker, 1);

  flame.scale.set(
    (1.18 + speed * 0.68) * burnBoost,
    (1 + speed * 0.3) * burnBoost,
    (1 + speed * 0.3) * burnBoost,
  );
  flame.material.opacity = Math.min(0.62 + speed * 0.34 + (burnBoost - 1) * 0.18, 1);
  flameCore.scale.set(
    (1.06 + speed * 0.48) * burnBoost,
    (0.94 + speed * 0.16) * burnBoost,
    (0.94 + speed * 0.16) * burnBoost,
  );
  flameCore.material.opacity = Math.min(0.78 + speed * 0.2 + (burnBoost - 1) * 0.14, 1);
  exhaustHalo.scale.setScalar((0.96 + speed * 0.52) * burnBoost);
  exhaustHalo.material.opacity = Math.min((0.22 + speed * 0.28 + (burnBoost - 1) * 0.12) * (0.9 + Math.sin(pulse * 1.4) * 0.1), 1);

  boosterFlames.forEach((boosterFlame, index) => {
    const offsetPulse = pulse + index * 1.2;
    const boosterScale = 0.9 + speed * 0.55 + Math.sin(offsetPulse * 1.8) * 0.08;
    boosterFlame.scale.set(1, boosterScale, boosterScale);
    boosterFlame.material.opacity = 0.3 + speed * 0.32;
  });

  shockDiamonds.forEach((diamond, index) => {
    const diamondScale = plumeStrength + speed * (0.34 - index * 0.06) + Math.sin(pulse * 1.7 - index * 0.5) * 0.06;
    diamond.scale.setScalar(diamondScale);
    diamond.position.x = -1.85 - index * (0.3 + speed * 0.18);
    diamond.material.opacity = 0.24 + speed * (0.38 - index * 0.06);
  });
}

function updateCamera() {
  const chaseDistance = currentLayout.chaseDistance * zoomScale;
  const chaseHeight = currentLayout.chaseHeight * zoomScale;

  cameraOffset.set(-chaseDistance, chaseHeight, 0);
  cameraOffset.applyAxisAngle(yAxis, rocket.rotation.y);
  desiredCameraPosition.copy(rocket.position).add(cameraOffset);
  camera.position.lerp(desiredCameraPosition, isMobileMode() ? 0.05 : 0.085);

  horizontalForward.set(1, 0, 0);
  horizontalForward.applyAxisAngle(yAxis, rocket.rotation.y);
  cameraLookTarget.copy(rocket.position).add(cameraLookOffset).add(horizontalForward.multiplyScalar(6.2));
  camera.lookAt(cameraLookTarget);
}

function resolvePlanetCollisions() {
  planets.forEach((planetGroup) => {
    if (isAutoPiloting && autoPilotSection?.id === planetGroup.userData.section.id) {
      return;
    }

    if (undockGraceTime > 0 && undockGraceSection?.id === planetGroup.userData.section.id) {
      return;
    }

    const collisionRadius = planetGroup.userData.radius * sceneScaleFactor + 1.6;
    collisionOffset.copy(rocket.position).sub(planetGroup.position);
    let distance = collisionOffset.length();

    if (distance >= collisionRadius) {
      return;
    }

    if (distance < 0.001) {
      collisionOffset.set(1, 0, 0);
      distance = 1;
    }

    collisionNormal.copy(collisionOffset).divideScalar(distance);
    rocket.position.copy(planetGroup.position).addScaledVector(collisionNormal, collisionRadius);

    const inwardVelocity = rocketVelocity.dot(collisionNormal);
    if (inwardVelocity < 0) {
      rocketVelocity.addScaledVector(collisionNormal, -inwardVelocity * 1.1);
    }

    if (isAutoPiloting && autoPilotSection?.id !== planetGroup.userData.section.id) {
      isAutoPiloting = false;
      autoPilotSection = null;
      updateStatus(`Re-routing around ${planetGroup.userData.section.title}`);
    }
  });
}

function syncHud(now) {
  if (now - lastHudSyncTime < HUD_SYNC_INTERVAL_MS) {
    return;
  }

  lastHudSyncTime = now;

  const elapsed = now - missionStartTime;
  const dist1 = (voyagerStartDist1 + elapsed * voyagerSpeed1).toLocaleString();
  const dist2 = (voyagerStartDist2 + elapsed * voyagerSpeed2).toLocaleString();
  const voyager1DistanceText = `Distance from Earth: ${dist1} km`;
  const voyager2DistanceText = `Distance from Earth: ${dist2} km`;
  const voyager1Span = voyager1.userData.label.querySelector("span");
  const voyager2Span = voyager2.userData.label.querySelector("span");

  if (voyager1Span && voyager1Span.textContent !== voyager1DistanceText) {
    voyager1Span.textContent = voyager1DistanceText;
  }
  if (voyager2Span && voyager2Span.textContent !== voyager2DistanceText) {
    voyager2Span.textContent = voyager2DistanceText;
  }

  voyagerFrustum.setFromProjectionMatrix(
    voyagerFrustumMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
  );

  [voyager1, voyager2].forEach((voyager) => {
    const label = voyager.userData.label;
    const arrow = label.querySelector(".offscreen-arrow");
    const tether = label.querySelector(".hud-tether");
    const distToRocket = voyager.position.distanceTo(rocket.position);

    if (distToRocket > 350) {
      label.style.opacity = "0";
      return;
    }

    voyager.getWorldPosition(voyagerWorldPosition);

    if (voyagerFrustum.containsPoint(voyagerWorldPosition)) {
      voyagerProjectedPosition.copy(voyagerWorldPosition).project(camera);
      const x = (voyagerProjectedPosition.x * 0.5 + 0.5) * window.innerWidth;
      const y = -(voyagerProjectedPosition.y * 0.5 - 0.5) * window.innerHeight;

      label.style.left = `${x + 60}px`;
      label.style.top = `${y}px`;
      label.style.transform = "translateY(-50%)";
      label.style.opacity = Math.hypot(voyagerProjectedPosition.x, voyagerProjectedPosition.y) < 0.4 ? "1" : "0.4";

      if (tether) {
        tether.style.display = "block";
      }
      if (arrow) {
        arrow.style.display = "none";
      }
      return;
    }

    voyagerProjectedPosition.copy(voyagerWorldPosition).project(camera);
    const margin = 120;
    const x = Math.max(
      margin,
      Math.min(window.innerWidth - margin, (voyagerProjectedPosition.x * 0.5 + 0.5) * window.innerWidth),
    );
    const y = Math.max(
      margin,
      Math.min(window.innerHeight - margin, -(voyagerProjectedPosition.y * 0.5 - 0.5) * window.innerHeight),
    );

    label.style.left = `${x}px`;
    label.style.top = `${y}px`;
    label.style.opacity = "1";

    if (arrow) {
      arrow.style.display = "block";
      arrow.style.transform = `translateY(-50%) rotate(${Math.atan2(y - window.innerHeight / 2, x - window.innerWidth / 2)}rad)`;
    }
    if (tether) {
      tether.style.display = "none";
    }
  });
}

function updateRenderQuality(width, height) {
  const isReducedQuality = pointerQuery.matches || currentLayout !== LAYOUT_PRESETS.desktop;
  const pixelRatioCap = isReducedQuality ? 1.25 : 2;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
  usePostProcessing = !isReducedQuality;
  bloomPass.enabled = usePostProcessing;

  if (usePostProcessing) {
    composer.setSize(width, height);
  }
}

function adjustZoom(direction) {
  zoomScale = THREE.MathUtils.clamp(zoomScale + direction * zoomStep, minZoomScale, maxZoomScale);
  updateStatus(zoomScale === minZoomScale ? "Zoomed fully in" : `Zoom level ${zoomScale.toFixed(2)}x`);
}

function resize() {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  applyResponsiveSceneLayout();
  camera.fov = currentLayout.fov;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  updateRenderQuality(width, height);
  renderer.setSize(width, height, false);
}

window.addEventListener("resize", resize);
pointerQuery.addEventListener("change", resize);
mobileQuery.addEventListener("change", resize);

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
    event.preventDefault();
  }

  if (event.key === "+" || event.key === "=" || event.code === "NumpadAdd") {
    adjustZoom(-1);
    return;
  }

  if (event.key === "-" || event.key === "_" || event.code === "NumpadSubtract") {
    adjustZoom(1);
    return;
  }

  if (key === "f") {
    const currentIndex = activeSection ? sections.findIndex((section) => section.id === activeSection.id) : -1;
    const nextSection = sections[(currentIndex + 1) % sections.length];
    beginAutoPilot(nextSection, true);
    return;
  }

  if (key === "q") {
    keyboard.add("q");
    return;
  }

  if (key === "z") {
    keyboard.add("elevdown");
    return;
  }

  keyboard.add(key);
});

window.addEventListener("keyup", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (key === "q") {
    keyboard.delete("q");
    return;
  }

  if (key === "z") {
    keyboard.delete("elevdown");
    return;
  }

  keyboard.delete(key);
});

let dragStartX = 0;
let dragStartY = 0;
let isDragging = false;
let isPointerDown = false;
const dragThreshold = 8;

function resetPointerState() {
  isPointerDown = false;
  isDragging = false;
}

canvas.addEventListener("pointerdown", (event) => {
  dragStartX = event.clientX;
  dragStartY = event.clientY;
  isDragging = false;
  isPointerDown = true;
});

canvas.addEventListener("pointermove", (event) => {
  if (!isPointerDown) return;
  const dx = event.clientX - dragStartX;
  const dy = event.clientY - dragStartY;

  if (!isDragging && Math.hypot(dx, dy) > dragThreshold) {
    isDragging = true;
  }

  if (isDragging) {
    const sensitivity = 0.006;
    rocket.rotation.y -= dx * sensitivity;
    dragStartX = event.clientX;
    dragStartY = event.clientY;
  }
});

canvas.addEventListener("pointerup", (event) => {
  if (isDragging) {
    resetPointerState();
    return;
  }

  resetPointerState();

  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  const intersections = raycaster.intersectObjects(clickablePlanets, false);
  if (!intersections.length) {
    return;
  }

  const section = intersections[0].object.parent?.userData?.section;
  if (section) {
    beginAutoPilot(section, true);
  }
});

canvas.addEventListener("pointercancel", resetPointerState);
canvas.addEventListener("pointerleave", resetPointerState);

zoomInButton.addEventListener("click", () => adjustZoom(-1));
zoomOutButton.addEventListener("click", () => adjustZoom(1));

let lastTime = performance.now();

function tick(now) {
  if (!isLoaded) {
    camera.position.set(0, 8, 400); // Lock it out in deep space physically while parsing
    if (!lastTime) lastTime = now;
    requestAnimationFrame(tick);
    return;
  }

  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  if (undockGraceTime > 0) {
    undockGraceTime = Math.max(0, undockGraceTime - delta);
    if (undockGraceTime === 0) {
      undockGraceSection = null;
    }
  }

  if (sunBurnTime > 0) {
    sunBurnTime = Math.max(0, sunBurnTime - delta);
  }
  if (sunRespawnTimer > 0) {
    sunRespawnTimer = Math.max(0, sunRespawnTimer - delta);
    if (sunRespawnTimer === 0) {
      respawnAtEarth(true);
    }
  }

  if (sunBurnOverlay) {
    const burnProgress = sunBurnTime > 0 ? sunBurnTime / 0.75 : 0;
    sunBurnOverlay.style.opacity = burnProgress > 0 ? `${0.18 + burnProgress * 0.72}` : "0";
  }

  stars.rotation.y += 0.00018;
  stars.rotation.x += 0.00003;

  if (nebulaField) {
    nebulaField.rotation.y += 0.00005;
    nebulaField.rotation.z += 0.00002;
  }

  if (sunRespawnTimer > 0) {
    rocket.rotation.z += delta * 2.8;
    rocket.rotation.x = THREE.MathUtils.lerp(rocket.rotation.x, 0.8, 0.1);
    rocket.rotation.y += delta * 1.9;
  } else if (isAutoPiloting) {
    handleAutoPilot(delta);
  } else {
    handleDesktopMovement(delta);
  }

  const sunCollisionRadius = sunGroup.userData.radius * sceneScaleFactor + 0.8;
  if (sunRespawnTimer <= 0 && rocket.position.distanceTo(sunGroup.position) < sunCollisionRadius) {
    triggerSunBurn();
  }

  resolvePlanetCollisions();

  updateDockCandidate();
  updateCamera();

  // Execute Cinematic Warp override over the standard updateCamera lerp
  if (cinematicFadeValue > 0) {
    cinematicFadeValue -= delta * 0.45;
    const warpProgress = Math.max(0, cinematicFadeValue);
    const easeProgress = warpProgress * warpProgress;

    // Lerp from Deep Space (400) to Sun Level (45)
    cinematicNearPosition.set(0, 8, 45 * sceneScaleFactor);
    camera.position.lerpVectors(cinematicNearPosition, cinematicFarPosition, easeProgress);
  }

  stars.position.copy(camera.position);
  galaxyMesh.position.copy(camera.position);

  voyager1.rotation.y += 0.0005;
  voyager1.rotation.z += 0.0002;
  voyager2.rotation.y += 0.0004;
  voyager2.rotation.x += 0.0003;

  asteroidBelt.rotation.y += 0.00015; // Subtle orbital drift for the entire belt

  updateSpaceDust();
  
  if (now - lastScannerUpdateTime > scannerUpdateInterval) {
    updateScanner();
    lastScannerUpdateTime = now;
  }

  // --- Comet Logic ---
  comet.userData.spawnTimer += delta;
  if (!comet.userData.isActive && comet.userData.spawnTimer > 45) { // Every 45 seconds
    comet.userData.isActive = true;
    comet.userData.spawnTimer = 0;
    const startSide = Math.random() > 0.5 ? 1 : -1;
    comet.position.set(startSide * 200, THREE.MathUtils.randFloat(-50, 50), -200);
    comet.userData.velocity.set(-startSide * 60, 0, 40); // Fast transit
  }

  if (comet.userData.isActive) {
    comet.position.addScaledVector(comet.userData.velocity, delta);

    const positions = comet.userData.positions;
    for (let i = 0; i < 200; i++) {
      const idx = i * 3;
      // Slowly drift old particles back
      positions[idx] -= (comet.userData.velocity.x * 0.05) + Math.random() * 0.1;
      positions[idx + 1] += Math.random() * 0.1 - 0.05;
      positions[idx + 2] -= (comet.userData.velocity.z * 0.05) + Math.random() * 0.1;

      // Reset particles near core occasionally
      if (Math.abs(positions[idx]) > 15) {
        positions[idx] = 0;
        positions[idx + 1] = 0;
        positions[idx + 2] = 0;
      }
    }
    comet.children[1].geometry.attributes.position.needsUpdate = true;

    if (comet.position.z > 200) {
      comet.userData.isActive = false;
      comet.position.y = 500; // Reset
    }
  }

  // --- HUD Sway Logic ---
  // (Removed per user request)

  // --- Proximity "Whoosh" & Gravity Slingshot ---
  planets.forEach(p => {
    const dist = rocket.position.distanceTo(p.position);
    if (dist < 15 && !isAutoPiloting && rocketVelocity.length() > 0.1) {
      // Slingshot: Add a slight pull vector
      slingshotPull.copy(p.position).sub(rocket.position).normalize().multiplyScalar(0.005);
      rocketVelocity.add(slingshotPull);

      // Play whoosh occasionally
      if (Math.random() < 0.01) SoundEngine.playWhoosh(1.0 - (dist / 15));
    }
  });

  updateTrail();
  syncHud(now);
  if (usePostProcessing) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}

resize();
respawnAtEarth(false);
requestAnimationFrame(tick);

// Global debug access for the console
window.comet = comet;
window.scene = scene;
window.camera = camera;
window.rocket = rocket;
window.planets = planets;
