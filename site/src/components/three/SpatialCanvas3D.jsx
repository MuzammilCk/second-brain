import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';

export default function SpatialCanvas3D({ className = '' }) {
  const containerRef = useRef(null);
  const location = useLocation();
  const routeRef = useRef(location.pathname);

  useEffect(() => {
    routeRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // High-performance WebGL Renderer with ACESFilmicToneMapping
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Architectural Daylight & Warm Amber Edge Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffdf5, 2.6);
    keyLight.position.set(12, 22, 15);
    scene.add(keyLight);

    const warmCausticLight = new THREE.PointLight(0xd97706, 2.8, 50);
    warmCausticLight.position.set(-14, -8, 10);
    scene.add(warmCausticLight);

    const rimLight = new THREE.PointLight(0x94a3b8, 1.8, 60);
    rimLight.position.set(10, -15, -12);
    scene.add(rimLight);

    // Main Sculpture Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Faceted Icosahedral Prism (Sunlit Borosilicate Optical Glass)
    const outerGeom = new THREE.IcosahedronGeometry(4.2, 0);

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xf8fafc,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.94,
      ior: 1.52,
      reflectivity: 0.6,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.88,
      flatShading: true,
    });

    const glassMesh = new THREE.Mesh(outerGeom, glassMaterial);
    sculptureGroup.add(glassMesh);

    // 2. Delicate Bronze / Tuscan Amber Wireframe Skeleton
    const wireGeom = new THREE.WireframeGeometry(outerGeom);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xb45309,
      transparent: true,
      opacity: 0.32,
    });
    const wireframe = new THREE.LineSegments(wireGeom, wireMaterial);
    wireframe.scale.set(1.002, 1.002, 1.002);
    sculptureGroup.add(wireframe);

    // 3. Inner Floating Core (Brushed Platinum Octahedron with Subtle Warm Amber Tone)
    const innerGeom = new THREE.OctahedronGeometry(2.0, 0);
    const innerMaterial = new THREE.MeshPhongMaterial({
      color: 0xe2e8f0,
      emissive: 0xb45309,
      emissiveIntensity: 0.22,
      shininess: 90,
      wireframe: false,
      transparent: true,
      opacity: 0.7,
      flatShading: true,
    });
    const innerMesh = new THREE.Mesh(innerGeom, innerMaterial);
    sculptureGroup.add(innerMesh);

    // 4. Thin Orbital Caustic Ring
    const ringGeom = new THREE.RingGeometry(6.4, 6.44, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.rotation.x = Math.PI / 2.6;
    sculptureGroup.add(ringMesh);

    // Mouse Tracking with Weighted Momentum
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // Window Resize
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth cursor parallax
      targetX += (mouseX * 0.9 - targetX) * 0.05;
      targetY += (mouseY * 0.7 - targetY) * 0.05;

      // Base rotation + interactive cursor tilt
      sculptureGroup.rotation.y = elapsed * 0.22 + targetX * 1.1;
      sculptureGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.15 - targetY * 0.9;
      sculptureGroup.rotation.z = Math.cos(elapsed * 0.12) * 0.08;

      // Counter-rotating inner crystalline core
      innerMesh.rotation.y = -elapsed * 0.45;
      innerMesh.rotation.x = elapsed * 0.3;

      ringMesh.rotation.z = elapsed * 0.1;

      // Gentle levitation float
      sculptureGroup.position.y = Math.sin(elapsed * 0.8) * 0.35;

      // Subtle route-based placement
      const path = routeRef.current || '/';
      let targetPosZ = 18;
      let targetPosY = 0;
      if (path.startsWith('/projects')) {
        targetPosZ = 22;
        targetPosY = 1.5;
      } else if (path.startsWith('/radar')) {
        targetPosZ = 24;
        targetPosY = -1.0;
      } else if (path.startsWith('/concepts')) {
        targetPosZ = 22;
        targetPosY = 1.0;
      }
      camera.position.z += (targetPosZ - camera.position.z) * 0.04;
      camera.position.y += (targetPosY - camera.position.y) * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      outerGeom.dispose();
      glassMaterial.dispose();
      wireGeom.dispose();
      wireMaterial.dispose();
      innerGeom.dispose();
      innerMaterial.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 w-full h-full pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.8 }}
      aria-hidden="true"
    />
  );
}
