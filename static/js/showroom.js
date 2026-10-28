/**
 * Porsche Showroom — Motor Interactivo 3D WebGL con Cargador GLTF Real
 * Carga modelos 3D reales (.gltf/.bin), iluminación de estudio, pintura interactiva y telemetría.
 */
document.addEventListener('DOMContentLoaded', () => {
  const cars = window.CARS_DATA || [];
  const defaultPackages = window.PACKAGES_DATA || [];

  if (!cars || cars.length === 0) {
    console.warn("No se cargaron modelos desde el backend Django.");
    return;
  }

  // Estado general
  let activeIndex = window.ACTIVE_INDEX !== undefined ? window.ACTIVE_INDEX : 0;
  let activeCar = cars[activeIndex];
  let selectedColor = activeCar.colors && activeCar.colors.length > 0 ? activeCar.colors[0] : null;
  let selectedWheel = activeCar.wheels && activeCar.wheels.length > 0 ? activeCar.wheels[0] : null;
  let packages = defaultPackages.map(p => ({ ...p }));

  let is3DWebGLMode = true;
  let rotationAngle = 24;
  let isAutoRotating = false;
  let isDragging = false;
  let dragStartX = 0;
  let startAngle = 24;
  let showHotspots = true;
  let lightingPreset = 'studio';
  let activeHotspot = null;
  let isSoundActive = false;
  let activeConfigTab = 'paint';

  // Elementos DOM
  const canvas3D = document.getElementById('three-car-canvas');
  const loading3DEl = document.getElementById('pedestal-loading-3d');
  const imageLayer = document.getElementById('pedestal-image-layer');
  const reflectionLayer = document.getElementById('pedestal-reflection-layer');
  const heroImage = document.getElementById('pedestal-hero-image');
  const heroImageReflection = document.getElementById('pedestal-hero-reflection');
  const pedestalCompassAngle = document.getElementById('pedestal-compass-angle');
  const hotspotContainer = document.getElementById('pedestal-hotspots');
  const autoRotateBtn = document.getElementById('btn-autorotate');
  const toggleHotspotsBtn = document.getElementById('btn-toggle-hotspots');
  const toggleSoundBtn = document.getElementById('btn-toggle-sound');
  const toggle3DModeBtn = document.getElementById('btn-toggle-3d-mode');
  const label3DMode = document.getElementById('btn-3d-label');
  const soundIconMuted = document.getElementById('sound-icon-muted');
  const soundIconActive = document.getElementById('sound-icon-active');
  const fullscreenBtn = document.getElementById('btn-fullscreen');

  // Modales
  const configuratorDrawer = document.getElementById('configurator-drawer');
  const specsModal = document.getElementById('specs-modal');
  const matrixModal = document.getElementById('matrix-modal');
  const navDrawer = document.getElementById('nav-drawer');
  const searchModal = document.getElementById('search-modal');
  const searchInput = document.getElementById('search-input');
  const searchResultsContainer = document.getElementById('search-results');

  // -------------------------------------------------------------
  // Motor Three.js 3D con GLTFLoader Real
  // -------------------------------------------------------------
  let scene3D, camera3D, renderer3D, carGroup3D;
  let gltfCarModel = null;
  let carPaintMaterialsList = [];
  const modelCache = {};

  function initThreeJS() {
    if (!canvas3D || typeof THREE === 'undefined') {
      console.warn("Three.js no disponible. Usando vista 2D alternativa.");
      setMode3D(false);
      return;
    }

    try {
      const container = canvas3D.parentElement;
      const width = container.clientWidth || 960;
      const height = container.clientHeight || 520;

      scene3D = new THREE.Scene();
      camera3D = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
      camera3D.position.set(0, 0.9, 6.8);

      renderer3D = new THREE.WebGLRenderer({
        canvas: canvas3D,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer3D.setSize(width, height);
      renderer3D.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer3D.shadowMap.enabled = true;
      renderer3D.shadowMap.type = THREE.PCFSoftShadowMap;
      if (renderer3D.outputEncoding !== undefined) {
        renderer3D.outputEncoding = THREE.sRGBEncoding;
      }

      // Iluminación cenital de estudio blanco
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.35);
      scene3D.add(ambientLight);

      const mainLight = new THREE.DirectionalLight(0xffffff, 1.9);
      mainLight.position.set(6, 9, 6);
      mainLight.castShadow = true;
      mainLight.shadow.mapSize.width = 1024;
      mainLight.shadow.mapSize.height = 1024;
      mainLight.shadow.bias = -0.0001;
      scene3D.add(mainLight);

      const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
      fillLight.position.set(-6, 5, -5);
      scene3D.add(fillLight);

      const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
      rimLight.position.set(0, 6, -7);
      scene3D.add(rimLight);

      // Sombra de contacto suave en el suelo blanco
      const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
      const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.22 });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.001;
      shadowPlane.receiveShadow = true;
      scene3D.add(shadowPlane);

      carGroup3D = new THREE.Group();
      scene3D.add(carGroup3D);

      // Cargar modelo 3D GLTF real


      window.addEventListener('resize', onWindowResize3D);
      render3DLoop();
    } catch (e) {
      console.warn("Error al inicializar Three.js:", e);
      setMode3D(false);
    }
  }

  function onWindowResize3D() {
    if (!renderer3D || !camera3D || !canvas3D) return;
    const container = canvas3D.parentElement;
    const width = container.clientWidth || 960;
    const height = container.clientHeight || 520;
    camera3D.aspect = width / height;
    camera3D.updateProjectionMatrix();
    renderer3D.setSize(width, height);
  }

  function loadGLTFVehicle(modelUrl) {
    if (!modelUrl) return;

    if (loading3DEl) loading3DEl.classList.remove('hidden');

    if (modelCache[modelUrl]) {
      setupLoadedModel(modelCache[modelUrl].clone());
      if (loading3DEl) loading3DEl.classList.add('hidden');
      return;
    }

    if (typeof THREE.GLTFLoader === 'undefined') {
      console.warn("GLTFLoader no está cargado. Usando geometría procedural.");
      buildProceduralSupercar();
      if (loading3DEl) loading3DEl.classList.add('hidden');
      return;
    }

    const loader = new THREE.GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        modelCache[modelUrl] = gltf.scene;
        setupLoadedModel(gltf.scene.clone());
        if (loading3DEl) loading3DEl.classList.add('hidden');
      },
      undefined,
      (error) => {
        console.warn("Error cargando modelo GLTF:", error);
        buildProceduralSupercar();
        if (loading3DEl) loading3DEl.classList.add('hidden');
      }
    );
  }

  function setupLoadedModel(loadedScene) {
    if (!carGroup3D) return;

    // Limpiar modelo previo
    while (carGroup3D.children.length > 0) {
      carGroup3D.remove(carGroup3D.children[0]);
    }

    gltfCarModel = loadedScene;
    carPaintMaterialsList = [];

    // Habilitar sombras y detectar materiales de pintura
    gltfCarModel.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material;
          const matName = (mat.name || '').toLowerCase();

          // Identificar pintura de la carrocería
          if (
            matName.includes('surface1sg1') ||
            matName.includes('surface1sg') ||
            matName.includes('car_paint') ||
            matName.includes('body') ||
            matName.includes('paint')
          ) {
            // Convertir a MeshPhysicalMaterial con laca transparente si no lo es
            if (!child.material.isMeshPhysicalMaterial) {
              const origColor = mat.color ? mat.color.clone() : new THREE.Color(0x08326e);
              child.material = new THREE.MeshPhysicalMaterial({
                color: origColor,
                metalness: 0.75,
                roughness: 0.18,
                clearcoat: 1.0,
                clearcoatRoughness: 0.08,
                reflectivity: 0.95
              });
            }
            carPaintMaterialsList.push(child.material);
          }
        }
      }
    });

    // Centrar y escalar automáticamente el modelo 3D
    const box = new THREE.Box3().setFromObject(gltfCarModel);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const targetLength = 6.3; // Escala óptima sobre el pedestal
    const scale = targetLength / (maxDim || 1);

    gltfCarModel.scale.setScalar(scale);

    // Ajustar posición: centrar en X/Z, elevar para que el centro del auto quede al nivel del ojo de cámara
    gltfCarModel.position.x = -center.x * scale;
    gltfCarModel.position.z = -center.z * scale;
    // Subir el auto: ruedas en y=0, luego elevar la mitad de la altura para centrarlo en el encuadre
    const scaledHeight = size.y * scale;
    gltfCarModel.position.y = -box.min.y * scale - scaledHeight * 0.18;

    carGroup3D.add(gltfCarModel);

    // Aplicar color actual seleccionado
    if (selectedColor) {
      update3DCarColor(selectedColor.hex);
    }
  }

  function buildProceduralSupercar() {
    if (!carGroup3D) return;
    while (carGroup3D.children.length > 0) {
      carGroup3D.remove(carGroup3D.children[0]);
    }

    carPaintMaterialsList = [];
    const carColorHex = selectedColor?.hex || '#83878b';

    const paintMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(carColorHex),
      metalness: 0.8,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08
    });
    carPaintMaterialsList.push(paintMat);

    const carbonMat = new THREE.MeshStandardMaterial({ color: 0x181818, metalness: 0.5, roughness: 0.4 });
    const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x111111, transparent: true, opacity: 0.75, transmission: 0.6 });

    const bodyMesh = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.52, 1.95), paintMat);
    bodyMesh.position.y = 0.55;
    bodyMesh.castShadow = true;
    carGroup3D.add(bodyMesh);

    const cabinMesh = new THREE.Mesh(new THREE.SphereGeometry(1.4, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), glassMat);
    cabinMesh.position.set(-0.25, 0.68, 0);
    cabinMesh.scale.set(1.45, 0.58, 0.95);
    carGroup3D.add(cabinMesh);

    const wingMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 2.1), carbonMat);
    wingMesh.position.set(-1.85, 1.25, 0);
    carGroup3D.add(wingMesh);

    // Ruedas
    const wheelPositions = [
      [1.35, 0.38, 0.96],
      [1.35, 0.38, -0.96],
      [-1.35, 0.42, 0.98],
      [-1.35, 0.42, -0.98]
    ];
    const tireGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.28, 24);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.85 });
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(tireGeo, tireMat);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.x = Math.PI / 2;
      wheel.castShadow = true;
      carGroup3D.add(wheel);
    });
  }

  function update3DCarColor(hexStr) {
    if (carPaintMaterialsList && carPaintMaterialsList.length > 0) {
      const colorObj = new THREE.Color(hexStr);
      carPaintMaterialsList.forEach((mat) => {
        if (mat && mat.color) {
          mat.color.copy(colorObj);
          mat.needsUpdate = true;
        }
      });
    }
  }

  function render3DLoop() {
    requestAnimationFrame(render3DLoop);
    if (!renderer3D || !scene3D || !camera3D) return;

    if (isAutoRotating) {
      rotationAngle = (rotationAngle + 0.3) % 360;
      if (pedestalCompassAngle) pedestalCompassAngle.textContent = Math.round(rotationAngle) + '°';
    }

    if (carGroup3D) {
      carGroup3D.rotation.y = (rotationAngle * Math.PI) / 180;
    }

    renderer3D.render(scene3D, camera3D);
  }

  function setMode3D(enable3D) {
    is3DWebGLMode = enable3D;
    if (canvas3D) {
      canvas3D.style.display = is3DWebGLMode ? 'block' : 'none';
    }
    if (imageLayer) {
      imageLayer.classList.toggle('hidden', is3DWebGLMode);
    }
    if (reflectionLayer) {
      reflectionLayer.classList.toggle('hidden', is3DWebGLMode);
    }

    if (label3DMode) {
      label3DMode.textContent = is3DWebGLMode ? 'MODELO 3D REAL (GLTF)' : 'FOTOESTUDIO 3D';
    }
  }

  if (toggle3DModeBtn) {
    toggle3DModeBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playMechanicalClick();
      setMode3D(!is3DWebGLMode);
    });
  }

  // -------------------------------------------------------------
  // Formato y Auxiliares
  // -------------------------------------------------------------
  function formatCurrency(amount) {
    return '$' + Number(amount).toLocaleString('es-ES');
  }

  function getCsrfToken() {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
    return cookie ? cookie.split('=')[1] : '';
  }

  // -------------------------------------------------------------
  // Actualización del Modelo Activo
  // -------------------------------------------------------------
  function selectModel(index) {
    if (index < 0 || index >= cars.length) return;
    activeIndex = index;
    activeCar = cars[activeIndex];

    selectedColor = activeCar.colors && activeCar.colors.length > 0 ? activeCar.colors[0] : null;
    selectedWheel = activeCar.wheels && activeCar.wheels.length > 0 ? activeCar.wheels[0] : null;
    activeHotspot = null;

    if (window.soundEngine) {
      window.soundEngine.playMechanicalClick();
      window.soundEngine.playBoxerRumble();
    }

    // Cargar modelo 3D GLTF asociado al vehículo
    if (activeCar.model3d) {
      loadGLTFVehicle(activeCar.model3d);
    }

    updateShowroom();
    updateFloatingSpecs();
    updateCarousel();
    updateConfigurator();
    updateSpecsModal();

    if (selectedColor) {
      update3DCarColor(selectedColor.hex);
    }

    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', '/model/' + activeCar.id + '/');
    }
  }

  function updateShowroom() {
    const imgSrc = selectedColor?.image || activeCar.heroImage;
    if (heroImage) {
      heroImage.src = imgSrc;
      heroImage.alt = activeCar.fullName;
    }
    if (heroImageReflection) {
      heroImageReflection.src = imgSrc;
    }

    const seriesWatermark = document.getElementById('pedestal-series-watermark');
    if (seriesWatermark) {
      seriesWatermark.textContent = activeCar.name;
    }

    const seriesTag = document.getElementById('pedestal-badge-tag');
    if (seriesTag) {
      seriesTag.textContent = activeCar.badgeText || 'ALTO RENDIMIENTO';
    }

    renderHotspots();
    renderPedestalColorSwatches();
  }

  function renderPedestalColorSwatches() {
    const swatchesContainer = document.getElementById('pedestal-color-swatches');
    if (!swatchesContainer) return;

    swatchesContainer.innerHTML = '';
    (activeCar.colors || []).forEach(color => {
      const btn = document.createElement('button');
      btn.dataset.interactive = "true";
      const isSelected = selectedColor && selectedColor.id === color.id;
      btn.className = `group relative w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none shadow-sm ${isSelected ? 'ring-2 ring-black ring-offset-2 ring-offset-white scale-110' : 'opacity-70 hover:opacity-100 hover:scale-105'
        }`;
      btn.style.backgroundColor = color.hex;
      btn.title = `${color.name} (${color.code})`;

      if (isSelected) {
        btn.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${color.hex.toLowerCase() > '#aaaaaa' ? 'bg-black' : 'bg-white'}"></span>`;
      }

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedColor = color;
        if (window.soundEngine) window.soundEngine.playSelectionTone();
        update3DCarColor(color.hex);
        updateShowroom();
        updateConfigurator();
      });

      swatchesContainer.appendChild(btn);
    });

    const colorNameEl = document.getElementById('pedestal-color-name');
    if (colorNameEl && selectedColor) {
      colorNameEl.textContent = `${selectedColor.name} · CÓDIGO ${selectedColor.code}`;
    }
  }

  function renderHotspots() {
    if (!hotspotContainer) return;
    hotspotContainer.innerHTML = '';

    if (!showHotspots || !activeCar.hotspots) return;

    activeCar.hotspots.forEach(spot => {
      const isSpotActive = activeHotspot && activeHotspot.id === spot.id;

      const spotEl = document.createElement('div');
      spotEl.className = 'absolute z-30 pointer-events-auto transform -translate-x-1/2 -translate-y-1/2';
      spotEl.style.left = spot.x + '%';
      spotEl.style.top = spot.y + '%';
      spotEl.dataset.interactive = "true";

      spotEl.innerHTML = `
        <button class="relative w-7 h-7 flex items-center justify-center focus:outline-none group">
          <span class="absolute w-6 h-6 rounded-full bg-black/15 animate-ping-white"></span>
          <span class="relative w-2.5 h-2.5 rounded-full ${isSpotActive ? 'bg-black ring-2 ring-black/40' : 'bg-black/80'} shadow-sm transition-transform duration-200 group-hover:scale-125"></span>
        </button>

        <div class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2.5 w-60 p-3.5 bg-white/95 backdrop-blur-xl border border-black/[0.08] shadow-2xl rounded-[1px] pointer-events-auto transition-all duration-200 ${isSpotActive ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100'
        }">
          <div class="text-[8.5px] font-mono tracking-widest text-zinc-500 uppercase mb-0.5">${spot.category}</div>
          <div class="text-[11px] font-medium text-black tracking-wide uppercase mb-1">${spot.title}</div>
          <div class="text-[10.5px] text-zinc-600 leading-relaxed font-light mb-1.5">${spot.description}</div>
          <div class="inline-flex items-center px-1.5 py-0.5 bg-black/[0.05] border border-black/[0.06] rounded-[1px] text-[9.5px] font-mono text-black tracking-wider uppercase font-medium">
            ${spot.spec}
          </div>
        </div>
      `;

      spotEl.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation();
        activeHotspot = isSpotActive ? null : spot;
        if (window.soundEngine) window.soundEngine.playMechanicalClick();
        renderHotspots();
      });

      hotspotContainer.appendChild(spotEl);
    });
  }

  // -------------------------------------------------------------
  // HUD Telemetría Flotante
  // -------------------------------------------------------------
  function updateFloatingSpecs() {
    const specs = activeCar.specs || {};
    const accelEl = document.getElementById('spec-accel');
    const speedEl = document.getElementById('spec-speed');
    const powerEl = document.getElementById('spec-power');
    const engineEl = document.getElementById('spec-engine');
    const priceEl = document.getElementById('spec-price');
    const badgeEl = document.getElementById('spec-badge-text');

    if (accelEl) accelEl.textContent = specs.acceleration || '--';
    if (speedEl) speedEl.textContent = specs.topSpeed || '--';
    if (powerEl) powerEl.textContent = specs.powerHp || '--';
    if (engineEl) engineEl.textContent = specs.engine || '--';
    if (priceEl) priceEl.textContent = formatCurrency(activeCar.basePrice);
    if (badgeEl) badgeEl.textContent = activeCar.badgeText || 'TELEMETRÍA OFICIAL';
  }

  // -------------------------------------------------------------
  // Selector Horizontal Inferior
  // -------------------------------------------------------------
  function updateCarousel() {
    const carouselContainer = document.getElementById('carousel-items-container');
    if (!carouselContainer) return;

    carouselContainer.innerHTML = '';

    cars.forEach((car, idx) => {
      const isActive = idx === activeIndex;
      const distance = Math.abs(idx - activeIndex);

      const btn = document.createElement('button');
      btn.className = `group relative whitespace-nowrap transition-all duration-300 focus:outline-none ${isActive
        ? 'opacity-100 scale-100 z-10 cursor-default'
        : distance === 1 || distance === cars.length - 1
          ? 'opacity-40 hover:opacity-75 scale-90 cursor-pointer hidden sm:block'
          : 'opacity-20 hover:opacity-50 scale-75 cursor-pointer hidden lg:block'
        }`;

      if (isActive) {
        btn.innerHTML = `
          <div class="flex items-center space-x-5 sm:space-x-8">
            <button id="carousel-prev-btn" class="p-1.5 text-zinc-400 hover:text-black transition-colors focus:outline-none" title="Anterior (←)">
              <svg class="w-4 h-4 stroke-[1.4]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <div class="flex flex-col items-center">
              <span class="text-xl sm:text-2xl font-light tracking-[0.25em] uppercase text-black font-mono">
                ${car.name}
              </span>
              <div class="flex items-center space-x-2 mt-0.5">
                <span class="text-[8.5px] font-mono tracking-[0.3em] uppercase text-zinc-500">
                  GAMA ${car.series.toUpperCase()} · DESDE ${formatCurrency(car.basePrice)}
                </span>
              </div>
            </div>
            <button id="carousel-next-btn" class="p-1.5 text-zinc-400 hover:text-black transition-colors focus:outline-none" title="Siguiente (→)">
              <svg class="w-4 h-4 stroke-[1.4]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        `;
      } else {
        btn.innerHTML = `
          <div class="flex flex-col items-center py-1.5 px-3">
            <span class="text-sm sm:text-base font-light tracking-[0.2em] uppercase text-zinc-500 group-hover:text-black transition-colors font-mono">
              ${car.name}
            </span>
            <span class="text-[7.5px] font-mono tracking-widest text-zinc-400 uppercase mt-0.5">
              ${car.specs?.powerHp || ''}
            </span>
          </div>
        `;
        btn.addEventListener('click', () => selectModel(idx));
      }

      carouselContainer.appendChild(btn);
    });

    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prevIdx = activeIndex === 0 ? cars.length - 1 : activeIndex - 1;
        selectModel(prevIdx);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextIdx = activeIndex === cars.length - 1 ? 0 : activeIndex + 1;
        selectModel(nextIdx);
      });
    }

    const dotsContainer = document.getElementById('carousel-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      cars.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `h-1 rounded-full transition-all duration-300 ${idx === activeIndex ? 'w-6 bg-black' : 'w-1.5 bg-black/20 hover:bg-black/40'
          }`;
        dot.title = cars[idx].name;
        dot.addEventListener('click', () => selectModel(idx));
        dotsContainer.appendChild(dot);
      });
    }
  }

  // -------------------------------------------------------------
  // Panel Configurador Lateral
  // -------------------------------------------------------------
  function updateConfigurator() {
    const configCarName = document.getElementById('config-car-name');
    const configCarTagline = document.getElementById('config-car-tagline');
    if (configCarName) configCarName.textContent = activeCar.fullName;
    if (configCarTagline) configCarTagline.textContent = activeCar.tagline;

    const packagesTotal = packages.reduce((sum, p) => p.selected ? sum + p.price : sum, 0);
    const wheelPrice = selectedWheel ? selectedWheel.price : 0;
    const colorPrice = selectedColor ? selectedColor.price : 0;
    const totalPrice = activeCar.basePrice + wheelPrice + colorPrice + packagesTotal;
    const monthlyLease = Math.round(totalPrice / 60);

    const basePriceEl = document.getElementById('config-base-price');
    const colorPriceEl = document.getElementById('config-color-price');
    const wheelPriceEl = document.getElementById('config-wheel-price');
    const pkgPriceEl = document.getElementById('config-pkg-price');
    const totalPriceEl = document.getElementById('config-total-price');
    const leasePriceEl = document.getElementById('config-monthly-lease');

    if (basePriceEl) basePriceEl.textContent = formatCurrency(activeCar.basePrice);
    if (colorPriceEl) colorPriceEl.textContent = formatCurrency(colorPrice);
    if (wheelPriceEl) wheelPriceEl.textContent = formatCurrency(wheelPrice);
    if (pkgPriceEl) pkgPriceEl.textContent = formatCurrency(packagesTotal);
    if (totalPriceEl) totalPriceEl.textContent = formatCurrency(totalPrice);
    if (leasePriceEl) leasePriceEl.textContent = formatCurrency(monthlyLease) + '/mes';

    // 1. Colores
    const paintList = document.getElementById('config-paint-list');
    if (paintList) {
      paintList.innerHTML = '';
      (activeCar.colors || []).forEach(c => {
        const isCurrent = selectedColor && selectedColor.id === c.id;
        const div = document.createElement('div');
        div.className = `p-3.5 border transition-all duration-200 cursor-pointer flex items-center justify-between rounded-[1px] ${isCurrent ? 'bg-zinc-100/90 border-black' : 'bg-white border-black/[0.06] hover:border-black/30'
          }`;
        div.innerHTML = `
          <div class="flex items-center space-x-3">
            <span class="w-6 h-6 rounded-full border border-black/15 shadow-sm" style="background-color: ${c.hex}"></span>
            <div>
              <div class="text-xs font-medium text-black">${c.name}</div>
              <div class="text-[9.5px] font-mono text-zinc-500 uppercase">${c.type === 'special' ? 'ESPECIAL' : c.type === 'metallic' ? 'METALIZADO' : 'SÓLIDO'} · CÓDIGO ${c.code}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs font-mono text-zinc-700 font-medium">${c.price > 0 ? '+' + formatCurrency(c.price) : 'Incluido'}</div>
          </div>
        `;
        div.addEventListener('click', () => {
          selectedColor = c;
          if (window.soundEngine) window.soundEngine.playSelectionTone();
          update3DCarColor(c.hex);
          updateShowroom();
          updateConfigurator();
        });
        paintList.appendChild(div);
      });
    }

    // 2. Llantas
    const wheelList = document.getElementById('config-wheel-list');
    if (wheelList) {
      wheelList.innerHTML = '';
      (activeCar.wheels || []).forEach(w => {
        const isCurrent = selectedWheel && selectedWheel.id === w.id;
        const div = document.createElement('div');
        div.className = `p-3.5 border transition-all duration-200 cursor-pointer flex items-center justify-between rounded-[1px] ${isCurrent ? 'bg-zinc-100/90 border-black' : 'bg-white border-black/[0.06] hover:border-black/30'
          }`;
        div.innerHTML = `
          <div>
            <div class="text-xs font-medium text-black">${w.name}</div>
            <div class="text-[9.5px] font-mono text-zinc-500 uppercase mt-0.5">${w.size} · ${w.finish}</div>
          </div>
          <div class="text-right ml-4">
            <div class="text-xs font-mono text-zinc-700 font-medium">${w.price > 0 ? '+' + formatCurrency(w.price) : 'Incluido'}</div>
          </div>
        `;
        div.addEventListener('click', () => {
          selectedWheel = w;
          if (window.soundEngine) window.soundEngine.playMechanicalClick();
          updateConfigurator();
        });
        wheelList.appendChild(div);
      });
    }

    // 3. Paquetes
    const pkgList = document.getElementById('config-package-list');
    if (pkgList) {
      pkgList.innerHTML = '';
      packages.forEach(pkg => {
        const div = document.createElement('div');
        div.className = `p-3.5 border transition-all duration-200 cursor-pointer flex items-start justify-between rounded-[1px] ${pkg.selected ? 'bg-zinc-100/90 border-black' : 'bg-white border-black/[0.06] hover:border-black/30'
          }`;
        div.innerHTML = `
          <div class="pr-3">
            <div class="text-xs font-medium text-black">${pkg.name}</div>
            <div class="text-[10.5px] text-zinc-600 mt-0.5 leading-relaxed font-light">${pkg.description}</div>
          </div>
          <div class="text-right flex flex-col items-end">
            <span class="text-xs font-mono text-zinc-800 mb-1.5 font-medium">+${formatCurrency(pkg.price)}</span>
            <div class="w-4 h-4 rounded-[1px] border ${pkg.selected ? 'bg-black border-black text-white' : 'border-zinc-400'} flex items-center justify-center">
              ${pkg.selected ? '<svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>' : ''}
            </div>
          </div>
        `;
        div.addEventListener('click', () => {
          pkg.selected = !pkg.selected;
          if (window.soundEngine) window.soundEngine.playMechanicalClick();
          updateConfigurator();
        });
        pkgList.appendChild(div);
      });
    }

    // 4. Resumen
    const summaryModelName = document.getElementById('summary-model-name');
    const summaryColorName = document.getElementById('summary-color-name');
    const summaryWheelName = document.getElementById('summary-wheel-name');
    const summaryImage = document.getElementById('summary-car-image');

    if (summaryModelName) summaryModelName.textContent = activeCar.fullName;
    if (summaryColorName && selectedColor) summaryColorName.textContent = `${selectedColor.name} (${selectedColor.type === 'special' ? 'Especial' : selectedColor.type === 'metallic' ? 'Metalizado' : 'Sólido'})`;
    if (summaryWheelName && selectedWheel) summaryWheelName.textContent = selectedWheel.name;
    if (summaryImage) summaryImage.src = selectedColor?.image || activeCar.heroImage;
  }

  // Pestañas
  document.querySelectorAll('.config-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeConfigTab = btn.dataset.tab;
      if (window.soundEngine) window.soundEngine.playMechanicalClick();

      document.querySelectorAll('.config-tab-btn').forEach(b => {
        b.classList.remove('text-black', 'border-b', 'border-black');
        b.classList.add('text-zinc-500');
      });
      btn.classList.remove('text-zinc-500');
      btn.classList.add('text-black', 'border-b', 'border-black');

      document.querySelectorAll('.config-tab-content').forEach(c => c.classList.add('hidden'));
      const activeContent = document.getElementById(`config-tab-${activeConfigTab}`);
      if (activeContent) activeContent.classList.remove('hidden');
    });
  });

  // Envío AJAX
  const inquiryForm = document.getElementById('inquiry-form');
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (window.soundEngine) window.soundEngine.playMechanicalClick();

      const submitBtn = document.getElementById('btn-submit-inquiry');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'PROCESANDO SOLICITUD...';
      }

      const clientName = document.getElementById('inquiry-name')?.value || 'Cliente Oficial';
      const clientEmail = document.getElementById('inquiry-email')?.value || 'cliente@exclusive.com';
      const clientPhone = document.getElementById('inquiry-phone')?.value || '';
      const dealerLocation = document.getElementById('inquiry-dealer')?.value || 'Centro Oficial Stuttgart';

      const packagesTotal = packages.reduce((sum, p) => p.selected ? sum + p.price : sum, 0);
      const wheelPrice = selectedWheel ? selectedWheel.price : 0;
      const colorPrice = selectedColor ? selectedColor.price : 0;
      const totalPrice = activeCar.basePrice + wheelPrice + colorPrice + packagesTotal;

      try {
        const response = await fetch('/api/inquiry/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCsrfToken()
          },
          body: JSON.stringify({
            car_slug: activeCar.id,
            color_id: selectedColor?.id,
            wheel_id: selectedWheel?.id,
            packages: packages.filter(p => p.selected).map(p => p.id),
            total_price: totalPrice,
            customer_name: clientName,
            customer_email: clientEmail,
            customer_phone: clientPhone,
            dealer_location: dealerLocation,
          })
        });

        const result = await response.json();
        if (result.success) {
          const successAlert = document.getElementById('inquiry-success-alert');
          const codeEl = document.getElementById('reservation-code-display');
          if (codeEl) codeEl.textContent = result.reservation_code;
          if (successAlert) successAlert.classList.remove('hidden');
          if (inquiryForm) inquiryForm.classList.add('hidden');
        } else {
          alert('Hubo un inconveniente al enviar su solicitud: ' + (result.error || 'Error'));
        }
      } catch (err) {
        console.error(err);
        alert('Error de conexión con el servidor.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'SOLICITAR CONTACTO OFICIAL';
        }
      }
    });
  }

  // -------------------------------------------------------------
  // Modal de Ficha Técnica
  // -------------------------------------------------------------
  function updateSpecsModal() {
    const specs = activeCar.specs || {};
    const titleEl = document.getElementById('specs-modal-title');
    if (titleEl) titleEl.textContent = `${activeCar.fullName} — FICHA TÉCNICA OFICIAL`;

    const elAccel = document.getElementById('modal-spec-accel');
    const elSpeed = document.getElementById('modal-spec-speed');
    const elPower = document.getElementById('modal-spec-power');
    const elTorque = document.getElementById('modal-spec-torque');
    const elEngine = document.getElementById('modal-spec-engine');
    const elDrivetrain = document.getElementById('modal-spec-drivetrain');
    const elTrans = document.getElementById('modal-spec-trans');
    const elWeight = document.getElementById('modal-spec-weight');
    const elDesc = document.getElementById('modal-spec-desc');

    if (elAccel) elAccel.textContent = specs.acceleration || '--';
    if (elSpeed) elSpeed.textContent = specs.topSpeed || '--';
    if (elPower) elPower.textContent = `${specs.powerHp || '--'} (${specs.powerKw || '--'})`;
    if (elTorque) elTorque.textContent = specs.torque || '--';
    if (elEngine) elEngine.textContent = specs.engine || '--';
    if (elDrivetrain) elDrivetrain.textContent = specs.drivetrain || '--';
    if (elTrans) elTrans.textContent = specs.transmission || '--';
    if (elWeight) elWeight.textContent = specs.weight || '--';
    if (elDesc) elDesc.textContent = activeCar.description || '';
  }

  // -------------------------------------------------------------
  // Matriz de Todos los Modelos (Tarjetas 3D Blancas)
  // -------------------------------------------------------------
  function renderModelsMatrix(filter = 'all') {
    const grid = document.getElementById('matrix-cards-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const filtered = filter === 'all'
      ? cars
      : cars.filter(c => c.series.toLowerCase() === filter.toLowerCase());

    filtered.forEach((car) => {
      const card = document.createElement('div');
      card.className = "group relative bg-white border border-black/[0.08] hover:border-black/40 p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-md rounded-[1px]";
      card.innerHTML = `
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[8.5px] font-mono tracking-[0.25em] text-zinc-500 uppercase">${car.badgeText || car.series}</span>
            <span class="text-xs font-mono text-black font-medium">${formatCurrency(car.basePrice)}</span>
          </div>
          <h3 class="text-lg font-normal tracking-wider text-black uppercase mb-1">${car.name}</h3>
          <p class="text-xs text-zinc-500 font-light line-clamp-2 mb-4 leading-relaxed">${car.tagline}</p>
          <div class="relative w-full h-40 overflow-hidden mb-3 bg-zinc-50/80 rounded-[1px] flex items-center justify-center p-2">
            <img src="${car.heroImage}" alt="${car.name}" class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-500" />
          </div>
        </div>

        <div class="pt-3 border-t border-black/[0.05] flex items-center justify-between text-[10px] font-mono">
          <div class="flex items-center space-x-3 text-zinc-500">
            <span>0-100: <strong class="text-black">${car.specs?.acceleration || '--'}</strong></span>
            <span>V-MÁX: <strong class="text-black">${car.specs?.topSpeed || '--'}</strong></span>
          </div>
          <span class="text-black group-hover:translate-x-1 transition-transform flex items-center font-medium">
            VER MODELO 3D →
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        const idx = cars.findIndex(c => c.id === car.id);
        if (idx !== -1) {
          selectModel(idx);
          closeAllModals();
        }
      });

      grid.appendChild(card);
    });
  }

  document.querySelectorAll('.matrix-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playMechanicalClick();
      document.querySelectorAll('.matrix-filter-btn').forEach(b => {
        b.classList.remove('text-black', 'font-semibold');
        b.classList.add('text-zinc-400');
      });
      btn.classList.remove('text-zinc-400');
      btn.classList.add('text-black', 'font-semibold');

      renderModelsMatrix(btn.dataset.filter);
    });
  });

  // -------------------------------------------------------------
  // Buscador Instantáneo
  // -------------------------------------------------------------
  function handleSearch(query) {
    if (!searchResultsContainer) return;
    const q = query.trim().toLowerCase();

    const matches = q === ''
      ? cars
      : cars.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.series.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        (c.specs?.engine && c.specs.engine.toLowerCase().includes(q))
      );

    searchResultsContainer.innerHTML = '';
    if (matches.length === 0) {
      searchResultsContainer.innerHTML = `
        <div class="py-10 text-center text-zinc-500 font-mono text-xs">
          No se encontraron vehículos que coincidan con "${query}".
        </div>
      `;
      return;
    }

    matches.forEach(car => {
      const item = document.createElement('div');
      item.className = "p-3.5 hover:bg-zinc-50 border-b border-black/[0.05] flex items-center justify-between cursor-pointer transition-colors";
      item.innerHTML = `
        <div class="flex items-center space-x-3.5">
          <img src="${car.heroImage}" alt="${car.name}" class="w-14 h-9 object-contain bg-zinc-100 rounded-[1px] p-0.5" />
          <div>
            <div class="text-xs font-medium text-black">${car.name} <span class="text-[10px] text-zinc-500 font-mono">(${car.series.toUpperCase()})</span></div>
            <div class="text-[10.5px] text-zinc-500 font-light">${car.specs?.engine || car.tagline}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs font-mono text-black font-medium">${formatCurrency(car.basePrice)}</div>
          <div class="text-[9.5px] text-zinc-500 font-mono">${car.specs?.powerHp || ''}</div>
        </div>
      `;
      item.addEventListener('click', () => {
        const idx = cars.findIndex(c => c.id === car.id);
        if (idx !== -1) {
          selectModel(idx);
          closeAllModals();
        }
      });
      searchResultsContainer.appendChild(item);
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
  }

  // -------------------------------------------------------------
  // Gestión de Modales
  // -------------------------------------------------------------
  function closeAllModals() {
    if (configuratorDrawer) configuratorDrawer.classList.add('hidden');
    if (specsModal) specsModal.classList.add('hidden');
    if (matrixModal) matrixModal.classList.add('hidden');
    if (navDrawer) navDrawer.classList.add('hidden');
    if (searchModal) searchModal.classList.add('hidden');
  }

  function openConfigurator() {
    if (window.soundEngine) window.soundEngine.playMechanicalClick();
    closeAllModals();
    if (configuratorDrawer) configuratorDrawer.classList.remove('hidden');
  }

  function openSpecsModal() {
    if (window.soundEngine) window.soundEngine.playMechanicalClick();
    closeAllModals();
    if (specsModal) specsModal.classList.remove('hidden');
  }

  function openMatrixModal() {
    if (window.soundEngine) window.soundEngine.playMechanicalClick();
    closeAllModals();
    renderModelsMatrix('all');
    if (matrixModal) matrixModal.classList.remove('hidden');
  }

  function openNavDrawer() {
    if (window.soundEngine) window.soundEngine.playMechanicalClick();
    closeAllModals();
    if (navDrawer) navDrawer.classList.remove('hidden');
  }

  function openSearchModal() {
    if (window.soundEngine) window.soundEngine.playMechanicalClick();
    closeAllModals();
    if (searchModal) {
      searchModal.classList.remove('hidden');
      if (searchInput) {
        searchInput.value = '';
        handleSearch('');
        setTimeout(() => searchInput.focus(), 80);
      }
    }
  }

  document.querySelectorAll('.open-config-trigger').forEach(b => b.addEventListener('click', openConfigurator));
  document.querySelectorAll('.open-specs-trigger').forEach(b => b.addEventListener('click', openSpecsModal));
  document.querySelectorAll('.open-models-trigger').forEach(b => b.addEventListener('click', openMatrixModal));
  document.querySelectorAll('.open-nav-trigger').forEach(b => b.addEventListener('click', openNavDrawer));
  document.querySelectorAll('.open-search-trigger').forEach(b => b.addEventListener('click', openSearchModal));

  document.querySelectorAll('.close-modal-trigger').forEach(b => {
    b.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playMechanicalClick();
      closeAllModals();
    });
  });

  // -------------------------------------------------------------
  // Interacción de Rotación
  // -------------------------------------------------------------
  function setAutoRotate(active) {
    isAutoRotating = active;
    if (autoRotateBtn) {
      autoRotateBtn.classList.toggle('bg-black', isAutoRotating);
      autoRotateBtn.classList.toggle('text-white', isAutoRotating);
    }
  }

  if (autoRotateBtn) {
    autoRotateBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playMechanicalClick();
      setAutoRotate(!isAutoRotating);
    });
  }

  if (toggleHotspotsBtn) {
    toggleHotspotsBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playMechanicalClick();
      showHotspots = !showHotspots;
      toggleHotspotsBtn.classList.toggle('text-black', showHotspots);
      toggleHotspotsBtn.classList.toggle('opacity-50', !showHotspots);
      renderHotspots();
    });
  }

  document.querySelectorAll('.lighting-preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.soundEngine) window.soundEngine.playMechanicalClick();
      lightingPreset = btn.dataset.preset;

      document.querySelectorAll('.lighting-preset-btn').forEach(b => {
        b.classList.remove('text-black', 'font-semibold');
        b.classList.add('text-zinc-400');
      });
      btn.classList.remove('text-zinc-400');
      btn.classList.add('text-black', 'font-semibold');

      if (heroImage) {
        heroImage.className = `w-full h-full object-contain pointer-events-none transition-all duration-300 lighting-${lightingPreset}`;
      }
    });
  });

  if (toggleSoundBtn) {
    toggleSoundBtn.addEventListener('click', () => {
      if (window.soundEngine) {
        isSoundActive = window.soundEngine.toggleSound();
        if (soundIconMuted && soundIconActive) {
          soundIconMuted.classList.toggle('hidden', isSoundActive);
          soundIconActive.classList.toggle('hidden', !isSoundActive);
        }
      }
    });
  }

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (window.soundEngine) window.soundEngine.playMechanicalClick();
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => { });
      } else {
        if (document.exitFullscreen) document.exitFullscreen().catch(() => { });
      }
    });
  }

  const pedestalContainer = document.getElementById('showroom-pedestal-container');
  if (pedestalContainer) {
    pedestalContainer.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, [data-interactive="true"]')) return;
      isDragging = true;
      dragStartX = e.clientX;
      startAngle = rotationAngle;
      setAutoRotate(false);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const newAngle = (startAngle + deltaX * 0.45) % 360;
      rotationAngle = newAngle < 0 ? newAngle + 360 : newAngle;
      if (pedestalCompassAngle) pedestalCompassAngle.textContent = Math.round(rotationAngle) + '°';
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    pedestalContainer.addEventListener('touchstart', (e) => {
      if (e.target.closest('button, [data-interactive="true"]')) return;
      isDragging = true;
      dragStartX = e.touches[0].clientX;
      startAngle = rotationAngle;
      setAutoRotate(false);
    });

    pedestalContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const deltaX = e.touches[0].clientX - dragStartX;
      const newAngle = (startAngle + deltaX * 0.45) % 360;
      rotationAngle = newAngle < 0 ? newAngle + 360 : newAngle;
      if (pedestalCompassAngle) pedestalCompassAngle.textContent = Math.round(rotationAngle) + '°';
    });

    pedestalContainer.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // Atajos de teclado
  window.addEventListener('keydown', (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    } else if (e.key === 'Escape') {
      closeAllModals();
    } else if (e.key === 'ArrowLeft') {
      const prevIdx = activeIndex === 0 ? cars.length - 1 : activeIndex - 1;
      selectModel(prevIdx);
    } else if (e.key === 'ArrowRight') {
      const nextIdx = activeIndex === cars.length - 1 ? 0 : activeIndex + 1;
      selectModel(nextIdx);
    }
  });

  // Inicialización
  initThreeJS();
  selectModel(activeIndex);
  setMode3D(true);
});
