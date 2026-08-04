/* ==========================================================================
   《易经数理秘笈》用矩法·一矩至十二矩运动规律 - 交互增强引擎 (ju81.js)
   特点：纯粹数理逻辑 3D 浑天坐标 + 四大原书《用矩法》可交互模块 (滑块/按钮/实效演算)
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

const TAIYI_81_SUB_LABELS = {
    31: "(四₄)", 76: "(四₉)", 13: "(四₂)", 22: "(四₃)", 40: "(四₅)", 58: "(四₇)", 67: "(四₈)", 4: "(四₁)", 49: "(四₆)",
    36: "(九₄)", 81: "(九₉)", 18: "(九₂)", 27: "(九₃)", 45: "(九₅)", 63: "(九₇)", 72: "(九₈)", 9: "(九₁)", 54: "(九₆)",
    29: "(二₄)", 74: "(二₉)", 11: "(二₂)", 20: "(二₃)", 38: "(二₅)", 56: "(二₇)", 65: "(二₈)", 2: "(二₁)", 47: "(二₆)",
    30: "(三₄)", 75: "(三₉)", 12: "(三₂)", 21: "(三₃)", 39: "(三₅)", 57: "(三₇)", 66: "(三₈)", 3: "(三₁)", 48: "(三₆)",
    32: "(五₄)", 77: "(五₉)", 14: "(五₂)", 23: "(五₃)", 41: "(五₅)", 59: "(五₇)", 68: "(五₈)", 5: "(五₁)", 50: "(五₆)",
    34: "(七₄)", 79: "(七₉)", 16: "(七₂)", 25: "(七₃)", 43: "(七₅)", 61: "(七₇)", 70: "(七₈)", 7: "(七₁)", 52: "(七₆)",
    35: "(八₄)", 80: "(八₉)", 17: "(八₂)", 26: "(八₃)", 44: "(八₅)", 62: "(八₇)", 71: "(八₈)", 8: "(八₁)", 53: "(八₆)",
    28: "(一₄)", 73: "(一₉)", 10: "(一₂)", 19: "(一₃)", 37: "(一₅)", 55: "(一₇)", 64: "(一₈)", 1: "(一₁)", 46: "(一₆)",
    33: "(六₄)", 78: "(六₉)", 15: "(六₂)", 24: "(六₃)", 42: "(六₅)", 60: "(六₇)", 69: "(六₈)", 6: "(六₁)", 51: "(六₆)"
};


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

class Ju81Interactive3DEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

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
        this.juSpiralGroup = new THREE.Group();

        this.autoRotate = true;

        this.initScene();
        this.createArmillaryRings();
        this.createCelestialGridAndPoles();
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
        this.scene.add(this.juSpiralGroup);
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

    clearJuSpiralGroup() {
        while (this.juSpiralGroup.children.length > 0) {
            const obj = this.juSpiralGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
    }

    renderJu3DSpiral(juCount = 1) {
        this.clearJuSpiralGroup();

        const points = [];
        const totalSteps = juCount * 9;

        for (let i = 0; i <= totalSteps; i++) {
            const angle = i * 0.4;
            const radius = 6.0;
            const z = (i / totalSteps) * 6.0 - 3.0;

            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeom = new THREE.TubeGeometry(curve, 100, 0.1, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
            color: 0xffe066,
            emissive: 0xaa7c11,
            metalness: 0.9,
            transparent: true,
            opacity: 0.85
        });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        this.juSpiralGroup.add(tubeMesh);

        points.forEach((p, idx) => {
            if (idx % 9 === 0) {
                const sGeom = new THREE.SphereGeometry(0.38, 16, 16);
                const sMat = new THREE.MeshStandardMaterial({ color: 0xff5252, emissive: 0xff5252 });
                const sMesh = new THREE.Mesh(sGeom, sMat);
                sMesh.position.copy(p);
                this.juSpiralGroup.add(sMesh);
            }
        });
    }

    renderFourCornersSquare(highlightIdx = null) {
        this.clearJuSpiralGroup();
        const cornerIndices = [8, 5, 2, 11, 8]; // 申(8), 巳(5), 寅(2), 亥(11)
        const points = cornerIndices.map(idx => getBranch3DPos(idx));

        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0x4dabf7, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.juSpiralGroup.add(line);

        points.slice(0, 4).forEach((p, idx) => {
            const isTarget = (highlightIdx !== null && cornerIndices[idx] === highlightIdx);
            const size = isTarget ? 0.65 : 0.45;
            const color = isTarget ? 0xffe066 : 0x4dabf7;

            const sGeom = new THREE.SphereGeometry(size, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: color, emissive: color, emissiveIntensity: 0.8 });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.juSpiralGroup.add(sMesh);
        });
    }

    renderPolygonFitting(sides = 60) {
        this.clearJuSpiralGroup();
        const points = [];
        const radius = 6.0;

        for (let i = 0; i <= sides; i++) {
            const angle = (i / sides) * Math.PI * 2;
            points.push(new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0));
        }

        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0x40c057, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.juSpiralGroup.add(line);

        points.slice(0, sides).forEach((p, idx) => {
            if (idx % Math.max(1, Math.floor(sides / 12)) === 0) {
                const sGeom = new THREE.SphereGeometry(0.3, 16, 16);
                const sMat = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffe066 });
                const sMesh = new THREE.Mesh(sGeom, sMat);
                sMesh.position.copy(p);
                this.juSpiralGroup.add(sMesh);
            }
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.002;
        }

        if (this.controls) this.controls.update();
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new Ju81Interactive3DEngine("three-canvas-ju");

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
                const subTag = (typeof TAIYI_81_SUB_LABELS !== "undefined" && TAIYI_81_SUB_LABELS[num]) ? TAIYI_81_SUB_LABELS[num] : "";
                cell.innerHTML = `<div class="cell-num">${num}</div><div class="cell-sub">${subTag}</div>`;
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    // DOM 元素绑定与防御判断
    const juModuleSelect = document.getElementById("ju-module-select");
    const moduleJu12 = document.getElementById("module-ju-12");
    const moduleJuCorners = document.getElementById("module-ju-corners");
    const moduleJuBasket = document.getElementById("module-ju-basket");
    const moduleJuSquare = document.getElementById("module-ju-square");

    const juDetailBox = document.getElementById("ju-detail-box");
    const cornerDetailBox = document.getElementById("corner-detail-box");
    const basketDetailBox = document.getElementById("basket-detail-box");
    const polygonDetailBox = document.getElementById("polygon-detail-box");

    const badgeTitle = document.getElementById("ju-badge-title");
    const badgeDesc = document.getElementById("ju-badge-desc");

    // 控件 1：矩数 Slider & Buttons
    const juSlider = document.getElementById("ju-slider");
    const juSliderLabel = document.getElementById("ju-slider-val-label");

    // 控件 3：Basket Slider
    const basketSlider = document.getElementById("basket-slider");
    const basketSliderLabel = document.getElementById("basket-slider-val-label");

    // 控件 4：Polygon Slider
    const polygonSlider = document.getElementById("polygon-slider");
    const polygonSliderLabel = document.getElementById("polygon-slider-val-label");

    const JU_METADATA = {
        1:  { hex: "81九太乙矩", level: "基本方阵单元", desc: "1 矩为九九八十一基本单元。包含 9 宫 81 种全象，是天体气数降维的方针定域基石。" },
        2:  { hex: "18九2蛊卦", level: "巳亥地户天门交会", desc: "2 矩 162 = 18 × 9。经过巳位与亥位成 180° 对冲，形成天地阴阳交感的前阶路途。" },
        3:  { hex: "27九3颐卦", level: "白道坐标系主轴", desc: "3 矩 243 = 27 × 9。位于第 27 行颐卦（申位），是白道坐标系三角定畴的核心主轴。" },
        4:  { hex: "36九4明夷卦", level: "下际天周 (324 + 36 = 360°)", desc: "4 矩 324 = 36 × 9。下天际线，结合子午天门地户 36 气数成 360° 周天全功大圆满！" },
        5:  { hex: "45九萃卦", level: "申位中数主轴", desc: "5 矩 405 = 45 × 9。位于第 45 行萃卦（申位），承载赤道中数 4 与 81 矩结合！" },
        6:  { hex: "486 (54九6归妹)", level: "巳位 90° 质变交点", desc: "6 矩 486 = 54 × 9。位于地户 54 行归妹卦，贯通申寅巳亥四白主轴！" },
        7:  { hex: "567 (63九既济)", level: "寅位奇数演进", desc: "7 矩 567 = 63 × 9。位于第 63 行既济卦（寅位），统领奇数演进！" },
        8:  { hex: "648 (54九6归妹)", level: "中际天周 (天地大义)", desc: "8 矩 648 = 54 × 12。中天际线，归妹卦已位地户，归妹天地之大义也！" },
        9:  { hex: "729 (81九大矩)", level: "申位白道顶峰", desc: "9 矩 729 = 81 × 9。到达白道申位顶峰，9 宫全满归一！" },
        10: { hex: "810 (90九质变)", level: "巳位 90° 终极质变", desc: "10 矩 810 = 90 × 9。位于巳位地户，90° 数值产生终极质变！" },
        11: { hex: "891 (99九高阶)", level: "寅位高阶奇数", desc: "11 矩 891 = 99 × 9。寅位高阶演进，逼近上际周天！" },
        12: { hex: "972 (81九9大矩)", level: "上际天周 (12矩大圆满)", desc: "12 矩 972 = 81 × 12。上天际最高层，12 方位与三元周天 12 矩达成终极全功！" }
    };

    function highlightMatrixPositions(posList) {
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            if (posList.includes(p)) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });
    }

    function updateJu12Interactive(k) {
        const juVal = k * 81;
        const rem81 = juVal % 81 === 0 ? 81 : juVal % 81;
        const rem12 = juVal % 12 === 0 ? 12 : juVal % 12;
        const branch = EARTHLY_BRANCHES[rem12 - 1];
        const meta = JU_METADATA[k] || JU_METADATA[1];

        if (juSlider) juSlider.value = k;
        if (juSliderLabel) juSliderLabel.innerText = `${k} 矩 (${juVal} 气数)`;

        document.querySelectorAll(".ju-btn").forEach(b => {
            b.classList.toggle("active", parseInt(b.dataset.ju, 10) === k);
        });

        if (juDetailBox) {
            juDetailBox.innerHTML = `
                <div style="font-size: 14px; font-weight: 800; color: #ffe066; margin-bottom: 4px;">
                    📐 ${k} 矩 动态演算分析
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; font-family: var(--font-times);">
                    • 气数算式: 81 × ${k} = <strong>${juVal}</strong><br>
                    • 太乙 81 降维: ${juVal} % 81 = <strong>${rem81} 号宫</strong><br>
                    • 地支 12 位: ${juVal} % 12 = <span style="color:${branch.color}; font-weight:800;">余 ${rem12} (${branch.name}位 · ${branch.system.split('(')[0]})</span><br>
                    • 对应卦象: <span style="color:#ff5252; font-weight:700;">${meta.hex}</span> (${meta.level})
                </div>
                <div style="margin-top: 6px; font-size: 11px; color: #ffffff; background: rgba(212,175,55,0.18); border: 1px solid rgba(255,224,102,0.4); padding: 6px 8px; border-radius: 6px;">
                    原著奥理：${meta.desc}
                </div>
            `;
        }

        highlightMatrixPositions([rem81]);
        engine.renderJu3DSpiral(k);

        if (badgeTitle) badgeTitle.innerText = `${k} 矩 (81 × ${k} = ${juVal}) 3D 动态螺旋拓扑`;
        if (badgeDesc) badgeDesc.innerText = `包含 ${k} 个 81 矩单元，在天体空间形成 ${k * 9} 步 3D 螺旋展开轨迹`;
    }

    const CORNER_DATA = {
        shen: { name: "申位 (水局 · 1, 5, 9 矩)", color: "#4dabf7", branches: [8], numbers: [9, 45, 81], desc: "申为白道开局主轴，统领 1 矩(81)、5 矩(405)、9 矩(729)及 9, 45, 81 三大核心宫位！" },
        yin:  { name: "寅位 (木局 · 3, 7, 11 矩)", color: "#40c057", branches: [2], numbers: [27, 63], desc: "寅位统领奇数演进（寅顺申逆），包含 3 矩(243颐卦)、7 矩(567既济卦)及 11 矩(891)！" },
        si:   { name: "巳位 (火局 · 2, 6, 10 矩)", color: "#ffe066", branches: [5], numbers: [18, 54, 90], desc: "巳位为地户 90° 质变交点，统领 2 矩(162蛊卦)、6 矩(486归妹卦)与 10 矩(810)！" },
        hai:  { name: "亥位 (金局 · 4, 8, 12 矩)", color: "#ff5252", branches: [11], numbers: [36, 72, 81], desc: "亥位为天门三际周天归宿点，统领 4 矩(324下际)、8 矩(648中际)与 12 矩(972上际)！" }
    };

    function updateCornerInteractive(key) {
        const data = CORNER_DATA[key] || CORNER_DATA.shen;

        document.querySelectorAll(".corner-btn").forEach(b => {
            b.classList.toggle("active", b.dataset.corner === key);
        });

        if (cornerDetailBox) {
            cornerDetailBox.innerHTML = `
                <div style="font-size: 14px; font-weight: 800; color: ${data.color}; margin-bottom: 4px;">
                    📍 ${data.name} 剖析
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
                    • 关联太乙 81 宫: <strong>${data.numbers.join(" 号宫, ")} 号宫</strong><br>
                    • 3D 天球坐标: <span style="color:${data.color}; font-weight:800;">地支【${EARTHLY_BRANCHES[data.branches[0]].name}】位</span>
                </div>
                <div style="margin-top: 6px; font-size: 11px; color: #ffe066; background: rgba(77,171,247,0.15); padding: 6px 8px; border-radius: 6px;">
                    奥理：${data.desc}
                </div>
            `;
        }

        highlightMatrixPositions(data.numbers);
        engine.renderFourCornersSquare(data.branches[0]);

        if (badgeTitle) badgeTitle.innerText = `${data.name} 3D 拓扑视角`;
        if (badgeDesc) badgeDesc.innerText = `在 3D 天球上高亮【${EARTHLY_BRANCHES[data.branches[0]].name}】方位并绘制四白方阵框`;
    }

    function updateBasketInteractive(m) {
        const subtractVal = 60 * m;
        const remVal = 324 - subtractVal;
        const rem81 = remVal % 81 === 0 ? 81 : remVal % 81;

        if (basketSlider) basketSlider.value = m;
        if (basketSliderLabel) basketSliderLabel.innerText = `${m} 个节卦 (${subtractVal}°)`;

        const isFuHexagram = (m === 5); // 324 - 300 = 24 (24 六复卦)

        if (basketDetailBox) {
            basketDetailBox.innerHTML = `
                <div style="font-size: 13.5px; font-weight: 800; color: ${isFuHexagram ? '#40c057' : '#ff5252'}; margin-bottom: 4px;">
                    🧺 扣除 ${m} 节 (${subtractVal}°) 演算结果: 324 - ${subtractVal} = <strong>${remVal}</strong>
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; font-family: var(--font-times);">
                    • 算式: 324 - 60 × ${m} = <strong>${remVal}</strong><br>
                    • 太乙 81 降维: ${remVal} % 81 = <strong>${rem81} 号宫</strong><br>
                    ${isFuHexagram ? '<strong style="color:#ffe066; font-size:13px;">🌟 触发奇迹结论：第 24 号宫即【24 六复卦】（“复其见天地之心乎”！）</strong>' : `• 剩余气数: ${remVal}`}
                </div>
            `;
        }

        highlightMatrixPositions([rem81]);
        engine.clearJuSpiralGroup();

        if (badgeTitle) badgeTitle.innerText = `天门 324 扣除 ${m} 节 (${subtractVal}°) 演算`;
        if (badgeDesc) badgeDesc.innerText = isFuHexagram ? "324 - 300 = 24，惊现天地之心 24 六复卦！" : `扣除 ${subtractVal}° 节律后余 ${remVal} 气数`;
    }

    function updatePolygonInteractive(sides) {
        if (polygonSlider) polygonSlider.value = sides;
        if (polygonSliderLabel) polygonSliderLabel.innerText = `${sides} 边形 (${sides === 60 ? '花甲子节律' : (sides === 4 ? '正方形/矩' : '多边形逼近')})`;

        if (polygonDetailBox) {
            polygonDetailBox.innerHTML = `
                <div style="font-size: 13.5px; font-weight: 800; color: #ffe066; margin-bottom: 4px;">
                    ☯ ${sides} 边形化圆逼近演算
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5;">
                    • 细分边数: <strong>${sides} 边</strong><br>
                    • 单角弧度: ${(360 / sides).toFixed(2)}°<br>
                    • 逼近圆周率比例: ${(Math.sin(Math.PI / sides) * sides / Math.PI).toFixed(5)} (完全收敛于圆)
                </div>
            `;
        }

        engine.renderPolygonFitting(sides);
        if (badgeTitle) badgeTitle.innerText = `“圆出于方，规出于矩” ${sides} 边形拟合拓扑`;
        if (badgeDesc) badgeDesc.innerText = `3D 天球上展示从 4 边形(方矩)到 ${sides} 边形逼近 360° 周天(圆规)的过程`;
    }

    function switchJuModule(modKey) {
        [moduleJu12, moduleJuCorners, moduleJuBasket, moduleJuSquare].forEach(el => {
            if (el) el.style.display = "none";
        });

        if (modKey === "12ju") {
            if (moduleJu12) moduleJu12.style.display = "block";
            updateJu12Interactive(juSlider ? parseInt(juSlider.value, 10) : 1);
        } else if (modKey === "four_corners") {
            if (moduleJuCorners) moduleJuCorners.style.display = "block";
            updateCornerInteractive("shen");
        } else if (modKey === "basket") {
            if (moduleJuBasket) moduleJuBasket.style.display = "block";
            updateBasketInteractive(basketSlider ? parseInt(basketSlider.value, 10) : 5);
        } else if (modKey === "square_circle") {
            if (moduleJuSquare) moduleJuSquare.style.display = "block";
            updatePolygonInteractive(polygonSlider ? parseInt(polygonSlider.value, 10) : 60);
        }
    }

    if (juModuleSelect) {
        juModuleSelect.addEventListener("change", (e) => {
            switchJuModule(e.target.value);
        });
    }

    // 控件事件监听绑定
    if (juSlider) {
        juSlider.addEventListener("input", (e) => {
            updateJu12Interactive(parseInt(e.target.value, 10));
        });
    }

    document.querySelectorAll(".ju-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            updateJu12Interactive(parseInt(this.dataset.ju, 10));
        });
    });

    document.querySelectorAll(".corner-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            updateCornerInteractive(this.dataset.corner);
        });
    });

    if (basketSlider) {
        basketSlider.addEventListener("input", (e) => {
            updateBasketInteractive(parseInt(e.target.value, 10));
        });
    }

    if (polygonSlider) {
        polygonSlider.addEventListener("input", (e) => {
            updatePolygonInteractive(parseInt(e.target.value, 10));
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

    const btnEq = document.getElementById("btn-toggle-equator");
    if (btnEq) {
        btnEq.addEventListener("click", function() {
            this.classList.toggle("active");
            if (engine.equatorGroup) engine.equatorGroup.visible = this.classList.contains("active");
        });
    }
    const btnEc = document.getElementById("btn-toggle-ecliptic");
    if (btnEc) {
        btnEc.addEventListener("click", function() {
            this.classList.toggle("active");
            if (engine.eclipticGroup) engine.eclipticGroup.visible = this.classList.contains("active");
        });
    }
    const btnLu = document.getElementById("btn-toggle-lunar");
    if (btnLu) {
        btnLu.addEventListener("click", function() {
            this.classList.toggle("active");
            if (engine.lunarGroup) engine.lunarGroup.visible = this.classList.contains("active");
        });
    }
    const btnReset = document.getElementById("btn-reset-view");
    if (btnReset) {
        btnReset.addEventListener("click", () => {
            engine.adjustCameraFit();
        });
    }
    const btnRot = document.getElementById("btn-toggle-autorotate");
    if (btnRot) {
        btnRot.addEventListener("click", function() {
            this.classList.toggle("active");
            engine.autoRotate = this.classList.contains("active");
        });
    }

    switchJuModule("12ju");
});

/* 全局屏幕点击金彩粒子波纹火花特效 (Click Visual Spark Listener) */
document.addEventListener("click", (e) => {
    const spark = document.createElement("div");
    spark.className = "click-spark-efx";
    spark.style.left = `${e.clientX}px`;
    spark.style.top = `${e.clientY}px`;
    document.body.appendChild(spark);
    setTimeout(() => {
        if (spark.parentNode) {
            spark.parentNode.removeChild(spark);
        }
    }, 450);
});
