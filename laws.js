/* ==========================================================================
   《易经数理秘笈》天象五大定律核心引擎 - (laws.js)
   特点：100% 同步全新 3D 日月极星全息浑天坐标体系 + 五大定律交互演示
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

class LawsVivid3DEngine {
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
        this.laws3DGroup = new THREE.Group();

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
        this.scene.add(this.laws3DGroup);
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

    clearLaws3DGroup() {
        while (this.laws3DGroup.children.length > 0) {
            const obj = this.laws3DGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
    }

    highlightBranchPos(branchIdx, colorHex = 0xff5252) {
        this.clearLaws3DGroup();
        const pos = getBranch3DPos(branchIdx, 6.0);
        const sphereGeom = new THREE.SphereGeometry(0.55, 32, 32);
        const sphereMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            emissive: colorHex,
            emissiveIntensity: 0.8,
            metalness: 0.9
        });
        const mesh = new THREE.Mesh(sphereGeom, sphereMat);
        mesh.position.copy(pos);
        this.laws3DGroup.add(mesh);
    }

    renderStar7Line() {
        this.clearLaws3DGroup();
        const points = [];
        for (let k = 1; k <= 12; k++) {
            const val = 7 * k;
            const rem12 = val % 12 === 0 ? 12 : val % 12;
            points.push(getBranch3DPos(rem12 - 1));
        }
        points.push(points[0]);

        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0xffe066, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.laws3DGroup.add(line);

        points.forEach(p => {
            const sGeom = new THREE.SphereGeometry(0.35, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xaa7c11 });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.laws3DGroup.add(sMesh);
        });
    }

    renderSanheTriangle(branchIndices, colorHex) {
        this.clearLaws3DGroup();
        const p1 = getBranch3DPos(branchIndices[0]);
        const p2 = getBranch3DPos(branchIndices[1]);
        const p3 = getBranch3DPos(branchIndices[2]);
        const points = [p1, p2, p3, p1];

        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.laws3DGroup.add(line);

        points.slice(0, 3).forEach(p => {
            const sGeom = new THREE.SphereGeometry(0.45, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.laws3DGroup.add(sMesh);
        });
    }

    renderYongjingAxis() {
        this.clearLaws3DGroup();
        const pSi = getBranch3DPos(5);
        const pHai = getBranch3DPos(11);

        const points = [pSi, pHai];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineDashedMaterial({ color: 0x4dabf7, dashSize: 0.3, gapSize: 0.1, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        line.computeLineDistances();
        this.laws3DGroup.add(line);

        [pSi, pHai].forEach((p, idx) => {
            const color = idx === 0 ? 0x4dabf7 : 0xff5252;
            const sGeom = new THREE.SphereGeometry(0.5, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: color, emissive: color });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.laws3DGroup.add(sMesh);
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
    const engine = new LawsVivid3DEngine("three-canvas-laws");

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
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    const lawBadgeTitle = document.getElementById("law-badge-title");
    const lawBadgeDesc = document.getElementById("law-badge-desc");

    const powerSlider = document.getElementById("power-slider");
    const powerValLabel = document.getElementById("power-val-label");
    const law1ResultBox = document.getElementById("law1-result-box");

    function updateLaw1(n) {
        const valStr = `10^${n} = ${Math.pow(10, n).toLocaleString()}`;
        if (powerValLabel) powerValLabel.innerText = valStr;

        const bigVal = BigInt(10) ** BigInt(n);
        const rem81Big = bigVal % 81n;
        const rem81 = Number(rem81Big === 0n ? 81n : rem81Big);
        const rem12 = rem81 % 12 === 0 ? 12 : rem81 % 12;
        const branch = EARTHLY_BRANCHES[rem12 - 1];

        if (law1ResultBox) {
            law1ResultBox.innerHTML = `
                <div style="font-size: 13px; font-weight: 700; color: #ff5252; margin-bottom: 4px;">
                    ☀️ 10^${n} 算式降维结果：
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; font-family: var(--font-times);">
                    • 原始数据: <strong>10^${n}</strong><br>
                    • 太乙 81 降维: 10^${n} % 81 = <strong>${rem81} 号宫</strong><br>
                    • 地支 12 位映射: ${rem81} % 12 = <strong>余 ${rem12}</strong><br>
                    • 对应地支与坐标: <span style="color:${branch.color}; font-weight:800;">${branch.name}位 · ${branch.system}</span>
                </div>
                <div style="margin-top: 6px; font-size: 11px; color: #ffe066; background: rgba(255,82,82,0.15); padding: 4px 8px; border-radius: 4px;">
                    必杀结论：余数 ${rem12} 属于【${branch.name}】位，100% 严格恒落在<strong>赤道(天)坐标系</strong>！
                </div>
            `;
        }

        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            if (p === rem81) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });

        engine.highlightBranchPos(branch.idx, 0xff5252);
        if (lawBadgeTitle) lawBadgeTitle.innerText = `☀️ 10^${n} 太阳赤道守恒律`;
        if (lawBadgeDesc) lawBadgeDesc.innerText = `余数 ${rem12} 对应【${branch.name}】位，属于赤道(天)正位！`;
    }

    if (powerSlider) {
        powerSlider.addEventListener("input", (e) => {
            updateLaw1(parseInt(e.target.value, 10));
        });
    }

    const btnDemoStar7 = document.getElementById("btn-demo-star7");
    let isStar7Active = false;

    if (btnDemoStar7) {
        btnDemoStar7.addEventListener("click", () => {
            isStar7Active = !isStar7Active;
            if (isStar7Active) {
                btnDemoStar7.classList.add("active");
                engine.renderStar7Line();

                document.querySelectorAll(".taiyi-81-cell").forEach(cell => cell.classList.add("active-pos"));
                if (lawBadgeTitle) lawBadgeTitle.innerText = "✨ 数 7 · 北斗七星芒星律 3D 轨迹";
                if (lawBadgeDesc) lawBadgeDesc.innerText = "按 7 × k 顺次环绕 12 地支，赤黄白三道连成 12 芒星阵";
            } else {
                btnDemoStar7.classList.remove("active");
                engine.clearLaws3DGroup();
                document.querySelectorAll(".taiyi-81-cell").forEach(cell => cell.classList.remove("active-pos"));
                updateLaw1(powerSlider ? parseInt(powerSlider.value, 10) : 3);
            }
        });
    }

    const splitSlider = document.getElementById("split-slider");
    const splitValLabel = document.getElementById("split-val-label");
    const law3ResultBox = document.getElementById("law3-result-box");
    const btnDemoLaw3 = document.getElementById("btn-demo-law3");

    const splitValues = [
        { parts: 1, deg: "360°", expr: "3 + 6 + 0", sum: "9" },
        { parts: 2, deg: "180°", expr: "1 + 8 + 0", sum: "9" },
        { parts: 4, deg: "90°",  expr: "9 + 0",     sum: "9" },
        { parts: 8, deg: "45°",  expr: "4 + 5",     sum: "9" },
        { parts: 16, deg: "22.5°", expr: "2 + 2 + 5", sum: "9" },
        { parts: 32, deg: "11.25°", expr: "1 + 1 + 2 + 5", sum: "9" },
        { parts: 64, deg: "5.625°", expr: "5 + 6 + 2 + 5 = 18 ➔ 1 + 8", sum: "9" }
    ];

    function updateLaw3(idx) {
        const item = splitValues[idx] || splitValues[0];
        if (splitValLabel) splitValLabel.innerText = `${item.parts} 份 (${item.deg})`;

        if (law3ResultBox) {
            law3ResultBox.innerHTML = `
                <div style="font-size: 13px; font-weight: 700; color: #ffe066; margin-bottom: 4px;">
                    🌀 ${item.deg} 众和归九演算：
                </div>
                <div style="font-size: 12px; color: #cbd5e1; font-family: var(--font-times);">
                    • 数值算式: ${item.expr}<br>
                    • 众和极数: <strong style="color:#ffe066; font-size:14px;">${item.sum}</strong> (归于离九宫)
                </div>
            `;
        }

        const targetNinePositions = [9, 18, 27, 36, 45, 54, 63, 72, 81];
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            if (targetNinePositions.includes(p)) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });

        if (lawBadgeTitle) lawBadgeTitle.innerText = `🌀 周天 ${item.deg} 切割归九律`;
        if (lawBadgeDesc) lawBadgeDesc.innerText = `数位众和数 ${item.expr} 恒无条件收敛归于 9！`;
    }

    if (splitSlider) {
        splitSlider.addEventListener("input", (e) => {
            updateLaw3(parseInt(e.target.value, 10));
        });
    }

    if (btnDemoLaw3) {
        btnDemoLaw3.addEventListener("click", () => {
            const currentIdx = splitSlider ? parseInt(splitSlider.value, 10) : 0;
            updateLaw3(currentIdx);
        });
    }

    const SANHE_MAP = {
        wood:  { name: "亥卯未 (木局)", color: "#40c057", branches: [11, 3, 7] },
        fire:  { name: "寅午戌 (火局)", color: "#ff5252", branches: [2, 6, 10] },
        metal: { name: "巳酉丑 (金局)", color: "#dee2e6", branches: [5, 9, 1] },
        water: { name: "申子辰 (水局)", color: "#4dabf7", branches: [8, 0, 4] }
    };

    document.querySelectorAll(".sanhe-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".sanhe-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            const key = this.dataset.sanhe;
            const data = SANHE_MAP[key];
            if (!data) return;

            engine.renderSanheTriangle(data.branches, parseInt(data.color.replace('#', '0x'), 16));

            document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
                const p = parseInt(cell.dataset.pos, 10);
                const rem12 = p % 12 === 0 ? 12 : p % 12;
                if (data.branches.includes(rem12 - 1)) {
                    cell.classList.add("active-pos");
                } else {
                    cell.classList.remove("active-pos");
                }
            });

            if (lawBadgeTitle) lawBadgeTitle.innerText = `🔺 地支三合局 · ${data.name}`;
            if (lawBadgeDesc) lawBadgeDesc.innerText = `在 3D 浑天坐标球上构建稳固的 ${data.name} 能量三角形`;
        });
    });

    const btnDemoYongjing = document.getElementById("btn-demo-yongjing");
    let isYongjingActive = false;

    if (btnDemoYongjing) {
        btnDemoYongjing.addEventListener("click", () => {
            isYongjingActive = !isYongjingActive;
            if (isYongjingActive) {
                btnDemoYongjing.classList.add("active");
                engine.renderYongjingAxis();

                const yongjingPos = [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78];
                document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
                    const p = parseInt(cell.dataset.pos, 10);
                    if (yongjingPos.includes(p)) {
                        cell.classList.add("active-pos");
                    } else {
                        cell.classList.remove("active-pos");
                    }
                });

                if (lawBadgeTitle) lawBadgeTitle.innerText = "🚪 永静数 6 天地门轴线";
                if (lawBadgeDesc) lawBadgeDesc.innerText = "6 × 奇数落巳位 (地户)，6 × 偶数落亥位 (天门)，贯穿天地门轴线";
            } else {
                btnDemoYongjing.classList.remove("active");
                engine.clearLaws3DGroup();
                document.querySelectorAll(".taiyi-81-cell").forEach(cell => cell.classList.remove("active-pos"));
                updateLaw1(powerSlider ? parseInt(powerSlider.value, 10) : 3);
            }
        });
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

    updateLaw1(3);
});
