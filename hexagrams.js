/* ==========================================================================
   《易经数理秘笈》六十四卦 3D 拓扑解构馆 - (hexagrams.js)
   特点：100% 同步全新 3D 日月极星全息浑天坐标体系 + 64 卦六爻 5 栏直列网格对齐
   ========================================================================== */

const EARTHLY_BRANCHES = [
    { idx: 0, name: "子", rem: 1,  system: "赤道(天)", color: "#ff5252" },
    { idx: 1, name: "丑", rem: 2,  system: "黄道(地)", color: "#40c057" },
    { idx: 2, name: "寅", rem: 3,  system: "白道(万物)", color: "#4dabf7" },
    { idx: 3, name: "卯", rem: 4,  system: "赤道(天)", color: "#ff5252" },
    { idx: 4, name: "辰", rem: 5,  system: "黄道(地)", color: "#40c057" },
    { idx: 5, name: "巳", rem: 6,  system: "白道(万物)", color: "#4dabf7" },
    { idx: 6, name: "午", rem: 7,  system: "赤道(天)", color: "#ff5252" },
    { idx: 7, name: "未", rem: 8,  system: "黄道(地)", color: "#40c057" },
    { idx: 8, name: "申", rem: 9,  system: "白道(万物)", color: "#4dabf7" },
    { idx: 9, name: "酉", rem: 10, system: "赤道(天)", color: "#ff5252" },
    { idx: 10, name: "戌", rem: 11, system: "黄道(地)", color: "#40c057" },
    { idx: 11, name: "亥", rem: 0,  system: "白道(万物)", color: "#4dabf7" },
];

const LUOSHU_PALACES_EXACT = [
    { num: 4, name: "巽四宫 (木)", numbers: [31, 76, 13, 22, 40, 58, 67, 4, 49], class: "palace-xun" },
    { num: 9, name: "离九宫 (火)", numbers: [36, 81, 18, 27, 45, 63, 72, 9, 54], class: "palace-li" },
    { num: 2, name: "坤二宫 (土)", numbers: [29, 74, 11, 20, 38, 56, 65, 2, 47], class: "palace-kun" },
    { num: 3, name: "震三宫 (木)", numbers: [30, 75, 12, 21, 39, 57, 66, 3, 48], class: "palace-zhen" },
    { num: 5, name: "中五宫 (土)", numbers: [32, 77, 14, 23, 41, 59, 68, 5, 50], class: "palace-zhong" },
    { num: 7, name: "兑七宫 (金)", numbers: [34, 79, 16, 25, 43, 61, 70, 7, 52], class: "palace-dui" },
    { num: 8, name: "艮八宫 (土)", numbers: [35, 80, 17, 26, 44, 62, 71, 8, 53], class: "palace-gen" },
    { num: 1, name: "坎一宫 (水)", numbers: [28, 73, 10, 19, 37, 55, 64, 1, 46], class: "palace-kan" },
    { num: 6, name: "乾六宫 (金)", numbers: [33, 78, 15, 24, 42, 60, 69, 6, 51], class: "palace-qian" },
];

const HEXAGRAMS_64_DATA = [
    { num: 1, name: "乾为天", symbol: "☰☰", lines: [1,1,1,1,1,1] },
    { num: 2, name: "坤为地", symbol: "☷☷", lines: [0,0,0,0,0,0] },
    { num: 3, name: "水雷屯", symbol: "☵☳", lines: [1,0,0,0,1,0] },
    { num: 4, name: "山水蒙", symbol: "☶☵", lines: [0,1,0,0,0,1] },
    { num: 5, name: "水天需", symbol: "☵☰", lines: [1,1,1,0,1,0] },
    { num: 6, name: "天水讼", symbol: "☰☵", lines: [0,1,0,1,1,1] },
    { num: 7, name: "地水师", symbol: "☷☵", lines: [0,1,0,0,0,0] },
    { num: 8, name: "水地比", symbol: "☵☷", lines: [0,0,0,0,1,0] },
    { num: 9, name: "风天小畜", symbol: "☴☰", lines: [1,1,1,0,1,1] },
    { num: 10, name: "天泽履", symbol: "☰☱", lines: [1,1,0,1,1,1] },
    { num: 11, name: "地天泰", symbol: "☷☰", lines: [1,1,1,0,0,0] },
    { num: 12, name: "天地否", symbol: "☰☷", lines: [0,0,0,1,1,1] },
    { num: 13, name: "天火同人", symbol: "☰☲", lines: [1,0,1,1,1,1] },
    { num: 14, name: "火天大有", symbol: "☲☰", lines: [1,1,1,1,0,1] },
    { num: 15, name: "地山谦", symbol: "☷☶", lines: [0,0,1,0,0,0] },
    { num: 16, name: "雷地豫", symbol: "☳☷", lines: [0,0,0,1,0,0] },
    { num: 17, name: "泽雷随", symbol: "☱☳", lines: [1,0,0,1,1,0] },
    { num: 18, name: "山风蛊", symbol: "☶☴", lines: [0,1,1,0,0,1] },
    { num: 19, name: "地泽临", symbol: "☷☱", lines: [1,1,0,0,0,0] },
    { num: 20, name: "风地观", symbol: "☴☷", lines: [0,0,0,0,1,1] },
    { num: 21, name: "火雷噬嗑", symbol: "☲☳", lines: [1,0,0,1,0,1] },
    { num: 22, name: "山火贲", symbol: "☶☲", lines: [1,0,1,0,0,1] },
    { num: 23, name: "山地剥", symbol: "☶☷", lines: [0,0,0,0,0,1] },
    { num: 24, name: "地雷复", symbol: "☷☳", lines: [1,0,0,0,0,0] },
    { num: 25, name: "天雷无妄", symbol: "☰☳", lines: [1,0,0,1,1,1] },
    { num: 26, name: "山天大畜", symbol: "☶☰", lines: [1,1,1,0,0,1] },
    { num: 27, name: "山雷颐", symbol: "☶☳", lines: [1,0,0,0,0,1] },
    { num: 28, name: "泽风大过", symbol: "☱☴", lines: [0,1,1,1,1,0] },
    { num: 29, name: "坎为水", symbol: "☵☵", lines: [0,1,0,0,1,0] },
    { num: 30, name: "离为火", symbol: "☲☲", lines: [1,0,1,1,0,1] },
    { num: 31, name: "泽山咸", symbol: "☱☶", lines: [0,0,1,1,1,0] },
    { num: 32, name: "雷风恒", symbol: "☳☴", lines: [0,1,1,1,0,0] },
    { num: 33, name: "天山遁", symbol: "☰☶", lines: [0,0,1,1,1,1] },
    { num: 34, name: "雷天大壮", symbol: "☳☰", lines: [1,1,1,1,0,0] },
    { num: 35, name: "火地晋", symbol: "☲☷", lines: [0,0,0,1,0,1] },
    { num: 36, name: "地火明夷", symbol: "☷☲", lines: [1,0,1,0,0,0] },
    { num: 37, name: "风火家人", symbol: "☴☲", lines: [1,0,1,0,1,1] },
    { num: 38, name: "火泽睽", symbol: "☲☱", lines: [1,1,0,1,0,1] },
    { num: 39, name: "水山蹇", symbol: "☵☶", lines: [0,0,1,0,1,0] },
    { num: 40, name: "雷水解", symbol: "☳☵", lines: [0,1,0,1,0,0] },
    { num: 41, name: "山泽损", symbol: "☶☱", lines: [1,1,0,0,0,1] },
    { num: 42, name: "风雷益", symbol: "☴☳", lines: [1,0,0,0,1,1] },
    { num: 43, name: "泽天夬", symbol: "☱☰", lines: [1,1,1,1,1,0] },
    { num: 44, name: "天风姤", symbol: "☰☴", lines: [0,1,1,1,1,1] },
    { num: 45, name: "泽地萃", symbol: "☱☷", lines: [0,0,0,1,1,0] },
    { num: 46, name: "地风升", symbol: "☷☴", lines: [0,1,1,0,0,0] },
    { num: 47, name: "泽水困", symbol: "☱☵", lines: [0,1,0,1,1,0] },
    { num: 48, name: "水风井", symbol: "☵☴", lines: [0,1,1,0,1,0] },
    { num: 49, name: "泽火革", symbol: "☱☲", lines: [1,0,1,1,1,0] },
    { num: 50, name: "火风鼎", symbol: "☲☴", lines: [0,1,1,1,0,1] },
    { num: 51, name: "震为雷", symbol: "☳☳", lines: [1,0,0,1,0,0] },
    { num: 52, name: "艮为山", symbol: "☶☶", lines: [0,0,1,0,0,1] },
    { num: 53, name: "风山渐", symbol: "☴☶", lines: [0,0,1,0,1,1] },
    { num: 54, name: "雷泽归妹", symbol: "☳☱", lines: [1,1,0,1,0,0] },
    { num: 55, name: "雷火丰", symbol: "☳☲", lines: [1,0,1,1,0,0] },
    { num: 56, name: "火山旅", symbol: "☲☶", lines: [0,0,1,1,0,1] },
    { num: 57, name: "巽为风", symbol: "☴☴", lines: [0,1,1,0,1,1] },
    { num: 58, name: "兑为泽", symbol: "☱☱", lines: [1,1,0,1,1,0] },
    { num: 59, name: "风水涣", symbol: "☴☵", lines: [0,1,0,0,1,1] },
    { num: 60, name: "水泽节", symbol: "☵☱", lines: [1,1,0,0,1,0] },
    { num: 61, name: "风泽中孚", symbol: "☴☱", lines: [1,1,0,0,1,1] },
    { num: 62, name: "雷山小过", symbol: "☳☶", lines: [0,0,1,1,0,0] },
    { num: 63, name: "水火既济", symbol: "☵☲", lines: [1,0,1,0,1,0] },
    { num: 64, name: "火水未济", symbol: "☲☵", lines: [0,1,0,1,0,1] }
];

function getBranch3DPos(branchIdx, radius = 6.0) {
    const angle = THREE.MathUtils.degToRad(90 - branchIdx * 30);
    const baseVec = new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0);
    
    const remSystem = (branchIdx + 1) % 3;
    if (remSystem === 2) {
        baseVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(23.5));
    } else if (remSystem === 0) {
        baseVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-15));
    }
    return baseVec;
}

class HexagramVivid3DEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth || 400;
        this.height = this.container.clientHeight || 500;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.equatorGroup = new THREE.Group();
        this.eclipticGroup = new THREE.Group();
        this.lunarGroup = new THREE.Group();
        this.celestialGridGroup = new THREE.Group();
        this.orbsGroup = new THREE.Group();
        this.hex3DGroup = new THREE.Group();

        this.sunMesh = null;
        this.moonMesh = null;
        this.sunAngle = 0;
        this.moonAngle = 0;
        this.autoRotate = true;

        this.initScene();
        this.createArmillaryRings();
        this.createCelestialGridAndPoles();
        this.createSunAndMoonObjects();
        this.setupLights();
        
        this.adjustCameraFit();
        this.animate();

        window.addEventListener("resize", () => this.adjustCameraFit());
        setTimeout(() => this.adjustCameraFit(), 100);
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x101628, 0.02);

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.scene.add(this.equatorGroup);
        this.scene.add(this.eclipticGroup);
        this.scene.add(this.lunarGroup);
        this.scene.add(this.celestialGridGroup);
        this.scene.add(this.orbsGroup);
        this.scene.add(this.hex3DGroup);
    }

    adjustCameraFit() {
        if (!this.container) return;
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        if (this.width === 0 || this.height === 0) return;

        const aspect = this.width / this.height;
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();

        const targetRadius = 7.8;
        let dist = targetRadius / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2));
        if (aspect < 1.0) {
            dist = dist / aspect;
        }
        dist = Math.max(13, Math.min(dist, 24));

        this.camera.position.set(0, -dist * 0.95, dist * 0.95);
        this.controls.target.set(0, 0, 0);
        this.renderer.setSize(this.width, this.height);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
        this.scene.add(ambientLight);

        const goldLight = new THREE.PointLight(0xffe066, 2.5, 60);
        goldLight.position.set(0, 0, 15);
        this.scene.add(goldLight);
    }

    createCelestialGridAndPoles() {
        const radius = 6.0;

        const gridGeom = new THREE.SphereGeometry(radius * 1.02, 24, 18);
        const gridMat = new THREE.MeshBasicMaterial({ color: 0x4dabf7, wireframe: true, transparent: true, opacity: 0.08 });
        const gridMesh = new THREE.Mesh(gridGeom, gridMat);
        this.celestialGridGroup.add(gridMesh);

        const polePoints = [new THREE.Vector3(0, 0, -8.5), new THREE.Vector3(0, 0, 8.5)];
        const poleGeom = new THREE.BufferGeometry().setFromPoints(polePoints);
        const poleMat = new THREE.LineDashedMaterial({ color: 0xffe066, dashSize: 0.4, gapSize: 0.2, linewidth: 2 });
        const poleLine = new THREE.Line(poleGeom, poleMat);
        poleLine.computeLineDistances();
        this.celestialGridGroup.add(poleLine);

        const northStarGeom = new THREE.SphereGeometry(0.35, 16, 16);
        const northStarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe066, emissiveIntensity: 1.0 });
        const northStar = new THREE.Mesh(northStarGeom, northStarMat);
        northStar.position.set(0, 0, 8.5);
        this.celestialGridGroup.add(northStar);

        const northSprite = this.createTextSprite("⭐ 北极星", "#ffe066");
        northSprite.position.set(0, 0, 9.8);
        this.celestialGridGroup.add(northSprite);
    }

    createArmillaryRings() {
        const radius = 6.0;

        const equatorGeom = new THREE.TorusGeometry(radius, 0.07, 16, 120);
        const equatorMat = new THREE.MeshStandardMaterial({ color: 0xff5252, metalness: 0.8, roughness: 0.2, emissive: 0x880000 });
        const equatorMesh = new THREE.Mesh(equatorGeom, equatorMat);
        this.equatorGroup.add(equatorMesh);

        const eclipticMat = new THREE.MeshStandardMaterial({ color: 0x40c057, metalness: 0.8, roughness: 0.2, emissive: 0x006600 });
        const eclipticMesh = new THREE.Mesh(equatorGeom.clone(), eclipticMat);
        eclipticMesh.rotation.x = THREE.MathUtils.degToRad(23.5);
        this.eclipticGroup.add(eclipticMesh);

        const lunarMat = new THREE.MeshStandardMaterial({ color: 0x4dabf7, metalness: 0.8, roughness: 0.2, emissive: 0x0033aa });
        const lunarMesh = new THREE.Mesh(equatorGeom.clone(), lunarMat);
        lunarMesh.rotation.x = THREE.MathUtils.degToRad(-15);
        this.lunarGroup.add(lunarMesh);

        EARTHLY_BRANCHES.forEach((b) => {
            const pos = getBranch3DPos(b.idx, radius);

            const orbGeom = new THREE.SphereGeometry(0.32, 16, 16);
            const orbMat = new THREE.MeshStandardMaterial({ color: b.color, metalness: 0.9, roughness: 0.1, emissive: b.color, emissiveIntensity: 0.5 });
            const orbMesh = new THREE.Mesh(orbGeom, orbMat);
            orbMesh.position.copy(pos);
            this.orbsGroup.add(orbMesh);

            const ringGeom = new THREE.TorusGeometry(0.48, 0.02, 12, 32);
            const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe066, side: THREE.DoubleSide });
            const ringMesh = new THREE.Mesh(ringGeom, ringMat);
            ringMesh.position.copy(pos);
            ringMesh.rotation.x = Math.PI / 2;
            this.orbsGroup.add(ringMesh);

            const sprite = this.createTextSprite(b.name, b.color);
            sprite.position.copy(pos.clone().multiplyScalar(1.18));
            this.orbsGroup.add(sprite);
        });
    }

    createSunAndMoonObjects() {
        const sunGeom = new THREE.SphereGeometry(0.55, 32, 32);
        const sunMat = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffaa00, emissiveIntensity: 1.0 });
        this.sunMesh = new THREE.Mesh(sunGeom, sunMat);
        this.scene.add(this.sunMesh);

        const moonGeom = new THREE.SphereGeometry(0.42, 32, 32);
        const moonMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x4dabf7, emissiveIntensity: 0.8 });
        this.moonMesh = new THREE.Mesh(moonGeom, moonMat);
        this.scene.add(this.moonMesh);
    }

    createTextSprite(text, colorHex) {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(10, 16, 30, 0.95)";
        ctx.beginPath();
        ctx.arc(64, 64, 52, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = "Bold 44px 'Noto Serif SC', 'KaiTi', serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(1.35, 1.35, 1.35);
        return sprite;
    }

    clearHex3DGroup() {
        while (this.hex3DGroup.children.length > 0) {
            const obj = this.hex3DGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
    }

    renderHexagram3DTrajectory(hexNum) {
        this.clearHex3DGroup();
        const radius = 6.0;
        const points = [];

        for (let i = 1; i <= 6; i++) {
            const val = hexNum * i;
            const rem12 = val % 12 === 0 ? 12 : val % 12;
            const branchIdx = rem12 - 1;
            points.push(getBranch3DPos(branchIdx, radius));
        }

        points.push(points[0]);

        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0xffe066, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.hex3DGroup.add(line);

        points.forEach((p, idx) => {
            if (idx < 6) {
                const sGeom = new THREE.SphereGeometry(0.35, 16, 16);
                const sMat = new THREE.MeshStandardMaterial({ color: 0xff5252, emissive: 0xff5252 });
                const sMesh = new THREE.Mesh(sGeom, sMat);
                sMesh.position.copy(p);
                this.hex3DGroup.add(sMesh);
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.002;
        }

        this.sunAngle += 0.008;
        const sunRadius = 6.0;
        const sunPos = new THREE.Vector3(sunRadius * Math.cos(this.sunAngle), sunRadius * Math.sin(this.sunAngle), 0);
        sunPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(23.5));
        if (this.sunMesh) this.sunMesh.position.copy(sunPos);

        this.moonAngle -= 0.012;
        const moonPos = new THREE.Vector3(sunRadius * Math.cos(this.moonAngle), sunRadius * Math.sin(this.moonAngle), 0);
        moonPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-15));
        if (this.moonMesh) this.moonMesh.position.copy(moonPos);

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new HexagramVivid3DEngine("three-canvas-hex");

    const matrixContainer = document.getElementById("taiyi-81-matrix");

    function initLuoshuTaiyi9x9Matrix() {
        if (!matrixContainer) return;
        matrixContainer.className = "luoshu-taiyi-9x9-container";
        matrixContainer.innerHTML = "";

        LUOSHU_PALACES_EXACT.forEach(palace => {
            const block = document.createElement("div");
            block.className = `palace-block ${palace.class}`;
            
            const title = document.createElement("div");
            title.className = "palace-block-title";
            title.innerText = palace.name;
            block.appendChild(title);

            const grid3x3 = document.createElement("div");
            grid3x3.className = "palace-grid-3x3";

            palace.numbers.forEach(num => {
                const cell = document.createElement("div");
                cell.className = "taiyi-81-cell";
                cell.dataset.pos = num;
                cell.title = `数值 ${num} (${palace.name})`;
                cell.innerText = num;
                cell.addEventListener("click", () => {
                    if (num <= 64) {
                        document.getElementById("hex-select").value = num;
                        renderHexagramDetail(num);
                    }
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    const hexSelect = document.getElementById("hex-select");
    const hexDetailBox = document.getElementById("hex-detail-box");
    const hexBadgeTitle = document.getElementById("hex-badge-title");
    const hexBadgeDesc = document.getElementById("hex-badge-desc");

    if (hexSelect) {
        HEXAGRAMS_64_DATA.forEach(hex => {
            const opt = document.createElement("option");
            opt.value = hex.num;
            opt.innerText = `第 ${hex.num} 卦 · ${hex.name} (${hex.symbol})`;
            hexSelect.appendChild(opt);
        });

        hexSelect.addEventListener("change", (e) => {
            renderHexagramDetail(parseInt(e.target.value, 10));
        });
    }

    const YAO_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

    function renderHexagramDetail(hexNum) {
        const hex = HEXAGRAMS_64_DATA.find(h => h.num === hexNum) || HEXAGRAMS_64_DATA[0];
        const rem81 = hex.num % 81 === 0 ? 81 : hex.num % 81;

        let rowsHtml = "";
        const yaoRem12List = [];

        hex.lines.forEach((type, idx) => {
            const yaoIdx = idx + 1;
            const mathVal = hex.num * yaoIdx;
            const rem12 = mathVal % 12 === 0 ? 12 : mathVal % 12;
            yaoRem12List.push(rem12);
            const branch = EARTHLY_BRANCHES[rem12 - 1];

            const symbolHtml = type === 1 ? 
                `<div class="yao-line-yang"></div>` : 
                `<div class="yao-line-yin"><span></span><span></span></div>`;

            rowsHtml += `
                <div class="yao-row">
                    <div class="yao-name">${YAO_NAMES[idx]}</div>
                    <div class="yao-symbol">${symbolHtml}</div>
                    <div class="yao-math-calc">${hex.num} × ${yaoIdx} = ${mathVal}</div>
                    <div class="yao-math-rem">余 ${rem12}</div>
                    <div class="yao-math-branch" style="color:${branch.color}">${branch.name}(${branch.system.split('(')[0]})</div>
                </div>
            `;
        });

        hexDetailBox.innerHTML = `
            <div class="hex-header">
                <div class="hex-name">${hex.symbol} 第 ${hex.num} 卦 · ${hex.name}</div>
                <div class="hex-sum">初爻开局算式: ${hex.num} × 1 = ${hex.num} (太乙 81 降维落第 ${rem81} 宫)</div>
            </div>
            <div class="hex-lines-grid">
                ${rowsHtml}
            </div>
        `;

        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            if (p === rem81) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });

        engine.renderHexagram3DTrajectory(hex.num);

        hexBadgeTitle.innerText = `${hex.name} (${hex.symbol}) 3D 轨迹闭环`;
        hexBadgeDesc.innerText = `六爻 1~6 递进推演，在天体空间勾勒出该卦的 3D 闭环图谱`;
    }

    const btnSpeed = document.getElementById("btn-speed-control");
    const speedVal = document.getElementById("speed-val");
    const speedLevels = [0.5, 1.0, 2.0, 4.0];
    let currentSpeedIdx = 1;

    if (btnSpeed) {
        btnSpeed.addEventListener("click", () => {
            currentSpeedIdx = (currentSpeedIdx + 1) % speedLevels.length;
            const level = speedLevels[currentSpeedIdx];
            if (speedVal) speedVal.innerText = `${level}x`;
        });
    }

    document.getElementById("btn-toggle-equator").addEventListener("click", function() {
        this.classList.toggle("active");
        engine.equatorGroup.visible = this.classList.contains("active");
    });
    document.getElementById("btn-toggle-ecliptic").addEventListener("click", function() {
        this.classList.toggle("active");
        engine.eclipticGroup.visible = this.classList.contains("active");
    });
    document.getElementById("btn-toggle-lunar").addEventListener("click", function() {
        this.classList.toggle("active");
        engine.lunarGroup.visible = this.classList.contains("active");
    });
    document.getElementById("btn-reset-view").addEventListener("click", () => {
        engine.adjustCameraFit();
    });
    document.getElementById("btn-toggle-autorotate").addEventListener("click", function() {
        this.classList.toggle("active");
        engine.autoRotate = this.classList.contains("active");
    });

    renderHexagramDetail(1); // 默认乾卦
});
