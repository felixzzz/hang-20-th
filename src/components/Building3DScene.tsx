"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";

interface Hotspot {
  id: string;
  name: string;
  chineseName: string;
  floor: string;
  position: THREE.Vector3;
  cameraPos: THREE.Vector3;
  description: string;
  image: string;
}

const hotspots: Hotspot[] = [
  {
    id: "altar",
    name: "Lantai 3 — Altar Utama Fo Thang",
    chineseName: "佛堂大殿 · 三盞佛燈",
    floor: "Lantai 3",
    position: new THREE.Vector3(0, 7.5, 0),
    cameraPos: new THREE.Vector3(0, 9, 12),
    description:
      "Pusat kebajikan dan ibadah agung Kuang Hang Fo Thang. Dihiasi altar megah bertabur pelita suci (佛燈) yang melambangkan cahaya batin penerang kehidupan kebijaksanaan umat manusia.",
    image: "/images/guang-hang-15.jpg",
  },
  {
    id: "pembinaan",
    name: "Lantai 2 — Ruang Pembinaan & Kelas Dharma",
    chineseName: "法雨潤澤 · 育德堂",
    floor: "Lantai 2",
    position: new THREE.Vector3(0, 4.5, 0),
    cameraPos: new THREE.Vector3(6, 6, 12),
    description:
      "Tempat pembinaan rohani lintas generasi, kelas budi pekerti anak-anak, forum kebersamaan muda-mudi, dan pendalaman ajaran ketuhanan dalam suasana penuh kekeluargaan.",
    image: "/images/guang-hang-2.jpg",
  },
  {
    id: "lobby",
    name: "Lantai 1 — Aula Penyambutan & Jamuan Kasih",
    chineseName: "親和萬方 · 聚德堂",
    floor: "Lantai 1",
    position: new THREE.Vector3(0, 1.8, 1.5),
    cameraPos: new THREE.Vector3(0, 3, 11),
    description:
      "Area resepsi penyambutan tamu undangan, pameran foto kenangan 20 tahun, dan ruang ramah tamah tempat umat berkumpul menikmati santap kasih bersama.",
    image: "/images/guang-hang-1.jpg",
  },
  {
    id: "gapura",
    name: "Gapura & Plaza Utama (538 m²)",
    chineseName: "廣度十方 · 航向彼岸",
    floor: "Halaman",
    position: new THREE.Vector3(0, 0.5, 6),
    cameraPos: new THREE.Vector3(0, 3, 16),
    description:
      "Lahan permanen seluas 538 meter persegi di Jalan Palmerah Utara III No. 186A yang diupayakan dan dibangun atas ketulusan gotong royong seluruh umat sejak tahun 2001.",
    image: "/images/guang-hang-7.jpg",
  },
];

export default function Building3DScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isNight, setIsNight] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mutable refs to prevent unnecessary React re-renders
  const autoRotateRef = useRef(true);
  const isNightRef = useRef(true);
  const sceneElementsRef = useRef<{
    scene: THREE.Scene;
    ambient: THREE.AmbientLight;
    dirLight: THREE.DirectionalLight;
    lanternLights: THREE.PointLight[];
    glassMaterial: THREE.MeshStandardMaterial;
  } | null>(null);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x140606);
    scene.fog = new THREE.FogExp2(0x140606, 0.025);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(14, 10, 16);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffe8c2, 0.8);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const lanternLights: THREE.PointLight[] = [];

    // Building Materials
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf8f2,
      roughness: 0.6,
    });
    const redAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x831f1f,
      roughness: 0.4,
    });
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xd49b28,
      metalness: 0.6,
      roughness: 0.3,
    });
    const roofMaterial = new THREE.MeshStandardMaterial({
      color: 0x9e2222,
      roughness: 0.3,
    });
    const glassMaterial = new THREE.MeshStandardMaterial({
      color: 0xfde68a,
      roughness: 0.1,
      metalness: 0.1,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
    });

    sceneElementsRef.current = {
      scene,
      ambient,
      dirLight,
      lanternLights,
      glassMaterial,
    };

    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    // 5. Plinth / Foundation
    const plinthGeo = new THREE.BoxGeometry(16, 0.6, 14);
    const plinthMat = new THREE.MeshStandardMaterial({ color: 0xdfd6cb });
    const plinth = new THREE.Mesh(plinthGeo, plinthMat);
    plinth.position.y = 0.3;
    plinth.receiveShadow = true;
    buildingGroup.add(plinth);

    // Steps
    for (let s = 0; s < 3; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(6 - s * 0.4, 0.2, 1.2),
        plinthMat
      );
      step.position.set(0, 0.1 + s * 0.15, 7.2 + s * 0.4);
      step.receiveShadow = true;
      buildingGroup.add(step);
    }

    // Lantai 1 (Ground Floor)
    const floor1 = new THREE.Mesh(new THREE.BoxGeometry(8, 2.6, 8), wallMaterial);
    floor1.position.y = 0.6 + 1.3;
    floor1.castShadow = true;
    floor1.receiveShadow = true;
    buildingGroup.add(floor1);

    // Entrance Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.6, 16);
    [-2.4, -0.8, 0.8, 2.4].forEach((x) => {
      const p = new THREE.Mesh(pillarGeo, redAccentMaterial);
      p.position.set(x, 1.9, 4.2);
      p.castShadow = true;
      buildingGroup.add(p);
    });

    // Glass Entrance Doors
    const door = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 2), glassMaterial);
    door.position.set(0, 1.8, 4.02);
    buildingGroup.add(door);

    // Floor 1 Cornice
    const cornice1 = new THREE.Mesh(
      new THREE.BoxGeometry(8.6, 0.3, 8.6),
      redAccentMaterial
    );
    cornice1.position.y = 3.35;
    cornice1.castShadow = true;
    buildingGroup.add(cornice1);

    // Lantai 2 (Middle Floor)
    const floor2 = new THREE.Mesh(new THREE.BoxGeometry(7.6, 2.6, 7.6), wallMaterial);
    floor2.position.y = 3.5 + 1.3;
    floor2.castShadow = true;
    floor2.receiveShadow = true;
    buildingGroup.add(floor2);

    // Balcony Railing
    const balustrade = new THREE.Mesh(
      new THREE.BoxGeometry(8.2, 0.8, 8.2),
      new THREE.MeshStandardMaterial({ color: 0x831f1f, roughness: 0.5 })
    );
    balustrade.position.y = 3.9;
    buildingGroup.add(balustrade);

    // Windows for Floor 2
    [-2, 0, 2].forEach((x) => {
      const win = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.4), glassMaterial);
      win.position.set(x, 4.9, 3.82);
      buildingGroup.add(win);
    });

    // Intermediate Roof Eaves
    const midRoof = new THREE.Mesh(
      new THREE.ConeGeometry(6.5, 0.9, 4),
      roofMaterial
    );
    midRoof.rotation.y = Math.PI / 4;
    midRoof.position.y = 6.4;
    midRoof.scale.set(1.3, 0.6, 1.3);
    midRoof.castShadow = true;
    buildingGroup.add(midRoof);

    // Lantai 3 (Altar Suci Fo Thang Agung)
    const floor3 = new THREE.Mesh(new THREE.BoxGeometry(7, 2.6, 7), wallMaterial);
    floor3.position.y = 6.6 + 1.3;
    floor3.castShadow = true;
    floor3.receiveShadow = true;
    buildingGroup.add(floor3);

    // Altar Windows
    [-1.8, 0, 1.8].forEach((x) => {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6), glassMaterial);
      w.position.set(x, 7.8, 3.52);
      buildingGroup.add(w);
    });

    // Signboard "廣航佛堂"
    const signBoard = new THREE.Mesh(
      new THREE.BoxGeometry(3, 0.8, 0.15),
      redAccentMaterial
    );
    signBoard.position.set(0, 8.6, 3.6);
    buildingGroup.add(signBoard);

    const signTrim = new THREE.Mesh(
      new THREE.BoxGeometry(3.15, 0.95, 0.12),
      goldMaterial
    );
    signTrim.position.set(0, 8.6, 3.58);
    buildingGroup.add(signTrim);

    // Grand Swept Eave Temple Roof (庑殿顶 / Xie-Shan)
    const mainRoof = new THREE.Mesh(
      new THREE.ConeGeometry(7.2, 2.2, 4),
      roofMaterial
    );
    mainRoof.rotation.y = Math.PI / 4;
    mainRoof.position.y = 10.3;
    mainRoof.scale.set(1.35, 1, 1.35);
    mainRoof.castShadow = true;
    buildingGroup.add(mainRoof);

    // Golden Roof Ridge Ornament
    const finial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.4, 1.2, 16),
      goldMaterial
    );
    finial.position.y = 11.8;
    buildingGroup.add(finial);

    const finialSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      goldMaterial
    );
    finialSphere.position.y = 12.4;
    buildingGroup.add(finialSphere);

    // Traditional Lanterns
    const lanternPositions = [
      new THREE.Vector3(-3.2, 3.2, 4.2),
      new THREE.Vector3(3.2, 3.2, 4.2),
      new THREE.Vector3(-2.8, 6.2, 4.0),
      new THREE.Vector3(2.8, 6.2, 4.0),
      new THREE.Vector3(-2.6, 9.2, 3.8),
      new THREE.Vector3(2.6, 9.2, 3.8),
    ];

    lanternPositions.forEach((pos) => {
      const lanternMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.28, 12, 12),
        new THREE.MeshStandardMaterial({
          color: 0xef4444,
          emissive: 0xff6b00,
          emissiveIntensity: 0.9,
        })
      );
      lanternMesh.scale.set(1, 1.3, 1);
      lanternMesh.position.copy(pos);
      buildingGroup.add(lanternMesh);

      const pl = new THREE.PointLight(0xff9900, 1.4, 6);
      pl.position.copy(pos);
      scene.add(pl);
      lanternLights.push(pl);
    });

    // Golden Dust Particles
    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 22;
      positions[i + 1] = Math.random() * 14;
      positions[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.16,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Orbit Controls (Mouse & Touch)
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let cameraAngle = { theta: 0.8, phi: 0.4, radius: 24 };

    const updateCameraPosition = () => {
      camera.position.x =
        cameraAngle.radius * Math.sin(cameraAngle.theta) * Math.cos(cameraAngle.phi);
      camera.position.y = Math.max(
        2,
        cameraAngle.radius * Math.sin(cameraAngle.phi) + 4
      );
      camera.position.z =
        cameraAngle.radius * Math.cos(cameraAngle.theta) * Math.cos(cameraAngle.phi);
      camera.lookAt(0, 5, 0);
    };
    updateCameraPosition();

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      autoRotateRef.current = false;
      setAutoRotate(false);
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      prevMouse = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouse.x;
      const deltaY = clientY - prevMouse.y;
      prevMouse = { x: clientX, y: clientY };

      cameraAngle.theta -= deltaX * 0.007;
      cameraAngle.phi = Math.max(
        0.05,
        Math.min(1.2, cameraAngle.phi + deltaY * 0.007)
      );
      updateCameraPosition();
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      cameraAngle.radius = Math.max(10, Math.min(36, cameraAngle.radius + e.deltaY * 0.02));
      updateCameraPosition();
    };

    const dom = renderer.domElement;
    dom.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
    dom.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp);
    dom.addEventListener("wheel", onWheel, { passive: true });

    // Handle Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (autoRotateRef.current && !isDragging) {
        cameraAngle.theta += 0.003;
        updateCameraPosition();
      }

      lanternLights.forEach((light, i) => {
        light.intensity = (isNightRef.current ? 1.2 : 0.4) + Math.sin(time * 6 + i) * 0.2;
      });

      const posArray = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < posArray.length; i += 3) {
        posArray[i] += delta * 0.4;
        if (posArray[i] > 14) posArray[i] = 0.5;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();
    setIsLoaded(true);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      dom.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      dom.removeEventListener("touchstart", onPointerDown);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("touchend", onPointerUp);
      dom.removeEventListener("wheel", onWheel);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Run ONCE on mount

  // Smooth lighting toggle without rebuilding scene
  const toggleLighting = () => {
    const nextNight = !isNight;
    setIsNight(nextNight);
    isNightRef.current = nextNight;

    if (!sceneElementsRef.current) return;
    const { scene, ambient, dirLight, glassMaterial } = sceneElementsRef.current;

    const targetBg = nextNight ? 0x140606 : 0xf4eee4;
    scene.background = new THREE.Color(targetBg);
    if (scene.fog) {
      (scene.fog as THREE.FogExp2).color = new THREE.Color(targetBg);
    }

    ambient.intensity = nextNight ? 0.4 : 1.2;
    dirLight.intensity = nextNight ? 0.8 : 1.8;
    dirLight.color = new THREE.Color(nextNight ? 0xffe8c2 : 0xfffaed);

    glassMaterial.emissive = new THREE.Color(nextNight ? 0xf59e0b : 0x000000);
    glassMaterial.emissiveIntensity = nextNight ? 0.6 : 0;
  };

  const focusHotspot = (h: Hotspot) => {
    setSelectedHotspot(h);
    autoRotateRef.current = false;
    setAutoRotate(false);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden select-none">
      {/* 3D Canvas Mount Point */}
      <div
        ref={containerRef}
        className={`w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#140606] text-fothang-gold-300 font-serif">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-fothang-gold-400 border-t-transparent animate-spin" />
            <span className="text-xs tracking-widest font-chinese">Memuat Gedung 3D...</span>
          </div>
        </div>
      )}

      {/* Top Floating Controls */}
      <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-fothang-gold-400/30 text-white text-xs font-serif flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-fothang-gold-300 font-bold">Gedung 3D</span>
            <span className="text-stone-300 hidden sm:inline">• Kuang Hang Fo Thang</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Day / Night toggle */}
          <button
            onClick={toggleLighting}
            className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-fothang-gold-400/40 text-fothang-gold-300 transition cursor-pointer shadow-lg"
            title={isNight ? "Ganti ke Mode Siang" : "Ganti ke Mode Malam Lentera"}
          >
            {isNight ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-fothang-gold-400" />}
          </button>

          {/* Auto rotate toggle */}
          <button
            onClick={() => {
              const next = !autoRotate;
              setAutoRotate(next);
              autoRotateRef.current = next;
            }}
            className={`p-2.5 rounded-full backdrop-blur-md border transition cursor-pointer shadow-lg ${
              autoRotate
                ? "bg-fothang-red-900/80 border-fothang-gold-400 text-fothang-gold-200"
                : "bg-black/60 border-white/20 text-stone-300"
            }`}
            title="Putar Otomatis"
          >
            <RotateCcw className={`w-4 h-4 ${autoRotate ? "animate-spin-slow" : ""}`} />
          </button>
        </div>
      </div>

      {/* Hotspots Quick Floor Selectors */}
      <div className="absolute bottom-6 inset-x-4 sm:inset-x-8 flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none z-20">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/15 pointer-events-auto max-w-full">
          {hotspots.map((h) => (
            <button
              key={h.id}
              onClick={() => focusHotspot(h)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedHotspot?.id === h.id
                  ? "bg-fothang-gold-500 text-fothang-red-950 font-bold shadow"
                  : "text-stone-200 hover:bg-white/10"
              }`}
            >
              {h.floor}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-stone-300 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 pointer-events-auto">
          Sentuh / Tarik layar untuk memutar 360° • Cubit untuk zoom
        </div>
      </div>

      {/* Selected Floor / Hotspot Info Drawer */}
      {selectedHotspot && (
        <div
          role="dialog"
          aria-modal="true"
          className="absolute inset-x-4 sm:inset-x-auto sm:right-6 sm:top-20 sm:bottom-20 sm:w-96 rounded-3xl bg-[#2a0e0e]/95 backdrop-blur-xl border-2 border-fothang-gold-400/50 p-6 text-white shadow-2xl z-30 animate-fade-in flex flex-col justify-between overflow-y-auto max-h-[80vh] sm:max-h-none"
        >
          <div>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-fothang-gold-400 bg-fothang-gold-500/10 border border-fothang-gold-400/30 px-2.5 py-0.5 rounded-full">
                  {selectedHotspot.floor}
                </span>
                <h3 className="text-xl font-serif font-bold text-fothang-gold-200 mt-1.5">
                  {selectedHotspot.name}
                </h3>
                <span className="text-xs font-chinese text-fothang-gold-300/80">
                  {selectedHotspot.chineseName}
                </span>
              </div>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-stone-300 hover:text-white cursor-pointer"
                aria-label="Tutup info"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo preview */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-fothang-gold-400/30 mb-4 bg-stone-900">
              <Image
                src={selectedHotspot.image}
                alt={selectedHotspot.name}
                fill
                className="object-cover"
              />
            </div>

            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light">
              {selectedHotspot.description}
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-stone-400">Palmerah Utara III No. 186A</span>
            <span className="font-chinese text-fothang-gold-400 font-bold">天恩師德</span>
          </div>
        </div>
      )}
    </div>
  );
}
