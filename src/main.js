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
    fov: 58,
    chaseDistance: 15.5,
    chaseHeight: 6.2,
    positions: {
      about: new THREE.Vector3(-28, 2, -24),
      skills: new THREE.Vector3(24, -2, -12),
      projects: new THREE.Vector3(20, 1, 28),
      contact: new THREE.Vector3(-10, -5, 24),
    },
  },
  tablet: {
    scale: 0.9,
    fov: 64,
    chaseDistance: 18,
    chaseHeight: 7,
    positions: {
      about: new THREE.Vector3(-22, 2, -18),
      skills: new THREE.Vector3(19, -1, -8),
      projects: new THREE.Vector3(16, 1, 20),
      contact: new THREE.Vector3(-8, -4, 18),
    },
  },
  mobile: {
    scale: 0.78,
    fov: 68,
    chaseDistance: 20.5,
    chaseHeight: 8,
    positions: {
      about: new THREE.Vector3(-16, 2, -12),
      skills: new THREE.Vector3(14, -1, -4),
      projects: new THREE.Vector3(12, 1, 13),
      contact: new THREE.Vector3(-6, -3, 12),
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

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

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

const hull = new THREE.Mesh(
  new THREE.CylinderGeometry(0.46, 0.72, 2.9, 18),
  new THREE.MeshStandardMaterial({
    color: 0xe5edf5,
    metalness: 0.35,
    roughness: 0.38,
  }),
);
hull.rotation.z = Math.PI / 2;
rocket.add(hull);

const nose = new THREE.Mesh(
  new THREE.ConeGeometry(0.48, 1.1, 18),
  new THREE.MeshStandardMaterial({
    color: 0xff8469,
    metalness: 0.1,
    roughness: 0.48,
  }),
);
nose.rotation.z = -Math.PI / 2;
nose.position.x = 1.9;
rocket.add(nose);

const finMaterial = new THREE.MeshStandardMaterial({
  color: 0x73d6ff,
  metalness: 0.2,
  roughness: 0.44,
});

for (const side of [-1, 1]) {
  const fin = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.16), finMaterial);
  fin.position.set(-0.25, side * 0.82, 0);
  fin.rotation.z = side * 0.32;
  rocket.add(fin);
}

const flame = new THREE.Mesh(
  new THREE.ConeGeometry(0.28, 0.95, 16),
  new THREE.MeshBasicMaterial({
    color: 0xffd36f,
    transparent: true,
    opacity: 0.88,
  }),
);
flame.rotation.z = Math.PI / 2;
flame.position.x = -1.9;
rocket.add(flame);

rocket.position.set(0, 0, 0);
scene.add(rocket);

const rocketVelocity = new THREE.Vector3();
const autopilotTarget = new THREE.Vector3();
const cameraLookTarget = new THREE.Vector3();
const desiredCameraPosition = new THREE.Vector3();
const tempDirection = new THREE.Vector3();
const forwardDirection = new THREE.Vector3();
const horizontalForward = new THREE.Vector3();
const cameraOffset = new THREE.Vector3();
const zoomStep = 0.18;
const minZoomScale = 1;
const maxZoomScale = 2.3;
const dockRadius = 9.2;
const undockRadius = 12.8;

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

  if (window.innerWidth < 1100 || window.innerHeight < 760) {
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
    rocket.position.copy(getSectionPosition(activeSection)).add(new THREE.Vector3(6.8 * sceneScaleFactor, 0, 0));
  } else if (!activeSection && !isAutoPiloting && previousScale !== 0) {
    rocket.position.multiplyScalar(sceneScaleFactor / previousScale);
  }

  if (dockCandidate) {
    autopilotTarget.copy(getSectionPosition(dockCandidate)).add(new THREE.Vector3(7.2 * sceneScaleFactor, 0.2, 0));
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
  autopilotTarget.copy(getSectionPosition(section)).add(new THREE.Vector3(7.2 * sceneScaleFactor, 0.2, 0));
  isAutoPiloting = true;
  setContent(section, announceSelection ? `Autopilot engaged for ${section.title}. The rocket is aligning for approach.` : null);
  updateStatus(`Autopilot set for ${section.title}`);
}

function dockWith(section) {
  activeSection = section;
  isAutoPiloting = false;
  rocketVelocity.multiplyScalar(0);
  rocket.position.copy(getSectionPosition(section)).add(new THREE.Vector3(6.8 * sceneScaleFactor, 0, 0));
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
    rocket.rotation.y += yawRate;
  }

  if (keyboard.has("ArrowRight") || keyboard.has("d") || keyboard.has("6")) {
    rocket.rotation.y -= yawRate;
  }

  if (keyboard.has("ArrowUp") || keyboard.has("w") || keyboard.has("8")) {
    forwardDirection.set(-1, 0, 0);
    forwardDirection.applyAxisAngle(yAxis, rocket.rotation.y);
    rocketVelocity.add(forwardDirection.multiplyScalar(thrust * delta));
  }

  if (keyboard.has("ArrowDown") || keyboard.has("s") || keyboard.has("2")) {
    forwardDirection.set(1, 0, 0);
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

  rocket.rotation.z = THREE.MathUtils.lerp(rocket.rotation.z, rocketVelocity.length() * 0.02, 0.08);
  rocket.rotation.x = THREE.MathUtils.lerp(rocket.rotation.x, 0, 0.08);

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

  const yaw = Math.atan2(direction.z, direction.x) + Math.PI;

  rocket.rotation.y = THREE.MathUtils.lerp(rocket.rotation.y, yaw, 0.08);
  cameraPitch = THREE.MathUtils.lerp(cameraPitch, THREE.MathUtils.clamp(direction.y * 0.55, -0.22, 0.22), 0.06);
  rocket.rotation.z = THREE.MathUtils.lerp(rocket.rotation.z, 0.06, 0.08);
  rocket.rotation.x = THREE.MathUtils.lerp(rocket.rotation.x, -cameraPitch * 0.14, 0.08);
  flame.scale.setScalar(1.15);
  flame.material.opacity = 0.95;
}

function updateCamera() {
  const totalPitch = THREE.MathUtils.clamp(cameraPitch, -0.35, 0.35);
  const chaseDistance = currentLayout.chaseDistance * zoomScale;
  const chaseHeight = currentLayout.chaseHeight * zoomScale;

  cameraOffset.set(chaseDistance, chaseHeight + totalPitch * 8, 0);
  cameraOffset.applyAxisAngle(yAxis, rocket.rotation.y);
  desiredCameraPosition.copy(rocket.position).add(cameraOffset);
  camera.position.lerp(desiredCameraPosition, isMobileMode() ? 0.04 : 0.075);

  horizontalForward.set(-1, 0, 0);
  horizontalForward.applyAxisAngle(yAxis, rocket.rotation.y);
  cameraLookTarget.copy(rocket.position).add(new THREE.Vector3(0, 1.2, 0)).add(horizontalForward.multiplyScalar(4.6));
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

canvas.addEventListener("pointerup", (event) => {
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
    if (isMobileMode() && !activeSection) {
      beginAutoPilot(sections[0]);
    }

    handleDesktopMovement(delta);
  }

  updateDockCandidate();
  updateCamera();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

setContent(null);
resize();
requestAnimationFrame(tick);
