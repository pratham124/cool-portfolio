import * as THREE from "three";
import "./styles.css";

const sections = [
  {
    id: "about",
    title: "Earth",
    subtitle: "About Me",
    description:
      "A quick read on your background, what you build, and the kind of work you want to attract.",
    color: "#6cb7ff",
    position: new THREE.Vector3(-28, 2, -24),
    facts: [
      ["Background", "Designer-minded developer with a bias for motion and storytelling."],
      ["Current Focus", "Interactive frontends, product polish, and memorable user journeys."],
      ["Approach", "Build interfaces that read clearly but still feel cinematic."],
      ["Working Style", "Fast iteration, strong execution, and attention to detail."],
    ],
  },
  {
    id: "skills",
    title: "Mars",
    subtitle: "Skills",
    description:
      "A technical inventory planet for your stack, process, and the disciplines you bring to a team.",
    color: "#d96f43",
    position: new THREE.Vector3(24, -2, -12),
    facts: [
      ["Frontend", "React, TypeScript, accessible UI, animation systems, performance tuning."],
      ["Creative Tech", "Three.js scenes, motion design, prototyping, visual direction."],
      ["Product", "Interaction design, content hierarchy, cross-functional collaboration."],
      ["Workflow", "Git, testing, code review, rapid iteration, maintainable systems."],
    ],
  },
  {
    id: "projects",
    title: "Jupiter",
    subtitle: "Projects",
    description:
      "Feature flagship projects here, each framed as a mission with outcome, stack, and impact.",
    color: "#d9b38c",
    position: new THREE.Vector3(20, 1, 28),
    facts: [
      ["Flagship Build", "Interactive marketing site with immersive 3D transitions and CMS integration."],
      ["Product App", "Dashboard redesign that simplified complex data workflows and improved clarity."],
      ["Experiment", "Generative visual playground for motion, shaders, and playful navigation."],
      ["Impact", "Tie every project to measurable outcomes, not just screenshots."],
    ],
  },
  {
    id: "contact",
    title: "Saturn",
    subtitle: "Contact",
    description:
      "A direct landing zone for your email, socials, availability, and a short invitation to collaborate.",
    color: "#e6d28a",
    position: new THREE.Vector3(-10, -5, 24),
    facts: [
      ["Email", "you@example.com"],
      ["LinkedIn", "linkedin.com/in/your-name"],
      ["GitHub", "github.com/your-name"],
      ["Availability", "Open to freelance, product design partnerships, and in-house frontend roles."],
    ],
  },
];

const LAYOUT_PRESETS = {
  desktop: {
    scale: 1,
    fov: 62,
    chaseDistance: 18.5,
    chaseHeight: 5.8,
    positions: {
      about: new THREE.Vector3(-28, 2, -24),
      skills: new THREE.Vector3(24, -2, -12),
      projects: new THREE.Vector3(20, 1, 28),
      contact: new THREE.Vector3(-10, -5, 24),
    },
  },
  tablet: {
    scale: 0.92,
    fov: 64,
    chaseDistance: 20,
    chaseHeight: 6.6,
    positions: {
      about: new THREE.Vector3(-26, 2, -20),
      skills: new THREE.Vector3(21, -2, -10),
      projects: new THREE.Vector3(17, 1, 22),
      contact: new THREE.Vector3(-10, -5, 20),
    },
  },
  mobile: {
    scale: 0.68,
    fov: 72,
    chaseDistance: 23,
    chaseHeight: 8.8,
    positions: {
      about: new THREE.Vector3(-18, 3, -10),
      skills: new THREE.Vector3(14, -2, -6),
      projects: new THREE.Vector3(10, 2, 12),
      contact: new THREE.Vector3(-10, -4, 10),
    },
  },
};

const canvas = document.querySelector(".scene-canvas");
const statusPill = document.getElementById("status-pill");
const titleEl = document.getElementById("section-title");
const kickerEl = document.getElementById("section-kicker");
const descriptionEl = document.getElementById("section-description");
const pointsEl = document.getElementById("section-points");
const infoCardEl = document.querySelector(".info-card");
const zoomInButton = document.getElementById("zoom-in");
const zoomOutButton = document.getElementById("zoom-out");

const pointerQuery = window.matchMedia("(pointer: coarse)");
const mobileQuery = window.matchMedia("(max-width: 900px)");
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const yAxis = new THREE.Vector3(0, 1, 0);
const boosterFlames = [];

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight, false);

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x020612, 50, 160);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.set(0, 8, 18);

scene.add(new THREE.AmbientLight(0xd8f8ff, 1.35));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.9);
keyLight.position.set(18, 20, 10);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x8cc8ff, 25, 120, 2);
rimLight.position.set(-22, 8, -10);
scene.add(rimLight);

const starGeometry = new THREE.BufferGeometry();
const starCount = 1800;
const starPositions = new Float32Array(starCount * 3);

for (let index = 0; index < starCount; index += 1) {
  const offset = index * 3;
  starPositions[offset] = THREE.MathUtils.randFloatSpread(220);
  starPositions[offset + 1] = THREE.MathUtils.randFloatSpread(140);
  starPositions[offset + 2] = THREE.MathUtils.randFloatSpread(220);
}

starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    color: 0xd6f5ff,
    size: 0.48,
    transparent: true,
    opacity: 0.9,
  }),
);
scene.add(stars);

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
let isAutoPiloting = false;

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

function createPlanetTexture(name, baseColor) {
  const size = 1024;
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = size;
  textureCanvas.height = size;
  const ctx = textureCanvas.getContext("2d");
  const base = new THREE.Color(baseColor);

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

function createPlanet(section) {
  const group = new THREE.Group();
  const baseColor = new THREE.Color(section.color);
  const planetConfig = {
    Earth: { radius: 4.5, glowRadius: 5.3, ringRadius: null },
    Mars: { radius: 4, glowRadius: 4.8, ringRadius: null },
    Jupiter: { radius: 5.6, glowRadius: 6.6, ringRadius: null },
    Saturn: { radius: 5.1, glowRadius: 6, ringRadius: 7.8 },
  }[section.title] || { radius: 4.5, glowRadius: 5.3, ringRadius: null };

  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(planetConfig.radius, 48, 48),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: createPlanetTexture(section.title, section.color),
      roughness: 0.92,
      metalness: 0.02,
    }),
  );
  group.add(planet);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(planetConfig.glowRadius, 32, 32),
    new THREE.MeshBasicMaterial({
      color: baseColor,
      transparent: true,
      opacity: 0.11,
    }),
  );
  group.add(glow);

  let ring = null;
  if (planetConfig.ringRadius) {
    ring = new THREE.Mesh(
      new THREE.TorusGeometry(planetConfig.ringRadius, 0.12, 16, 180),
      orbitRingMaterial.clone(),
    );
    ring.rotation.x = Math.PI / 2;
    ring.rotation.y = 0.48;
    ring.material.color = new THREE.Color("#b8a57b");
    ring.material.opacity = 0.48;
    group.add(ring);
  }

  group.position.copy(section.position);
  group.userData = {
    section,
    ring,
    glow,
    radius: planetConfig.radius,
  };
  scene.add(group);
  planets.push(group);
  clickablePlanets.push(planet);
}

sections.forEach(createPlanet);

function getPlanetGroup(section) {
  return planets.find((planetGroup) => planetGroup.userData.section.id === section.id) || null;
}

function getSectionPosition(section) {
  return getPlanetGroup(section)?.position || section.position;
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

  if (activeSection && !isAutoPiloting) {
    rocket.position.copy(getSectionPosition(activeSection)).add(new THREE.Vector3(-6.8 * sceneScaleFactor, 0, 0));
  } else if (!activeSection && !isAutoPiloting && previousScale !== 0) {
    rocket.position.multiplyScalar(sceneScaleFactor / previousScale);
  }

  if (dockCandidate) {
    autopilotTarget.copy(getSectionPosition(dockCandidate)).add(new THREE.Vector3(-7.2 * sceneScaleFactor, 0.2, 0));
  }
}

function setContent(section, customText) {
  infoCardEl.classList.toggle("is-hidden", !section);

  if (!section) {
    kickerEl.textContent = "";
    titleEl.textContent = "";
    descriptionEl.textContent = "";
    pointsEl.innerHTML = "";
    return;
  }

  kickerEl.textContent = section ? section.subtitle : "Portfolio";
  titleEl.textContent = section ? section.subtitle : "Explore the planets";
  descriptionEl.textContent =
    customText ||
    (section
      ? section.description
      : "Click a planet to jump to a section and fly around with the arrow keys.");

  pointsEl.innerHTML = "";

  const items = section
    ? section.facts
    : [
        ["Desktop", "Use the keypad or keyboard to steer the rocket and change its viewing angle while flying."],
        ["Mobile", "Tap a planet to engage autopilot, then use the zoom buttons to adjust your distance."],
        ["Scene", "A 3D universe with textured solar-system planets and a chase camera behind the rocket."],
        ["Portfolio", "Swap placeholder copy with your real story, projects, and contact links."],
      ];

  items.forEach(([label, value]) => {
    const pill = document.createElement("article");
    pill.className = "info-pill";
    pill.innerHTML = `<strong>${label}</strong><span>${value}</span>`;
    pointsEl.appendChild(pill);
  });
}

function updateStatus(text) {
  statusPill.textContent = text;
}

function beginAutoPilot(section, announceSelection = false) {
  dockCandidate = section;
  autopilotTarget.copy(getSectionPosition(section)).add(new THREE.Vector3(-7.2 * sceneScaleFactor, 0.2, 0));
  isAutoPiloting = true;
  setContent(section, announceSelection ? `Autopilot engaged for ${section.title}. The rocket is aligning for approach.` : null);
  updateStatus(`Autopilot set for ${section.title}`);
}

function dockWith(section) {
  activeSection = section;
  isAutoPiloting = false;
  rocketVelocity.multiplyScalar(0);
  rocket.position.copy(getSectionPosition(section)).add(new THREE.Vector3(-6.8 * sceneScaleFactor, 0, 0));
  updateStatus(`Docked at ${section.title}`);
  setContent(section, section.description);
}

function undockFrom(section) {
  if (!section) {
    return;
  }

  activeSection = null;
  updateStatus(`Departed ${section.title}`);
  setContent(null);
}

function isMobileMode() {
  return mobileQuery.matches || pointerQuery.matches;
}

function updateDockCandidate() {
  let nearest = null;
  let nearestDistance = Number.POSITIVE_INFINITY;

  planets.forEach((planetGroup, index) => {
    const section = sections[index];
    const distance = rocket.position.distanceTo(planetGroup.position);
    const pulse = 0.5 + Math.sin(performance.now() * 0.0012 + index) * 0.12;

    planetGroup.rotation.y += 0.0015 + index * 0.00025;
    planetGroup.userData.glow.material.opacity = distance < undockRadius ? 0.22 + pulse : 0.1 + pulse * 0.35;
    if (planetGroup.userData.ring) {
      planetGroup.userData.ring.material.opacity = distance < undockRadius ? 0.78 : 0.46;
    }

    if (distance < nearestDistance) {
      nearest = section;
      nearestDistance = distance;
    }
  });

  dockCandidate = nearestDistance < undockRadius * sceneScaleFactor ? nearest : null;

  if (activeSection && activeSection.id === nearest?.id && nearestDistance > undockRadius * sceneScaleFactor) {
    undockFrom(activeSection);
  } else if (!activeSection && nearest && nearestDistance < dockRadius * sceneScaleFactor) {
    dockWith(nearest);
  } else if (activeSection && dockCandidate?.id === activeSection.id && nearestDistance < dockRadius * sceneScaleFactor) {
    updateStatus(`Docked at ${activeSection.title}`);
  } else if (dockCandidate && !isMobileMode() && !activeSection) {
    updateStatus(`Approaching ${dockCandidate.title}. Auto-docking when close enough.`);
  } else if (!activeSection && !isAutoPiloting) {
    updateStatus("Cruising open space");
  }
}

function handleDesktopMovement(delta) {
  const yawRate = 2.1 * delta;
  const thrust = keyboard.has("Shift") ? 7.2 : 3.8;
  const drag = 0.88;
  const liftSpeed = keyboard.has("Shift") ? 8.5 : 5.2;

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
  rocket.position.clamp(new THREE.Vector3(-42, -12, -42), new THREE.Vector3(42, 12, 42));

  flame.scale.setScalar(0.9 + Math.min(rocketVelocity.length() * 0.22, 0.95));
  flame.material.opacity = 0.55 + Math.min(rocketVelocity.length() * 0.16, 0.35);
}

function handleAutoPilot(delta) {
  tempDirection.copy(autopilotTarget).sub(rocket.position);
  const distance = tempDirection.length();

  if (distance < 0.15) {
    isAutoPiloting = false;
    return;
  }

  const direction = tempDirection.normalize();
  rocket.position.add(direction.multiplyScalar(Math.min(distance, delta * 7.2)));

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
  const camRight = new THREE.Vector3();
  const camUp = new THREE.Vector3(0, 1, 0);
  const segDir = new THREE.Vector3();
  const perp = new THREE.Vector3();
  const pulse = performance.now() * 0.03;

  for (let i = 0; i < ribbonSegments; i++) {
    const t = i / (ribbonSegments - 1);
    const baseWidth = (0.35 + speed * 0.45) * (1 - t * t);
    const turbulence = Math.sin(pulse * 1.2 + i * 0.7) * 0.06 * (1 - t);
    const width = Math.max(baseWidth + turbulence, 0);

    if (i < ribbonSegments - 1) {
      segDir.copy(trailPoints[i + 1]).sub(trailPoints[i]).normalize();
    }
    perp.crossVectors(segDir, camUp).normalize().multiplyScalar(width);

    const vi = i * 6;
    ribbonPositions[vi] = trailPoints[i].x + perp.x;
    ribbonPositions[vi + 1] = trailPoints[i].y + perp.y;
    ribbonPositions[vi + 2] = trailPoints[i].z + perp.z;
    ribbonPositions[vi + 3] = trailPoints[i].x - perp.x;
    ribbonPositions[vi + 4] = trailPoints[i].y - perp.y;
    ribbonPositions[vi + 5] = trailPoints[i].z - perp.z;

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
      const backDir = new THREE.Vector3(-1, 0, 0).applyAxisAngle(yAxis, rocket.rotation.y);
      inactive.velocity.copy(backDir).multiplyScalar(1.5 + speed * 2.5);
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
  const plumeStrength = 1 + speed * 0.95;
  plumeOuter.scale.set(1.15 + speed * 0.85, 0.92 + speed * 0.45, 0.92 + speed * 0.45);
  plumeInner.scale.set(1.05 + speed * 0.72, 0.92 + speed * 0.34, 0.92 + speed * 0.34);
  plumeGlow.scale.setScalar(0.95 + speed * 0.58);
  plumeOuter.material.opacity = 0.24 + speed * 0.42;
  plumeInner.material.opacity = 0.34 + speed * 0.5;
  plumeGlow.material.opacity = (0.38 + speed * 0.48) * flicker;

  flame.scale.set(1.18 + speed * 0.68, 1 + speed * 0.3, 1 + speed * 0.3);
  flame.material.opacity = 0.62 + speed * 0.34;
  flameCore.scale.set(1.06 + speed * 0.48, 0.94 + speed * 0.16, 0.94 + speed * 0.16);
  flameCore.material.opacity = 0.78 + speed * 0.2;
  exhaustHalo.scale.setScalar(0.96 + speed * 0.52);
  exhaustHalo.material.opacity = (0.22 + speed * 0.28) * (0.9 + Math.sin(pulse * 1.4) * 0.1);

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
  cameraLookTarget.copy(rocket.position).add(new THREE.Vector3(0, 1.15, 0)).add(horizontalForward.multiplyScalar(6.2));
  camera.lookAt(cameraLookTarget);
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
  renderer.setSize(width, height, false);
}

window.addEventListener("resize", resize);
pointerQuery.addEventListener("change", resize);
mobileQuery.addEventListener("change", resize);

window.addEventListener("keydown", (event) => {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Tab"].includes(event.key)) {
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
  isPointerDown = false;
  if (isDragging) {
    isDragging = false;
    return;
  }

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

zoomInButton.addEventListener("click", () => adjustZoom(-1));
zoomOutButton.addEventListener("click", () => adjustZoom(1));

let lastTime = performance.now();

function tick(now) {
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;

  stars.rotation.y += 0.00018;
  stars.rotation.x += 0.00003;

  if (isAutoPiloting) {
    handleAutoPilot(delta);
  } else {
    handleDesktopMovement(delta);
  }

  updateDockCandidate();
  updateCamera();
  updateTrail();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

setContent(null);
resize();
requestAnimationFrame(tick);

