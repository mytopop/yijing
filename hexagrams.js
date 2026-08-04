/* ==========================================================================
   《易经数理秘笈》六十四卦 3D 拓扑与六爻算式 - 核心逻辑 (hexagrams.js)
   特点：无中间大球 + 12地支三分坐标环 + 恢复原版 9 宫卡片 + 5栏网格对齐六爻算式
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

const HEXAGRAMS_DATA = [
    { id: 1, name: "乾为天", lines: [1, 1, 1, 1, 1, 1] },
    { id: 2, name: "坤为地", lines: [0, 0, 0, 0, 0, 0] },
    { id: 3, name: "水雷屯", lines: [1, 0, 0, 0, 1, 0] },
    { id: 4, name: "山水蒙", lines: [0, 1, 0, 0, 0, 1] },
    { id: 5, name: "水天需", lines: [1, 1, 1, 0, 1, 0] },
    { id: 6, name: "天水讼", lines: [0, 1, 0, 1, 1, 1] },
    { id: 7, name: "地水师", lines: [0, 1, 0, 0, 0, 0] },
    { id: 8, name: "水地比", lines: [0, 0, 0, 0, 1, 0] },
    { id: 9, name: "风天小畜", lines: [1, 1, 1, 0, 1, 1] },
    { id: 10, name: "天泽履", lines: [1, 1, 0, 1, 1, 1] },
    { id: 11, name: "地天泰", lines: [1, 1, 1, 0, 0, 0] },
    { id: 12, name: "天地否", lines: [0, 0, 0, 1, 1, 1] },
    { id: 13, name: "天火同人", lines: [1, 0, 1, 1, 1, 1] },
    { id: 14, name: "火天大有", lines: [1, 1, 1, 1, 0, 1] },
    { id: 15, name: "地山谦", lines: [0, 0, 1, 0, 0, 0] },
    { id: 16, name: "雷地豫", lines: [0, 0, 0, 1, 0, 0] },
    { id: 17, name: "泽雷随", lines: [1, 0, 0, 1, 1, 0] },
    { id: 18, name: "山风蛊", lines: [0, 1, 1, 0, 0, 1] },
    { id: 19, name: "地泽临", lines: [1, 1, 0, 0, 0, 0] },
    { id: 20, name: "风地观", lines: [0, 0, 0, 0, 1, 1] },
    { id: 21, name: "火雷噬嗑", lines: [1, 0, 0, 1, 0, 1] },
    { id: 22, name: "山火贲", lines: [1, 0, 1, 0, 0, 1] },
    { id: 23, name: "山地剥", lines: [0, 0, 0, 0, 0, 1] },
    { id: 24, name: "地雷复", lines: [1, 0, 0, 0, 0, 0] },
    { id: 25, name: "天雷无妄", lines: [1, 0, 0, 1, 1, 1] },
    { id: 26, name: "山天大畜", lines: [1, 1, 1, 0, 0, 1] },
    { id: 27, name: "山雷颐", lines: [1, 0, 0, 0, 0, 1] },
    { id: 28, name: "泽风大过", lines: [0, 1, 1, 1, 1, 0] },
    { id: 29, name: "坎为水", lines: [0, 1, 0, 0, 1, 0] },
    { id: 30, name: "离为火", lines: [1, 0, 1, 1, 0, 1] },
    { id: 31, name: "泽山咸", lines: [0, 0, 1, 1, 1, 0] },
    { id: 32, name: "雷风恒", lines: [0, 1, 1, 1, 0, 0] },
    { id: 33, name: "天山遯", lines: [0, 0, 1, 1, 1, 1] },
    { id: 34, name: "雷天大壮", lines: [1, 1, 1, 1, 0, 0] },
    { id: 35, name: "火地晋", lines: [0, 0, 0, 1, 0, 1] },
    { id: 36, name: "地火明夷", lines: [1, 0, 1, 0, 0, 0] },
    { id: 37, name: "风火家人", lines: [1, 0, 1, 0, 1, 1] },
    { id: 38, name: "火泽睽", lines: [1, 1, 0, 1, 0, 1] },
    { id: 39, name: "水山蹇", lines: [0, 0, 1, 0, 1, 0] },
    { id: 40, name: "雷水解", lines: [0, 1, 0, 1, 0, 0] },
    { id: 41, name: "山泽损", lines: [1, 1, 0, 0, 0, 1] },
    { id: 42, name: "风雷益", lines: [1, 0, 0, 0, 1, 1] },
    { id: 43, name: "泽天夬", lines: [1, 1, 1, 1, 1, 0] },
    { id: 44, name: "天风姤", lines: [0, 1, 1, 1, 1, 1] },
    { id: 45, name: "泽地萃", lines: [0, 0, 0, 1, 1, 0] },
    { id: 46, name: "地风升", lines: [0, 1, 1, 0, 0, 0] },
    { id: 47, name: "泽水困", lines: [0, 1, 0, 1, 1, 0] },
    { id: 48, name: "水风井", lines: [0, 1, 1, 0, 1, 0] },
    { id: 49, name: "泽火革", lines: [1, 0, 1, 1, 1, 0] },
    { id: 50, name: "火风鼎", lines: [0, 1, 1, 1, 0, 1] },
    { id: 51, name: "震为雷", lines: [1, 0, 0, 1, 0, 0] },
    { id: 52, name: "艮为山", lines: [0, 0, 1, 0, 0, 1] },
    { id: 53, name: "风山渐", lines: [0, 0, 1, 0, 1, 1] },
    { id: 54, name: "雷泽归妹", lines: [1, 1, 0, 1, 0, 0] },
    { id: 55, name: "雷火丰", lines: [1, 0, 1, 1, 0, 0] },
    { id: 56, name: "火山旅", lines: [0, 0, 1, 1, 0, 1] },
    { id: 57, name: "巽为风", lines: [0, 1, 1, 0, 1, 1] },
    { id: 58, name: "兑为泽", lines: [1, 1, 0, 1, 1, 0] },
    { id: 59, name: "风水涣", lines: [0, 1, 0, 0, 1, 1] },
    { id: 60, name: "水泽节", lines: [1, 1, 0, 0, 1, 0] },
    { id: 61, name: "风泽中孚", lines: [1, 1, 0, 0, 1, 1] },
    { id: 62, name: "雷山小过", lines: [0, 0, 1, 1, 0, 0] },
    { id: 63, name: "水火既济", lines: [1, 0, 1, 0, 1, 0] },
    { id: 64, name: "火水未济", lines: [0, 1, 0, 1, 0, 1] }
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

class Hexagram3DEngine {
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
        this.hex3DGroup = new THREE.Group();
        this.nodesGroup = new THREE.Group();

        this.autoRotate = true;
        this.activeCurve = null;
        this.dataPulseMesh = null;
        this.pulseProgress = 0;
        this.pulseSpeedMultiplier = 1.0;

        this.initScene();
        this.createArmillaryRings();
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
        this.scene.add(this.hex3DGroup);
        this.scene.add(this.nodesGroup);
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

        const blueLight = new THREE.PointLight(0x4dabf7, 1.8, 60);
        blueLight.position.set(0, 15, -10);
        this.scene.add(blueLight);
    }

    createArmillaryRings() {
        const radius = 6.0;

        const equatorGeom = new THREE.TorusGeometry(radius, 0.05, 16, 120);
        const equatorMat = new THREE.MeshStandardMaterial({ color: 0xff5252, metalness: 0.8, roughness: 0.2, emissive: 0x660000 });
        const equatorMesh = new THREE.Mesh(equatorGeom, equatorMat);
        this.equatorGroup.add(equatorMesh);

        const eclipticMat = new THREE.MeshStandardMaterial({ color: 0x40c057, metalness: 0.8, roughness: 0.2, emissive: 0x004400 });
        const eclipticMesh = new THREE.Mesh(equatorGeom.clone(), eclipticMat);
        eclipticMesh.rotation.x = THREE.MathUtils.degToRad(23.5);
        this.eclipticGroup.add(eclipticMesh);

        const lunarMat = new THREE.MeshStandardMaterial({ color: 0x4dabf7, metalness: 0.8, roughness: 0.2, emissive: 0x002266 });
        const lunarMesh = new THREE.Mesh(equatorGeom.clone(), lunarMat);
        lunarMesh.rotation.x = THREE.MathUtils.degToRad(-15);
        this.lunarGroup.add(lunarMesh);

        EARTHLY_BRANCHES.forEach((b) => {
            const pos = getBranch3DPos(b.idx, radius);

            const nodeGeom = new THREE.SphereGeometry(0.28, 16, 16);
            const nodeMat = new THREE.MeshStandardMaterial({ color: b.color, metalness: 0.9, roughness: 0.1 });
            const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
            nodeMesh.position.copy(pos);
            this.nodesGroup.add(nodeMesh);

            const sprite = this.createTextSprite(b.name, b.color);
            sprite.position.copy(pos.clone().multiplyScalar(1.18));
            this.nodesGroup.add(sprite);
        });

        this.createStarfield();
    }

    createStarfield() {
        const starsGeom = new THREE.BufferGeometry();
        const count = 250;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 60;
            positions[i+1] = (Math.random() - 0.5) * 60;
            positions[i+2] = (Math.random() - 0.5) * 60;
        }

        starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starsMat = new THREE.PointsMaterial({ color: 0xffe066, size: 0.08, transparent: true, opacity: 0.4 });
        const starfield = new THREE.Points(starsGeom, starsMat);
        this.scene.add(starfield);
    }

    createTextSprite(text, colorHex) {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(16, 22, 40, 0.92)";
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
        this.activeCurve = null;
        this.dataPulseMesh = null;
    }

    renderHexagram3DTrajectory(hexId) {
        this.clearHex3DGroup();
        const radius = 6.0;
        const points = [];

        for (let k = 1; k <= 6; k++) {
            const val = hexId * k;
            const rem12 = val % 12 === 0 ? 12 : val % 12;
            const bIdx = rem12 - 1;
            points.push(getBranch3DPos(bIdx, radius));
        }

        points.push(points[0]);

        this.activeCurve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.05);
        const tubeGeom = new THREE.TubeGeometry(this.activeCurve, 80, 0.08, 8, true);
        const tubeMat = new THREE.MeshStandardMaterial({
            color: 0xffe066,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0xaa7c11,
            transparent: true,
            opacity: 0.9
        });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        this.hex3DGroup.add(tubeMesh);

        points.slice(0, 6).forEach((p, idx) => {
            const isYang = HEXAGRAMS_DATA[hexId - 1].lines[idx];
            const color = isYang ? 0xffe066 : 0x4dabf7;
            const sphereGeom = new THREE.SphereGeometry(0.35, 16, 16);
            const sphereMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.9 });
            const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            sphereMesh.position.copy(p);
            this.hex3DGroup.add(sphereMesh);
        });

        const pulseGeom = new THREE.SphereGeometry(0.42, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.hex3DGroup.add(this.dataPulseMesh);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.002;
        }

        if (this.activeCurve && this.dataPulseMesh) {
            this.pulseProgress += 0.004 * this.pulseSpeedMultiplier;
            if (this.pulseProgress > 1.0) this.pulseProgress = 0;
            const pos = this.activeCurve.getPointAt(this.pulseProgress);
            this.dataPulseMesh.position.copy(pos);
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new Hexagram3DEngine("three-canvas-hexagrams");

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
                    let targetHexId = num > 64 ? (num % 64) : num;
                    if (targetHexId === 0) targetHexId = 64;
                    toggleHexagramAnalysis(targetHexId, num);
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    const hexSelect = document.getElementById("hexagram-select");
    HEXAGRAMS_DATA.forEach(h => {
        const opt = document.createElement("option");
        opt.value = h.id;
        opt.innerText = `第 ${h.id} 卦：${h.name}`;
        hexSelect.appendChild(opt);
    });

    const hexDetailBox = document.getElementById("hexagram-detail-box");
    const hexBadgeTitle = document.getElementById("hex-badge-title");
    const hexBadgeDesc = document.getElementById("hex-badge-desc");

    let currentAnalyzedHexId = null;

    const yaoNames = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

    function renderHexagramDetail(hexId, clickedPos = null) {
        const idInt = parseInt(hexId, 10);
        const hex = HEXAGRAMS_DATA.find(h => h.id === idInt);
        if (!hex) return;

        let sumVal = 0;
        let linesHtml = "";

        hex.lines.forEach((isYang, idx) => {
            const step = idx + 1;
            const val = idInt * step; // N*1, N*2, N*3, N*4, N*5, N*6
            sumVal += val;

            const rem = val % 12 === 0 ? 12 : val % 12;
            const branch = EARTHLY_BRANCHES[rem - 1];

            const symbolHtml = isYang
                ? `<div class="yao-line-yang"></div>`
                : `<div class="yao-line-yin"><span></span><span></span></div>`;

            linesHtml += `
                <div class="yao-row">
                    <div class="yao-name">${yaoNames[idx]}</div>
                    <div class="yao-symbol">${symbolHtml}</div>
                    <div class="yao-math-calc">${idInt}×${step} = ${val}</div>
                    <div class="yao-math-rem">余${rem}</div>
                    <div class="yao-math-branch" style="color:${branch.color}">${branch.name}(${branch.system.split('(')[0]})</div>
                </div>
            `;
        });

        const rem81 = sumVal % 81 === 0 ? 81 : sumVal % 81;

        hexDetailBox.innerHTML = `
            <div class="hex-header">
                <div class="hex-name">第 ${hex.id} 卦 · ${hex.name}</div>
                <div class="hex-sum">六爻数总和 S = ${sumVal} ➔ 模 81 降维得 <strong>${rem81} 号位</strong></div>
            </div>
            <div class="hex-lines-grid">
                ${linesHtml}
            </div>
        `;

        const highlightTargets = [idInt];
        if (!highlightTargets.includes(rem81)) highlightTargets.push(rem81);
        if (clickedPos && !highlightTargets.includes(clickedPos)) highlightTargets.push(clickedPos);

        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            if (highlightTargets.includes(p)) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });

        engine.renderHexagram3DTrajectory(idInt);

        hexBadgeTitle.innerText = `第 ${hex.id} 卦【${hex.name}】3D 拓扑结构`;
        hexBadgeDesc.innerText = `六爻和 S=${sumVal} ➔ 模81归入第 ${rem81} 宫。初爻=${idInt}、上爻=${idInt*6} (点击可取消)`;
    }

    function toggleHexagramAnalysis(targetHexId, clickedPos = null) {
        if (currentAnalyzedHexId === targetHexId) {
            currentAnalyzedHexId = null;
            engine.clearHex3DGroup();
            document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("active-pos"));
            hexBadgeTitle.innerText = "卦象 3D 拓扑分析已取消";
            hexBadgeDesc.innerText = "请重新选择卦象或点击 81 宫单元格解析";
            hexDetailBox.innerHTML = `<div style="color:#cbd5e1; text-align:center;">分析已取消 (3D 浑天仪干干净净)</div>`;
            return;
        }

        currentAnalyzedHexId = targetHexId;
        hexSelect.value = targetHexId;
        renderHexagramDetail(targetHexId, clickedPos);
    }

    document.getElementById("btn-analyze-hex").addEventListener("click", () => {
        const val = parseInt(hexSelect.value, 10);
        toggleHexagramAnalysis(val);
    });

    const btnSpeed = document.getElementById("btn-speed-control");
    const speedVal = document.getElementById("speed-val");
    const speedLevels = [0.5, 1.0, 2.0, 4.0];
    let currentSpeedIdx = 1;

    if (btnSpeed) {
        btnSpeed.addEventListener("click", () => {
            currentSpeedIdx = (currentSpeedIdx + 1) % speedLevels.length;
            const level = speedLevels[currentSpeedIdx];
            engine.pulseSpeedMultiplier = level;
            speedVal.innerText = `${level}x`;
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

    toggleHexagramAnalysis(52); // 默认展示 52 卦艮为山
});
