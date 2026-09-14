import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { tactileAudio } from '../../utils/tactileAudio';

// 3 Systems connected to the rotary detents
const SYSTEMS = [
  {
    id: 'assetflow',
    slug: 'assetflow',
    title: 'ASSETFLOW',
    tagline: 'POSTGRESQL GiST EXCLUSION // 100% ACID',
    metric: 'ZERO OVERLAPS',
    status: 'SHIPPED',
  },
  {
    id: 'crisissignal',
    slug: 'crisissignal',
    title: 'CRISIS-SIGNAL',
    tagline: 'LSTM AUTOENCODER // FLOWER FEDERATED',
    metric: '5-7 DAYS LEAD',
    status: 'ACTIVE',
  },
  {
    id: 'esg-audit-system',
    slug: 'esg-audit-system',
    title: 'ESG-AUDIT-SYS',
    tagline: 'AWS NITRO ENCLAVE // C2PA PROVENANCE',
    metric: 'CRYPTOGRAPHIC',
    status: 'ACTIVE',
  },
];

export default function TactileConsole3D({
  activeSystemIndex = 0,
  onSelectSystem,
  onInspect,
  className = '',
}) {
  const mountRef = useRef(null);
  const navigate = useNavigate();
  const [hoveredPart, setHoveredPart] = useState(null);
  const [isSoundMuted, setIsSoundMuted] = useState(() => tactileAudio.isMuted());

  // Refs to sync state with Three.js animation loop without re-instantiating scene
  const activeIndexRef = useRef(activeSystemIndex);
  const onSelectSystemRef = useRef(onSelectSystem);
  const onInspectRef = useRef(onInspect);

  useEffect(() => {
    activeIndexRef.current = activeSystemIndex;
  }, [activeSystemIndex]);

  useEffect(() => {
    onSelectSystemRef.current = onSelectSystem;
  }, [onSelectSystem]);

  useEffect(() => {
    onInspectRef.current = onInspect;
  }, [onInspect]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 4.2, 13.5);
    camera.lookAt(0, 0, 0);

    // 2. High-Performance Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 3. Precision Hardware Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfffdf5, 2.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainKeyLight.position.set(6, 14, 8);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    mainKeyLight.shadow.bias = -0.001;
    scene.add(mainKeyLight);

    const amberCausticLight = new THREE.PointLight(0xd97706, 3.5, 25);
    amberCausticLight.position.set(-6, 2, 4);
    scene.add(amberCausticLight);

    const rimLight = new THREE.PointLight(0x38bdf8, 1.8, 30);
    rimLight.position.set(7, -4, -4);
    scene.add(rimLight);

    // 4. Console Assembly Group
    const consoleGroup = new THREE.Group();
    // Default ergonomic tilt (15 degrees toward viewer)
    consoleGroup.rotation.x = 0.28;
    scene.add(consoleGroup);

    // ── MATERIALS ──
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x16181d,
      roughness: 0.35,
      metalness: 0.85,
    });

    const bezelMaterial = new THREE.MeshStandardMaterial({
      color: 0x0d0e11,
      roughness: 0.5,
      metalness: 0.5,
    });

    const knurledMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e333d,
      roughness: 0.25,
      metalness: 0.95,
    });

    const dialIndicatorMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      emissive: 0xb45309,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
    });

    const screwMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.3,
      metalness: 0.9,
    });

    const toggleBaseMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.4,
      metalness: 0.85,
    });

    const toggleLeverMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
    });

    const keycapBaseMat = new THREE.MeshStandardMaterial({
      color: 0x242831,
      roughness: 0.4,
      metalness: 0.6,
    });

    // ── MESHES: CHASSIS & FACEPLATE ──
    // Main Chassis
    const chassisGeom = new THREE.BoxGeometry(11.2, 5.8, 1.2);
    const chassisMesh = new THREE.Mesh(chassisGeom, chassisMaterial);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    consoleGroup.add(chassisMesh);

    // Recessed Screen Bezel
    const screenBezelGeom = new THREE.BoxGeometry(5.6, 2.6, 0.2);
    const screenBezelMesh = new THREE.Mesh(screenBezelGeom, bezelMaterial);
    screenBezelMesh.position.set(-2.2, 1.1, 0.61);
    consoleGroup.add(screenBezelMesh);

    // ── DYNAMIC CANVAS LED DOT MATRIX SCREEN (21st #24868) ──
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 256;
    const ctx = screenCanvas.getContext('2d');

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;

    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: false,
    });

    const screenGeom = new THREE.PlaneGeometry(5.3, 2.3);
    const screenMesh = new THREE.Mesh(screenGeom, screenMat);
    screenMesh.position.set(-2.2, 1.1, 0.72);
    consoleGroup.add(screenMesh);

    // ── ROTARY 3-WAY KNOB ASSEMBLY (21st #5404) ──
    const knobAssembly = new THREE.Group();
    knobAssembly.position.set(2.8, 0.8, 0.6);
    consoleGroup.add(knobAssembly);

    // Knob Beveled Base Ring
    const knobRingGeom = new THREE.CylinderGeometry(1.6, 1.7, 0.2, 32);
    knobRingGeom.rotateX(Math.PI / 2);
    const knobRingMesh = new THREE.Mesh(knobRingGeom, bezelMaterial);
    knobRingMesh.position.z = 0.05;
    knobAssembly.add(knobRingMesh);

    // Rotating Knurled Dial
    const knobDialGroup = new THREE.Group();
    knobAssembly.add(knobDialGroup);

    const knobBodyGeom = new THREE.CylinderGeometry(1.35, 1.35, 0.65, 36);
    knobBodyGeom.rotateX(Math.PI / 2);
    const knobBodyMesh = new THREE.Mesh(knobBodyGeom, knurledMetalMaterial);
    knobBodyMesh.castShadow = true;
    knobBodyMesh.position.z = 0.35;
    knobDialGroup.add(knobBodyMesh);

    // Knurled Dial Indicator Marker
    const indicatorGeom = new THREE.BoxGeometry(0.16, 0.8, 0.1);
    const indicatorMesh = new THREE.Mesh(indicatorGeom, dialIndicatorMaterial);
    indicatorMesh.position.set(0, 0.85, 0.7);
    knobDialGroup.add(indicatorMesh);

    // Tag for raycasting
    knobBodyMesh.userData = { type: 'knob' };

    // Dial detent target angles for the 3 systems (-45 deg, 0 deg, +45 deg)
    const DETENT_ANGLES = [-Math.PI / 4, 0, Math.PI / 4];

    // Dial LED Position Markers on Bezel
    const ledMarkers = [];
    DETENT_ANGLES.forEach((angle, idx) => {
      const ledGeom = new THREE.CircleGeometry(0.12, 16);
      const ledMat = new THREE.MeshBasicMaterial({
        color: idx === activeIndexRef.current ? 0xd97706 : 0x334155,
      });
      const ledMesh = new THREE.Mesh(ledGeom, ledMat);
      const radius = 2.05;
      ledMesh.position.set(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius,
        0.16
      );
      knobAssembly.add(ledMesh);
      ledMarkers.push(ledMat);
    });

    // ── INDUSTRIAL SAFETY BREAKER TOGGLE LEVER (21st #24092) ──
    const breakerGroup = new THREE.Group();
    breakerGroup.position.set(4.6, 0.8, 0.6);
    consoleGroup.add(breakerGroup);

    const toggleBaseGeom = new THREE.CylinderGeometry(0.45, 0.5, 0.3, 16);
    toggleBaseGeom.rotateX(Math.PI / 2);
    const toggleBase = new THREE.Mesh(toggleBaseGeom, toggleBaseMaterial);
    toggleBase.position.z = 0.1;
    breakerGroup.add(toggleBase);

    const leverHinge = new THREE.Group();
    leverHinge.position.z = 0.25;
    breakerGroup.add(leverHinge);

    const leverGeom = new THREE.CylinderGeometry(0.16, 0.24, 1.4, 16);
    leverGeom.translate(0, 0.7, 0);
    leverGeom.rotateX(Math.PI / 2);
    const leverMesh = new THREE.Mesh(leverGeom, toggleLeverMaterial);
    leverMesh.castShadow = true;
    leverHinge.add(leverMesh);
    leverMesh.userData = { type: 'breaker' };

    // ── TACTILE KEYCAPS (21st #24490 R3F Keypad) ──
    const KEYCAP_CONFIG = [
      { id: 'atlas', label: 'ATLAS // 01', x: -3.6, path: '/projects' },
      { id: 'radar', label: 'RADAR // 02', x: -1.8, path: '/radar' },
      { id: 'mind', label: 'MIND // 03', x: 0.0, path: '/concepts' },
    ];

    const keycapMeshes = [];
    KEYCAP_CONFIG.forEach((cfg) => {
      const keyGroup = new THREE.Group();
      keyGroup.position.set(cfg.x, -1.6, 0.6);
      consoleGroup.add(keyGroup);

      // Key Socket Well
      const socketGeom = new THREE.BoxGeometry(1.6, 1.2, 0.2);
      const socketMesh = new THREE.Mesh(socketGeom, bezelMaterial);
      keyGroup.add(socketMesh);

      // Plunger Keycap
      const capGeom = new THREE.BoxGeometry(1.4, 1.0, 0.45);
      const capMesh = new THREE.Mesh(capGeom, keycapBaseMat.clone());
      capMesh.position.z = 0.3;
      capMesh.castShadow = true;
      keyGroup.add(capMesh);

      capMesh.userData = {
        type: 'keycap',
        id: cfg.id,
        path: cfg.path,
        defaultZ: 0.3,
        depressedZ: 0.12,
        group: keyGroup,
        capMesh: capMesh,
      };

      keycapMeshes.push(capMesh);
    });

    // ── BRASS CORNER HEX BOLTS ──
    const boltCoords = [
      [-5.2, 2.5],
      [5.2, 2.5],
      [-5.2, -2.5],
      [5.2, -2.5],
    ];

    boltCoords.forEach(([bx, by]) => {
      const boltGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.25, 6);
      boltGeom.rotateX(Math.PI / 2);
      const boltMesh = new THREE.Mesh(boltGeom, screwMaterial);
      boltMesh.position.set(bx, by, 0.58);
      consoleGroup.add(boltMesh);
    });

    // ── DYNAMIC LED CANVAS RENDERER ──
    let dotMatrixBlink = 0;
    const renderScreen = () => {
      if (!ctx) return;
      dotMatrixBlink += 0.05;
      const pulse = (Math.sin(dotMatrixBlink) + 1) * 0.5;

      const activeSys = SYSTEMS[activeIndexRef.current] || SYSTEMS[0];

      // Deep CRT Background with Scanlines
      ctx.fillStyle = '#0a0c0e';
      ctx.fillRect(0, 0, 512, 256);

      // Dot Matrix Texture Overlay
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for (let y = 0; y < 256; y += 8) {
        for (let x = 0; x < 512; x += 8) {
          ctx.fillRect(x, y, 2, 2);
        }
      }

      // Top Status Bar
      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillText(`SYS_CONSOLE // [0${activeIndexRef.current + 1}/03]`, 24, 40);

      ctx.fillStyle = '#10b981';
      ctx.font = '18px "JetBrains Mono", monospace';
      const timeStr = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(new Date());
      ctx.fillText(`KERALA IST: ${timeStr}`, 280, 40);

      // Horizontal Divider
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(24, 55);
      ctx.lineTo(488, 55);
      ctx.stroke();

      // Active System Name
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 36px "JetBrains Mono", monospace';
      ctx.fillText(activeSys.title, 24, 105);

      // Tagline & Spec
      ctx.fillStyle = '#94a3b8';
      ctx.font = '19px "JetBrains Mono", monospace';
      ctx.fillText(activeSys.tagline, 24, 142);

      // Invariant & Metrics Box
      ctx.fillStyle = 'rgba(217, 119, 6, 0.12)';
      ctx.fillRect(24, 165, 464, 48);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1;
      ctx.strokeRect(24, 165, 464, 48);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px "JetBrains Mono", monospace';
      ctx.fillText(`INVARIANT: ${activeSys.metric}`, 40, 196);

      ctx.fillStyle = pulse > 0.5 ? '#10b981' : '#059669';
      ctx.fillText(`STATUS: ${activeSys.status}`, 310, 196);

      // Bottom Instructions
      ctx.fillStyle = '#64748b';
      ctx.font = '15px "JetBrains Mono", monospace';
      ctx.fillText('[DRAG DIAL TO SWITCH SPECIMEN]  [LEVER = INSPECT]', 24, 238);

      screenTexture.needsUpdate = true;
    };

    // ── RAYCASTING & INTERACTIVE MOUSE CONTROLS ──
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDraggingKnob = false;
    let dragStartX = 0;
    let currentDialAngle = DETENT_ANGLES[activeIndexRef.current];
    let targetDialAngle = DETENT_ANGLES[activeIndexRef.current];
    let leverAngle = 0;
    let targetLeverAngle = 0;

    const getPointerPos = (e) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX) ?? 0;
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY) ?? 0;
      return {
        x: ((clientX - rect.left) / rect.width) * 2 - 1,
        y: -((clientY - rect.top) / rect.height) * 2 + 1,
        rawX: clientX,
        rawY: clientY,
      };
    };

    const handlePointerMove = (e) => {
      const { x, y, rawX } = getPointerPos(e);
      mouse.x = x;
      mouse.y = y;

      // Subtle parallax tilt of console to mouse
      consoleGroup.rotation.y = x * 0.14;
      consoleGroup.rotation.x = 0.28 - y * 0.1;

      if (isDraggingKnob) {
        const deltaX = rawX - dragStartX;
        if (Math.abs(deltaX) > 40) {
          const step = deltaX > 0 ? 1 : -1;
          const nextIndex = Math.max(0, Math.min(2, activeIndexRef.current + step));
          if (nextIndex !== activeIndexRef.current) {
            activeIndexRef.current = nextIndex;
            targetDialAngle = DETENT_ANGLES[nextIndex];
            tactileAudio.playKnobTick(1100 + nextIndex * 150);
            if (onSelectSystemRef.current) {
              onSelectSystemRef.current(nextIndex);
            }
          }
          dragStartX = rawX;
        }
        return;
      }

      // Check hover
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(consoleGroup.children, true);
      let foundHover = null;

      intersects.forEach(({ object }) => {
        if (object.userData?.type) {
          foundHover = object.userData.type;
        }
      });

      setHoveredPart(foundHover);
      container.style.cursor =
        foundHover === 'knob'
          ? 'grab'
          : foundHover === 'breaker' || foundHover === 'keycap'
          ? 'pointer'
          : 'default';
    };

    const handlePointerDown = (e) => {
      const { rawX } = getPointerPos(e);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(consoleGroup.children, true);

      intersects.forEach(({ object }) => {
        const data = object.userData;
        if (!data) return;

        if (data.type === 'knob') {
          isDraggingKnob = true;
          dragStartX = rawX;
          container.style.cursor = 'grabbing';
          // Advance to next detent on simple click
          const nextIndex = (activeIndexRef.current + 1) % 3;
          activeIndexRef.current = nextIndex;
          targetDialAngle = DETENT_ANGLES[nextIndex];
          tactileAudio.playKnobTick(1200);
          if (onSelectSystemRef.current) {
            onSelectSystemRef.current(nextIndex);
          }
        } else if (data.type === 'breaker') {
          // Flip breaker lever
          targetLeverAngle = targetLeverAngle === 0 ? 0.75 : 0;
          tactileAudio.playSwitchClunk(targetLeverAngle > 0);
          if (onInspectRef.current) {
            onInspectRef.current(SYSTEMS[activeIndexRef.current]);
          }
        } else if (data.type === 'keycap') {
          // Depress keycap spring
          tactileAudio.playKeycapPress();
          object.position.z = data.depressedZ;
          setTimeout(() => {
            object.position.z = data.defaultZ;
            if (data.path) {
              navigate(data.path);
            }
          }, 140);
        }
      });
    };

    const handlePointerUp = () => {
      if (isDraggingKnob) {
        isDraggingKnob = false;
        container.style.cursor = 'grab';
      }
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    // ── ANIMATION LOOP ──
    let animationFrameId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      clock.getElapsedTime();

      // Smooth dial lerp to detent
      currentDialAngle += (targetDialAngle - currentDialAngle) * 0.16;
      knobDialGroup.rotation.z = currentDialAngle;

      // Update LED indicators around dial
      ledMarkers.forEach((mat, idx) => {
        mat.color.setHex(idx === activeIndexRef.current ? 0xd97706 : 0x334155);
      });

      // Smooth breaker lever lerp
      leverAngle += (targetLeverAngle - leverAngle) * 0.2;
      leverHinge.rotation.x = leverAngle;

      // Update Screen
      renderScreen();

      renderer.render(scene, camera);
    };

    animate();

    // ── RESIZE HANDLER ──
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [navigate]);

  // Audio mute handler
  const handleToggleMute = useCallback(() => {
    const muted = tactileAudio.toggleMute();
    setIsSoundMuted(muted);
    if (!muted) {
      tactileAudio.playKnobTick(1300);
    }
  }, []);

  return (
    <div className={`tactile-console-wrapper relative ${className}`}>
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={mountRef}
        className="tactile-console-canvas w-full h-[400px] md:h-[440px] select-none touch-none"
        aria-label="Interactive 3D Hardware Synthesizer Console"
        role="region"
      />

      {/* Hardware Instrument Overlay Badge & Controls */}
      <div className="absolute top-3 left-4 flex items-center gap-2 pointer-events-none">
        <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="font-mono text-[11px] tracking-wider text-amber-500 uppercase bg-black/60 px-2 py-0.5 rounded border border-amber-500/30">
          SYS_INSTRUMENT // OP-26 PRECISION CONSOLE
        </span>
      </div>

      {/* Audio Mute & Tactile Hint Floating Pill */}
      <div className="absolute bottom-3 right-4 flex items-center gap-2 z-10">
        <button
          type="button"
          onClick={handleToggleMute}
          className="font-mono text-[11px] bg-black/75 hover:bg-black text-zinc-300 hover:text-white px-2.5 py-1 rounded border border-zinc-700/60 transition-colors flex items-center gap-1.5 shadow-sm"
          title="Toggle Synthesizer Haptic Audio"
        >
          <span>{isSoundMuted ? '🔇 SOUND OFF' : '🔊 TACTILE AUDIO ON'}</span>
        </button>
      </div>
    </div>
  );
}
