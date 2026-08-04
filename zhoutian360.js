/* ==========================================================================
   《易经数理秘笈》周天 360° 气数全景解构馆 - (zhoutian360.js)
   特点：包含原书 P315-320《九宫纪周天(360°)气数一览大表》+ 单格/整行弹性晃动震荡与高亮动画 + 全页三向联动
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
    29: "(二₄)", 74: "(二₉)", 11: "(二₂)", 20: "(二₃)", 38: "(二₅)", 56: "(二₇)", 65: "(二∯)", 2: "(二₁)", 47: "(二₆)",
    30: "(三₄)", 75: "(三₉)", 12: "(三₂)", 21: "(三₃)", 39: "(三₅)", 57: "(三₇)", 66: "(三₈)", 3: "(三₁)", 48: "(三₆)",
    32: "(五₄)", 77: "(五₉)", 14: "(五₂)", 23: "(五₃)", 41: "(五₅)", 59: "(五₇)", 68: "(五₈)", 5: "(五₁)", 50: "(五₆)",
    34: "(七₄)", 79: "(七₉)", 16: "(七₂)", 25: "(七₃)", 43: "(七₅)", 61: "(七₇)", 70: "(七₈)", 7: "(七₁)", 52: "(七₆)",
    35: "(八₄)", 80: "(八₉)", 17: "(八₂)", 26: "(八₃)", 44: "(八₅)", 62: "(八₇)", 71: "(八₈)", 8: "(八₁)", 53: "(八₆)",
    28: "(一₄)", 73: "(一₉)", 10: "(一₂)", 19: "(一₃)", 37: "(一₅)", 55: "(一₇)", 64: "(一₈)", 1: "(一₁)", 46: "(一₆)",
    33: "(六₄)", 78: "(六₉)", 15: "(六₂)", 24: "(六₃)", 42: "(六₅)", 60: "(六₇)", 69: "(六₈)", 6: "(六₁)", 51: "(六₆)"
};

// 修复 typo
TAIYI_81_SUB_LABELS[65] = "(二₈)";

const ZHOUTIAN_360_PALACES_INFO = {
    1: { name: "一宫表 (坎一水)", degStep: 90,  baseSeq: [10, 100, 190, 280, 370, 460, 550, 640, 730], desc: "原书 P315 【一宫表】：自 2 行 10 纪起，每级递进 90九₁ (90°)，纪得周天一象限 (90°)。" },
    2: { name: "二宫表 (坤二土)", degStep: 180, baseSeq: [40, 220, 400, 580, 760, 940, 1120, 1300, 1480], desc: "原书 P315 【二宫表】：自 3 行 40 纪起，每级递进 180九₂ (180°)，纪得阴阳两判天地定位大圆直径。" },
    3: { name: "三宫表 (震三木)", degStep: 270, baseSeq: [90, 360, 630, 900, 1170, 1440, 1710, 1980, 2250], desc: "原书 P315 【三宫表】：自 4 行 90 纪起，每级递进 270九₃ (270°)，纪得 27 颐卦全养。" },
    4: { name: "四宫表 (巽四木)", degStep: 360, baseSeq: [160, 520, 880, 1240, 1600, 1960, 2320, 2680, 3040], desc: "原书 P315 【四宫表】：自 5 行 160 纪起，每级递进 360九₄ (周天 360°)，完全包揽周天大圆度数！" },
    5: { name: "五宫表 (中五土)", degStep: 450, baseSeq: [250, 700, 1150, 1600, 2050, 2500, 2950, 3400, 3850], desc: "原书 P315 【五宫表】：自 6 行 250 纪起，每级递进 450九₅ (450°)，黄赤相交皇极立极。" },
    6: { name: "六宫表 (乾六金)", degStep: 540, baseSeq: [360, 900, 1440, 1980, 2520, 3060, 3600, 4140, 4680], desc: "原书 P315 【六宫表】：自 7 行 360 纪起，每级递进 540九₆ (540°)，归妹成数刚健生生。" },
    7: { name: "七宫表 (兑七金)", degStep: 630, baseSeq: [490, 1120, 1750, 2380, 3010, 3640, 4270, 4900, 5530], desc: "原书 P315 【七宫表】：自 8 行 490 纪起，每级递进 630九₇ (630°)，既济亨小游行九畴。" },
    8: { name: "八宫表 (艮八土)", degStep: 720, baseSeq: [640, 1360, 2080, 2800, 3520, 4240, 4960, 5680, 6400], desc: "原书 P315 【八宫表】：自 9 行 640 纪起，每级递进 720九₈ (720°)，双周天大归结。" },
    9: { name: "九宫表 (离九火)", degStep: 810, baseSeq: [810, 1620, 2430, 3240, 4050, 4860, 5670, 6480, 7290], desc: "原书 P315 【九宫表】：九宫方数 81 矩总枢，每级递进 810九₉/900°，归宗太虚象数大源。" }
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

class ZhoutianPureMath3DEngine {
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
        this.trajectoryGroup = new THREE.Group();

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
        this.scene.add(this.trajectoryGroup);
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

    clearTrajectoryGroup() {
        while (this.trajectoryGroup.children.length > 0) {
            const obj = this.trajectoryGroup.children[0];
            this.trajectoryGroup.remove(obj);
        }
    }

    render4XiangSquare() {
        this.clearTrajectoryGroup();
        const branchIndices = [5, 6, 9, 11]; // 巳(5)、午(6)、酉(9)、亥(11)
        const pts = branchIndices.map(i => getBranch3DPos(i));
        pts.push(pts[0]);

        const lineGeom = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffe066, linewidth: 2 });
        const line = new THREE.Line(lineGeom, lineMat);
        this.trajectoryGroup.add(line);
    }

    render60JieHexagon() {
        this.clearTrajectoryGroup();
        const branchIndices = [0, 2, 4, 6, 8, 10]; // 子, 寅, 辰, 午, 申, 戌
        const pts = branchIndices.map(i => getBranch3DPos(i));
        pts.push(pts[0]);

        const lineGeom = new THREE.BufferGeometry().setFromPoints(pts);
        const lineMat = new THREE.LineDashedMaterial({ color: 0x40c057, dashSize: 0.3, gapSize: 0.15, linewidth: 2 });
        const line = new THREE.Line(lineGeom, lineMat);
        line.computeLineDistances();
        this.trajectoryGroup.add(line);
    }

    highlightSingleBranch(bIdx) {
        this.clearTrajectoryGroup();
        const pos = getBranch3DPos(bIdx);

        const pulseGeom = new THREE.SphereGeometry(0.5, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe066, emissiveIntensity: 1.8 });
        const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        pulseMesh.position.copy(pos);
        this.trajectoryGroup.add(pulseMesh);
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
    const engine = new ZhoutianPureMath3DEngine("three-canvas-zhoutian360");

    const matrixContainer = document.getElementById("taiyi-81-matrix");
    const badgeTitle = document.getElementById("zhoutian-badge-title");
    const badgeDesc = document.getElementById("zhoutian-badge-desc");
    const tabBtns = document.querySelectorAll(".zhoutian-tab-btn");
    const contentPanels = document.querySelectorAll(".zhoutian-content-panel");
    const ztBanner = document.getElementById("zt-banner");

    // 渲染太乙 81 宫阵图 (双行角标位号匹配原图)
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
                const subTag = TAIYI_81_SUB_LABELS[num] || "";
                cell.innerHTML = `<div class="cell-num">${num}</div><div class="cell-sub">${subTag}</div>`;
                cell.addEventListener("click", () => {
                    const isAlreadyActive = cell.classList.contains("active-pos");
                    document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("active-pos"));
                    
                    if (!isAlreadyActive) {
                        cell.classList.add("active-pos");
                        const rem12 = num % 12 === 0 ? 12 : num % 12;
                        engine.highlightSingleBranch(rem12 - 1);
                    }
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    // 渲染原书《九宫纪周天(360°)气数一览大表》 (支持行/单格弹性晃动与高亮动画 + Toggle Off)
    function renderZhoutian360MasterTable(palaceKey = "1") {
        const tableHead = document.getElementById("zt-table-head");
        const tableBody = document.getElementById("zt-table-body");
        const tableTitle = document.getElementById("zt-table-title");

        if (!tableHead || !tableBody) return;
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        const pNum = parseInt(palaceKey, 10) || 1;
        const pInfo = ZHOUTIAN_360_PALACES_INFO[pNum] || ZHOUTIAN_360_PALACES_INFO[1];

        if (tableTitle) {
            tableTitle.innerText = `📜 原书【${pInfo.name}】9x9 周天 360° 气数大表 (步长 +${pInfo.degStep}°)`;
        }

        if (ztBanner) {
            ztBanner.innerHTML = `
                <div style="font-size:13px; font-weight:800; color:#ffe066;">
                    📜 原著【${pInfo.name}】周天 360° 气数解构
                </div>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px; line-height:1.4;">
                    ${pInfo.desc} (支持点击单格与全行高亮，弹性晃动与 3D/81 宫三向联动)
                </div>
            `;
        }

        // 表头
        const trHead = document.createElement("tr");
        trHead.innerHTML = `
            <th style="color:#ffe066;">基数 N</th>
            <th>1级</th>
            <th>2级</th>
            <th>3级</th>
            <th>4级</th>
            <th>5级</th>
            <th>6级</th>
            <th>7级</th>
            <th>8级</th>
            <th>9级</th>
            <th style="color:#ff5252;">周天度数 (N×9)</th>
            <th>模360°</th>
            <th>地支</th>
        `;
        tableHead.appendChild(trHead);

        pInfo.baseSeq.forEach((baseNum) => {
            const tr = document.createElement("tr");
            tr.className = "interactive-row";
            tr.dataset.num = baseNum;

            let cellsHtml = `<td class="interactive-cell base-num-cell" data-val="${baseNum}" style="font-weight:800; color:#ffe066; font-family:var(--font-times);">${baseNum}</td>`;

            for (let k = 1; k <= 9; k++) {
                const prod = baseNum + (k - 1) * pInfo.degStep;
                cellsHtml += `<td class="interactive-cell prod-cell" data-base="${baseNum}" data-k="${k}" data-val="${prod}" style="font-family:var(--font-times);">${prod}</td>`;
            }

            const totalDeg = baseNum + 8 * pInfo.degStep;
            const degMod = totalDeg % 360;
            const rem12 = totalDeg % 12 === 0 ? 12 : totalDeg % 12;
            const branch = EARTHLY_BRANCHES[rem12 - 1];

            cellsHtml += `<td class="interactive-cell carry-cell" data-val="${totalDeg}" style="font-weight:800; color:#ff5252; font-family:var(--font-times);">${totalDeg}°</td>`;
            cellsHtml += `<td style="font-family:var(--font-times); color:#ffe066;">${degMod}°</td>`;
            cellsHtml += `<td style="color:${branch.color}; font-weight:800;">${branch.name}位</td>`;

            tr.innerHTML = cellsHtml;

            // 行点击 (使用受好评的 rowBounceShake 震荡晃动)
            tr.addEventListener("click", (e) => {
                if (e.target.classList.contains("interactive-cell")) return;

                const isAlreadyActive = tr.classList.contains("active-row");
                document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
                document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));

                if (isAlreadyActive) {
                    document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("active-pos"));
                    return;
                }

                tr.classList.add("active-row");
                tr.classList.add("row-click-flash");
                setTimeout(() => tr.classList.remove("row-click-flash"), 450);

                highlightZtCell(baseNum, baseNum, 1, pInfo);
            });

            // 单格点击 (使用受好评的弹性晃动震荡与高亮)
            tr.querySelectorAll(".interactive-cell").forEach(cellTd => {
                cellTd.addEventListener("click", (e) => {
                    e.stopPropagation();

                    const isCellActive = cellTd.classList.contains("active-cell");
                    document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));
                    document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));

                    if (isCellActive) {
                        document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("active-pos"));
                        return;
                    }

                    cellTd.classList.add("active-cell");
                    tr.classList.add("active-row");
                    tr.classList.add("row-click-flash");
                    setTimeout(() => tr.classList.remove("row-click-flash"), 450);

                    const val = parseInt(cellTd.dataset.val, 10);
                    const bNum = parseInt(cellTd.dataset.base || baseNum, 10);
                    const kStep = parseInt(cellTd.dataset.k || 1, 10);

                    highlightZtCell(val, bNum, kStep, pInfo);
                });
            });

            tableBody.appendChild(tr);
        });
    }

    function highlightZtCell(val, baseNum, kStep, pInfo) {
        const degMod = val % 360;
        const rem81 = val % 81 === 0 ? 81 : val % 81;
        const rem12 = val % 12 === 0 ? 12 : val % 12;
        const branch = EARTHLY_BRANCHES[rem12 - 1];
        const subTag = TAIYI_81_SUB_LABELS[rem81] || "";

        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            cell.classList.toggle("active-pos", parseInt(cell.dataset.pos, 10) === rem81);
        });

        engine.highlightSingleBranch(rem12 - 1);

        if (badgeTitle) badgeTitle.innerText = `周天单格: ${baseNum} + (${kStep}-1)×${pInfo.degStep}° = ${val}°`;
        if (badgeDesc) badgeDesc.innerText = `模 360° 余 ${degMod}° | 降维太乙 81 阵图: 第 ${rem81} 宫 ${subTag} | 定位地支: 【${branch.name}位】`;
    }

    // 绑定 3x3 九宫切换按钮
    document.querySelectorAll(".zt-palace-tab").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".zt-palace-tab").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 450);

            const palaceKey = this.dataset.palace;
            renderZhoutian360MasterTable(palaceKey);
        });
    });

    // 为 Tab 1 ~ 4 中的表格行也赋予受好评的 rowBounceShake 震荡晃动
    document.querySelectorAll(".interactive-row").forEach(tr => {
        tr.addEventListener("click", function() {
            const isAlreadyActive = this.classList.contains("active-row");
            document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));

            if (!isAlreadyActive) {
                this.classList.add("active-row");
                this.classList.add("row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);
            }
        });
    });

    function switchTablePanel(targetId) {
        tabBtns.forEach(b => b.classList.toggle("active", b.dataset.target === targetId));
        contentPanels.forEach(p => p.style.display = p.id === targetId ? "block" : "none");

        if (targetId === "panel-table-5") {
            renderZhoutian360MasterTable("1");
        } else if (targetId === "panel-table-1") {
            if (badgeTitle) badgeTitle.innerText = "表1 · 4 象 90° 质变与 4 个 81 矩映射表";
            if (badgeDesc) badgeDesc.innerText = "90° 巳位(地户)、180° 午/未位、270° 酉位、360° 亥位(天门)";
            engine.render4XiangSquare();
            highlightPositions([81]);
        } else if (targetId === "panel-table-2") {
            if (badgeTitle) badgeTitle.innerText = "表2 · 6 × 60° 节卦六步周转表";
            if (badgeDesc) badgeDesc.innerText = "按黄钟(子)、太簇(寅)、姑洗(辰)、蕤宾(午)、夷则(申)、无射(戌)六步构成 360° 等角大周天";
            engine.render60JieHexagon();
            highlightPositions([60, 81]);
        } else if (targetId === "panel-table-3") {
            if (badgeTitle) badgeTitle.innerText = "表3 · 81 矩九宫分属完整表";
            if (badgeDesc) badgeDesc.innerText = "12 方位 3 大坐标系全部 81 矩气数在太乙 9 宫完美落位";
            engine.clearTrajectoryGroup();
            highlightPositions([1, 9, 81]);
        } else if (targetId === "panel-table-4") {
            if (badgeTitle) badgeTitle.innerText = "表4 · 360° 连续对半分割归九表";
            if (badgeDesc) badgeDesc.innerText = "360° ➔ 180° ➔ 90° ➔ 45° ➔ 22.5° ➔ 11.25° ➔ 5.625° 众和数恒无条件收敛归于 9！";
            engine.clearTrajectoryGroup();
            highlightPositions([9, 18, 27, 36, 45, 54, 63, 72, 81]);
        }
    }

    function highlightPositions(posList) {
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            if (posList.includes(p)) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });
    }

    tabBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            switchTablePanel(this.dataset.target);
        });
    });

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

    switchTablePanel("panel-table-5");
});
