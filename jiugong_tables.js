/* ==========================================================================
   《易经数理秘笈》原书九宫纪气数一览表全景馆引擎 - (jiugong_tables.js)
   特点：还原原书 P342-350 9 张 9x9 纪气数倍积大表 + 单格精准点击 + 81 宫标注位号角标 + 三向联动
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
    { num: 4, name: "巽四宫 (木)", numbers: [31, 76, 13, 22, 40, 58, 67, 4, 49], class: "palace-xun", color: "#40c057" },
    { num: 9, name: "离九宫 (火)", numbers: [36, 81, 18, 27, 45, 63, 72, 9, 54], class: "palace-li", color: "#ff5252" },
    { num: 2, name: "坤二宫 (土)", numbers: [29, 74, 11, 20, 38, 56, 65, 2, 47], class: "palace-kun", color: "#e5c07b" },
    { num: 3, name: "震三宫 (木)", numbers: [30, 75, 12, 21, 39, 57, 66, 3, 48], class: "palace-zhen", color: "#40c057" },
    { num: 5, name: "中五宫 (土)", numbers: [32, 77, 14, 23, 41, 59, 68, 5, 50], class: "palace-zhong", color: "#ffe066" },
    { num: 7, name: "兑七宫 (金)", numbers: [34, 79, 16, 25, 43, 61, 70, 7, 52], class: "palace-dui", color: "#dee2e6" },
    { num: 8, name: "艮八宫 (土)", numbers: [35, 80, 17, 26, 44, 62, 71, 8, 53], class: "palace-gen", color: "#e5c07b" },
    { num: 1, name: "坎一宫 (水)", numbers: [28, 73, 10, 19, 37, 55, 64, 1, 46], class: "palace-kan", color: "#4dabf7" },
    { num: 6, name: "乾六宫 (金)", numbers: [33, 78, 15, 24, 42, 60, 69, 6, 51], class: "palace-qian", color: "#dee2e6" },
];

// 太乙 81 宫全量角标位号字典 (匹配原书图片格式 宫_位)
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

const ORIGINAL_9_TABLES_INFO = {
    1: { name: "一宫表 (坎一水宫)", page: "原书 P342 (第34页上表)", baseSeq: [1, 10, 19, 28, 37, 46, 55, 64, 73], desc: "原书 P342 【一宫表】：首行基数为 1, 10, 19, 28, 37, 46, 55, 64, 73，公差为 9。延伸 9 级倍积后进位数为 9, 90, 171, 252, 333, 414, 495, 576, 657，主坎水阳气初萌。" },
    2: { name: "二宫表 (坤二土宫)", page: "原书 P343 (第34页下表)", baseSeq: [2, 11, 20, 29, 38, 47, 56, 65, 74], desc: "原书 P343 【二宫表】：首行基数为 2, 11, 20, 29, 38, 47, 56, 65, 74，公差为 9。进位数为 18, 99, 180, 261, 342, 423, 504, 585, 666，主阴阳包容怀藏。" },
    3: { name: "三宫表 (震三木宫)", page: "原书 P344 (第35页上表)", baseSeq: [3, 12, 21, 30, 39, 48, 57, 66, 75], desc: "原书 P344 【三宫表】：首行基数为 3, 12, 21, 30, 39, 48, 57, 66, 75，公差为 9。进位数为 27, 108, 189, 270, 351, 432, 513, 594, 675，主震木万物生发。" },
    4: { name: "四宫表 (巽四木宫)", page: "原书 P345 (第35页下表)", baseSeq: [4, 13, 22, 31, 40, 49, 58, 67, 76], desc: "原书 P345 【四宫表】：首行基数为 4, 13, 22, 31, 40, 49, 58, 67, 76，公差为 9。进位数为 36, 117, 198, 279, 360, 441, 522, 603, 684，主巽风申布齐洁。" },
    5: { name: "五宫表 (中五土宫)", page: "原书 P346 (第36页上表)", baseSeq: [5, 14, 23, 32, 41, 50, 59, 68, 77], desc: "原书 P346 【五宫表】：首行基数为 5, 14, 23, 32, 41, 50, 59, 68, 77，公差为 9。进位数为 45, 126, 207, 288, 369, 450, 531, 612, 693，主皇极太极中枢。" },
    6: { name: "六宫表 (乾六金宫)", page: "原书 P347 (第36页下表)", baseSeq: [6, 15, 24, 33, 42, 51, 60, 69, 78], desc: "原书 P347 【六宫表】：首行基数为 6, 15, 24, 33, 42, 51, 60, 69, 78，公差为 9。进位数为 54, 135, 216, 297, 378, 459, 540, 621, 702，主天金刚健刚大。" },
    7: { name: "七宫表 (兑七金宫)", page: "原书 P348 (第37页上表)", baseSeq: [7, 16, 25, 34, 43, 52, 61, 70, 79], desc: "原书 P348 【七宫表】：首行基数为 7, 16, 25, 34, 43, 52, 61, 70, 79，公差为 9。进位数为 63, 144, 225, 306, 387, 468, 549, 630, 711，主兑泽说怿和乐。" },
    8: { name: "八宫表 (艮八土宫)", page: "原书 P349 (第37页下表)", baseSeq: [8, 17, 26, 35, 44, 53, 62, 71, 80], desc: "原书 P349 【八宫表】：首行基数为 8, 17, 26, 35, 44, 53, 62, 71, 80，公差为 9。进位数为 72, 153, 234, 315, 396, 477, 558, 639, 720，主艮山止藏归结。" },
    9: { name: "九宫表 (离九火宫)", page: "原书 P350 (附件终表)", baseSeq: [9, 18, 27, 36, 45, 54, 63, 72, 81], desc: "原书 P350 【九宫表】：首行基数为 9, 18, 27, 36, 45, 54, 63, 72, 81，公差为 9。进位数为 81, 162, 243, 324, 405, 486, 567, 648, 729，主离火光明发辉、众和收敛归于 9。" }
};

const HEXAGRAM_NAMES_MAP = {
    1: "乾为天", 2: "坤为地", 3: "水雷屯", 4: "山水蒙", 5: "水天需", 6: "天水讼", 7: "地水师", 8: "水地比",
    9: "风天小畜", 10: "天泽履", 11: "地天泰", 12: "天地否", 13: "天火同人", 14: "火天大有", 15: "地山谦", 16: "雷地豫",
    17: "泽雷随", 18: "山风蛊", 19: "地泽临", 20: "风地观", 21: "火雷噬嗑", 22: "山火贲", 23: "山地剥", 24: "地雷复",
    25: "天雷无妄", 26: "山天大畜", 27: "山雷颐", 28: "泽风大过", 29: "坎为水", 30: "离为火", 31: "泽山咸", 32: "雷风恒",
    33: "天山遁", 34: "雷天大壮", 35: "火地晋", 36: "地火明夷", 37: "风火家人", 38: "火泽睽", 39: "水山蹇", 40: "雷水解",
    41: "山泽损", 42: "风雷益", 43: "泽天夬", 44: "天风姤", 45: "泽地萃", 46: "地风升", 47: "泽水困", 48: "水风井",
    49: "泽火革", 50: "火风鼎", 51: "震为雷", 52: "艮为山", 53: "风山渐", 54: "雷泽归妹", 55: "雷火丰", 56: "火山旅",
    57: "巽为风", 58: "兑为泽", 59: "风水涣", 60: "水泽节", 61: "风泽中孚", 62: "雷山小过", 63: "水火既济", 64: "火水未济"
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

class JiugongTablesPureMath3DEngine {
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
        this.jgt3DGroup = new THREE.Group();

        this.autoRotate = true;
        this.pulseProgress = 0;
        this.speedMultiplier = 1.0;
        this.activeCurve = null;
        this.dataPulseMesh = null;

        this.initScene();
        this.createArmillaryRings();
        this.createCelestialGridAndPoles();
        this.setupDataMotionPulse();
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
        this.scene.add(this.jgt3DGroup);
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

    setupDataMotionPulse() {
        const branchPoints = [];
        for (let i = 0; i < 12; i++) {
            branchPoints.push(getBranch3DPos(i));
        }
        branchPoints.push(branchPoints[0]);

        this.activeCurve = new THREE.CatmullRomCurve3(branchPoints, true);
        const lineGeom = new THREE.BufferGeometry().setFromPoints(this.activeCurve.getPoints(100));
        const lineMat = new THREE.LineDashedMaterial({ color: 0xffe066, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 });
        const motionLine = new THREE.Line(lineGeom, lineMat);
        motionLine.computeLineDistances();
        this.jgt3DGroup.add(motionLine);

        const pulseGeom = new THREE.SphereGeometry(0.48, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe066, emissiveIntensity: 1.5 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.jgt3DGroup.add(this.dataPulseMesh);
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

    highlightBranchPos(branchIdx) {
        const pos = getBranch3DPos(branchIdx);
        if (this.dataPulseMesh) {
            this.dataPulseMesh.position.copy(pos);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.002;
        }

        if (this.activeCurve && this.dataPulseMesh) {
            this.pulseProgress += 0.003 * this.speedMultiplier;
            if (this.pulseProgress > 1.0) this.pulseProgress = 0;
            const pos = this.activeCurve.getPointAt(this.pulseProgress);
            this.dataPulseMesh.position.copy(pos);
        }

        if (this.controls) this.controls.update();
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new JiugongTablesPureMath3DEngine("three-canvas-jiugong-tables");

    const matrixContainer = document.getElementById("taiyi-81-matrix");
    const tableHead = document.getElementById("jgt-table-head");
    const tableBody = document.getElementById("jgt-table-body");
    const tableTitle = document.getElementById("jgt-table-title");
    const palaceBanner = document.getElementById("jgt-palace-banner");
    const detailCard = document.getElementById("jgt-detail-card");
    const badgeTitle = document.getElementById("jgt-badge-title");
    const badgeDesc = document.getElementById("jgt-badge-desc");

    // 渲染太乙 81 宫阵图 (带有数字 + 角标位号，与原书图片 100% 一致)
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
                
                const subTag = TAIYI_81_SUB_LABELS[num] || "";
                cell.title = `数值 ${num} (${palace.name} ${subTag})`;
                cell.innerHTML = `<div class="cell-num">${num}</div><div class="cell-sub">${subTag}</div>`;

                cell.addEventListener("click", () => {
                    const isAlreadyActive = cell.classList.contains("active-pos");
                    document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("active-pos"));

                    if (!isAlreadyActive) {
                        cell.classList.add("active-pos");
                        const rem12 = num % 12 === 0 ? 12 : num % 12;
                        engine.highlightBranchPos(rem12 - 1);
                    }
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    function updatePalaceBanner(palaceKey) {
        if (!palaceBanner) return;
        if (palaceKey === "all") {
            palaceBanner.innerHTML = `
                <div style="font-size:13px; font-weight:800; color:#ffe066;">
                    📜 原著《九宫纪气数一览表》9大表合集全景
                </div>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">
                    梁致堂原著 P342-350（对应 PPT 第34~37页）共 9 张 9x9 纪气数倍积大表，完美呈现每一宫从 1 级至 9 级倍积与进位数。点击每个单格可精准定位单格算式与 81 宫位号！
                </div>
            `;
        } else {
            const pInfo = ORIGINAL_9_TABLES_INFO[parseInt(palaceKey, 10)] || ORIGINAL_9_TABLES_INFO[1];
            palaceBanner.innerHTML = `
                <div style="font-size:13px; font-weight:800; color:#ffe066;">
                    📜 原著【${pInfo.name}】原表解构 (${pInfo.page})
                </div>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px; line-height:1.4;">
                    ${pInfo.desc} (支持点击单格 ×1~×9 精准计算及点击行首全行高亮)
                </div>
            `;
        }
    }

    // 渲染原书 9x9 纪气数倍积大表 (支持行选择与单格精准选择)
    function renderOriginal9x9Table(palaceKey = "1", searchText = "") {
        if (!tableHead || !tableBody) return;
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        updatePalaceBanner(palaceKey);

        const pNum = palaceKey === "all" ? 1 : parseInt(palaceKey, 10);
        const pInfo = ORIGINAL_9_TABLES_INFO[pNum] || ORIGINAL_9_TABLES_INFO[1];

        if (tableTitle) {
            tableTitle.innerText = `📜 原书【${pInfo.name}】9x9 纪气数倍积大表 (${pInfo.page})`;
        }

        // 构建原书表头
        const trHead = document.createElement("tr");
        trHead.innerHTML = `
            <th style="color:#ffe066;">基数 N</th>
            <th>×1</th>
            <th>×2</th>
            <th>×3</th>
            <th>×4</th>
            <th>×5</th>
            <th>×6</th>
            <th>×7</th>
            <th>×8</th>
            <th>×9</th>
            <th style="color:#ff5252;">进位数 (N×9)</th>
            <th>归宫</th>
            <th>地支</th>
        `;
        tableHead.appendChild(trHead);

        pInfo.baseSeq.forEach(baseNum => {
            const tr = document.createElement("tr");
            tr.className = "interactive-row";
            tr.dataset.num = baseNum;

            // 基数单元格
            let cellsHtml = `<td class="interactive-cell base-num-cell" data-val="${baseNum}" style="font-weight:800; color:#ffe066; font-family:var(--font-times);">${baseNum}</td>`;
            
            // ×1 ~ ×9 单格
            for (let k = 1; k <= 9; k++) {
                const prod = baseNum * k;
                cellsHtml += `<td class="interactive-cell prod-cell" data-base="${baseNum}" data-k="${k}" data-val="${prod}" style="font-family:var(--font-times);">${prod}</td>`;
            }

            const carry = baseNum * 9;
            const rem81 = baseNum % 81 === 0 ? 81 : baseNum % 81;
            const rem12 = baseNum % 12 === 0 ? 12 : baseNum % 12;
            const branch = EARTHLY_BRANCHES[rem12 - 1];

            cellsHtml += `<td class="interactive-cell carry-cell" data-val="${carry}" style="font-weight:800; color:#ff5252; font-family:var(--font-times);">${carry}</td>`;
            cellsHtml += `<td style="font-family:var(--font-times);">${rem81}宫</td>`;
            cellsHtml += `<td style="color:${branch.color}; font-weight:800;">${branch.name}位</td>`;

            tr.innerHTML = cellsHtml;

            // 行级别点击 (全行高亮)
            tr.addEventListener("click", (e) => {
                // 如果点击的是具体单元格，由单元格事件处理
                if (e.target.classList.contains("interactive-cell")) {
                    return;
                }

                const isAlreadyActive = tr.classList.contains("active-row");
                document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
                document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));

                if (isAlreadyActive) {
                    document.querySelectorAll(".taiyi-81-cell").forEach(cell => cell.classList.remove("active-pos"));
                    return;
                }

                tr.classList.add("active-row");
                tr.classList.add("row-click-flash");
                setTimeout(() => tr.classList.remove("row-click-flash"), 450);

                highlightCellAnd3D(baseNum, baseNum, 1, pInfo);
            });

            // 给每一个单格绑定精准点击事件 (Exact Cell Clicking)
            tr.querySelectorAll(".interactive-cell").forEach(cellTd => {
                cellTd.addEventListener("click", (e) => {
                    e.stopPropagation();

                    const isCellActive = cellTd.classList.contains("active-cell");
                    document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));
                    document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));

                    if (isCellActive) {
                        document.querySelectorAll(".taiyi-81-cell").forEach(cell => cell.classList.remove("active-pos"));
                        if (detailCard) {
                            detailCard.innerHTML = `
                                <div style="font-size: 13px; font-weight: 800; color: #ffe066; margin-bottom: 4px;">
                                    📜 原书【${pInfo ? pInfo.name : '九宫'}】九级倍积大表全景 (P342-350)
                                </div>
                                <div style="font-size: 11.5px; color: #cbd5e1; line-height: 1.5;">
                                    点击大表中任意单元格查看该格单项算式、倍积与 81 宫位号；再次点击可【取消选中】。
                                </div>
                            `;
                        }
                        return;
                    }

                    cellTd.classList.add("active-cell");
                    tr.classList.add("active-row");

                    const val = parseInt(cellTd.dataset.val, 10);
                    const bNum = parseInt(cellTd.dataset.base || baseNum, 10);
                    const multiplier = parseInt(cellTd.dataset.k || 1, 10);

                    highlightCellAnd3D(val, bNum, multiplier, pInfo);
                });
            });

            tableBody.appendChild(tr);
        });

        if (pInfo.baseSeq.length > 0) {
            highlightCellAnd3D(pInfo.baseSeq[0], pInfo.baseSeq[0], 1, pInfo);
        }
    }

    function highlightCellAnd3D(val, baseNum, multiplier, pInfo) {
        const rem81 = val % 81 === 0 ? 81 : val % 81;
        const rem12 = val % 12 === 0 ? 12 : val % 12;
        const branch = EARTHLY_BRANCHES[rem12 - 1];
        const hexName = HEXAGRAM_NAMES_MAP[rem81] || (rem81 <= 64 ? `第${rem81}卦` : `宫数 ${rem81}`);
        const deg = (val * 4.4444).toFixed(1) + "°";
        const subTag = TAIYI_81_SUB_LABELS[rem81] || "";

        // 高亮太乙 81 宫 (双行角标位号匹配原图)
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            cell.classList.toggle("active-pos", parseInt(cell.dataset.pos, 10) === rem81);
        });

        // 驱动 3D 节点
        engine.highlightBranchPos(rem12 - 1);

        if (detailCard) {
            detailCard.innerHTML = `
                <div style="font-size: 14px; font-weight: 800; color: #ffe066; margin-bottom: 4px;">
                    🎯 【${pInfo ? pInfo.name : '九宫'}】单格精准算式: ${baseNum} × ${multiplier} = <span style="font-size:16px;">${val}</span>
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; font-family: var(--font-times);">
                    • 单格计算值: <strong>${val}</strong> | 归太乙 81 阵图: <strong style="color:#ffe066;">第 ${rem81} 宫 ${subTag}</strong> | 对应易卦: <strong>${hexName}</strong><br>
                    • 周天角度: <strong>${deg}</strong> | 12地支余数: 余 ${rem12} | 坐标系: <span style="color:${branch.color}; font-weight:800;">${branch.name}位 (${branch.system})</span>
                </div>
                <div style="margin-top: 6px; font-size: 11px; color: #ffffff; background: rgba(77,171,247,0.18); padding: 4px 8px; border-radius: 4px;">
                    数理学术解析：单格乘积 ${baseNum}×${multiplier}=${val} 降维归入【第 ${rem81} 宫 ${subTag}】，3D 脉冲定位至【${branch.name}位】！
                </div>
            `;
        }

        if (badgeTitle) badgeTitle.innerText = `单格 ${baseNum}×${multiplier}=${val} ➔ 第 ${rem81} 宫 ${subTag} (${branch.name}位)`;
        if (badgeDesc) badgeDesc.innerText = `对应 ${hexName} · ${deg}，太乙 81 阵图 ${subTag} 位与 3D 坐标系同步高亮`;
    }

    // 绑定 9 大张表格切选按钮
    document.querySelectorAll(".palace-tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".palace-tab-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 450);

            const palaceKey = this.dataset.palace;
            const searchVal = document.getElementById("jgt-search-input") ? document.getElementById("jgt-search-input").value : "";
            renderOriginal9x9Table(palaceKey, searchVal);
        });
    });

    const searchInput = document.getElementById("jgt-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const activePalaceBtn = document.querySelector(".palace-tab-btn.active");
            const palaceKey = activePalaceBtn ? activePalaceBtn.dataset.palace : "1";
            renderOriginal9x9Table(palaceKey, e.target.value);
        });
    }

    const resetSearchBtn = document.getElementById("jgt-reset-search");
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            const activePalaceBtn = document.querySelector(".palace-tab-btn.active");
            const palaceKey = activePalaceBtn ? activePalaceBtn.dataset.palace : "1";
            renderOriginal9x9Table(palaceKey, "");
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
            engine.speedMultiplier = level;
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

    renderOriginal9x9Table("1", "");
});
