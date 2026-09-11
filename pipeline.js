/* ==========================================================================
   《易经数理秘笈》任意数据 12 步拆解推演流水线 - (pipeline.js)
   特点：纯粹数理逻辑 3D 浑天天象坐标体系 + 5 步动画递算 + N*k 映射明细表弹簧晃动震荡与取消机制
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


const PALACE_NAME_MAP = {
    "一": "坎一宫", "二": "坤二宫", "三": "震三宫",
    "四": "巽四宫", "五": "中五宫", "六": "乾六宫",
    "七": "兑七宫", "八": "艮八宫", "九": "离九宫"
};

const POS_NAME_MAP = {
    "₁": "一位", "₂": "二位", "₃": "三位",
    "₄": "四位", "₅": "五位", "₆": "六位",
    "₇": "七位", "₈": "八位", "₉": "九位"
};

function getPalacePosDesc(num) {
    const sub = (typeof TAIYI_81_SUB_LABELS !== "undefined" && TAIYI_81_SUB_LABELS[num]) ? TAIYI_81_SUB_LABELS[num] : "";
    if (sub.length >= 4) {
        const palChar = sub.charAt(1);
        const posChar = sub.charAt(2);
        const palName = PALACE_NAME_MAP[palChar] || `${palChar}宫`;
        const posName = POS_NAME_MAP[posChar] || "";
        return `${palName}${posName} ${sub}`;
    }
    return `${num}号 ${sub}`;
}

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

// 天门-地户轴单位向量 (东南地户巳 -60°, 西北天门亥 120°)
const AXIS_TIANMEN_DIHU = new THREE.Vector3(
    Math.cos(THREE.MathUtils.degToRad(-60)), 
    Math.sin(THREE.MathUtils.degToRad(-60)), 
    0
).normalize();

function getBranch3DPos(branchIdx, radius = 6.0) {
    const angle = THREE.MathUtils.degToRad(90 - branchIdx * 30);
    const baseVec = new THREE.Vector3(radius * Math.cos(angle), radius * Math.sin(angle), 0);
    
    const remSystem = (branchIdx + 1) % 3;
    if (remSystem === 2) {
        // 黄道四支 (丑, 辰, 未, 戌): 绕卯-酉轴 (春分-秋分, X 轴) 旋转 +23.5°
        baseVec.applyAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(23.5));
    } else if (remSystem === 0) {
        // 白道四支 (寅, 巳, 申, 亥): 绕天门-地户轴 (巳-亥, AXIS_TIANMEN_DIHU) 轴立体旋转 18°
        baseVec.applyAxisAngle(AXIS_TIANMEN_DIHU, THREE.MathUtils.degToRad(18));
    }
    // remSystem === 1 为赤道四支 (子, 卯, 午, 酉): 纯水平赤道面 Z = 0
    return baseVec;
}

class PipelinePureMath3DEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth || 400;
        this.height = this.container.clientHeight || 500;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.frameworkGroup = new THREE.Group();
        this.equatorGroup = new THREE.Group();
        this.eclipticGroup = new THREE.Group();
        this.lunarGroup = new THREE.Group();
        this.celestialGridGroup = new THREE.Group();
        this.orbsGroup = new THREE.Group();
        this.pipe3DGroup = new THREE.Group();

        this.autoRotate = true;

        this.activeCurve = null;
        this.dataPulseMesh = null;
        this.pulseProgress = 0;
        this.pulseSpeedMultiplier = 1.0;

        this.initScene();
        this.createArmillaryFramework();
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

        this.scene.add(this.frameworkGroup);
        this.scene.add(this.equatorGroup);
        this.scene.add(this.eclipticGroup);
        this.scene.add(this.lunarGroup);
        this.scene.add(this.celestialGridGroup);
        this.scene.add(this.orbsGroup);
        this.scene.add(this.pipe3DGroup);
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

    // 浑天仪外层固定骨架 (六合仪支架与中黄地核)
    createArmillaryFramework(radius = 6.0) {
        const frameRadius = radius * 1.07;
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0xd4af37,
            metalness: 0.85,
            roughness: 0.25,
            emissive: 0x332200,
            transparent: true,
            opacity: 0.65
        });

        // 1. 地平基准大环 (Horizon Ring)
        const horizonGeom = new THREE.TorusGeometry(frameRadius, 0.055, 12, 120);
        const horizonMesh = new THREE.Mesh(horizonGeom, frameMat);
        this.frameworkGroup.add(horizonMesh);

        // 2. 子午立双环 (Meridian Dual Rings，在 YZ 垂直面)
        const meridianGeom1 = new THREE.TorusGeometry(frameRadius, 0.05, 12, 120);
        const meridianMesh1 = new THREE.Mesh(meridianGeom1, frameMat);
        meridianMesh1.rotation.y = Math.PI / 2;
        this.frameworkGroup.add(meridianMesh1);

        const meridianGeom2 = new THREE.TorusGeometry(frameRadius * 0.98, 0.035, 12, 120);
        const meridianMesh2 = new THREE.Mesh(meridianGeom2, frameMat);
        meridianMesh2.rotation.y = Math.PI / 2;
        this.frameworkGroup.add(meridianMesh2);

        // 3. 四方地平天标
        const cardinals = [
            { name: "正北", vec: new THREE.Vector3(0, frameRadius * 1.06, 0), color: "#ffe066" },
            { name: "正东", vec: new THREE.Vector3(frameRadius * 1.06, 0, 0), color: "#ffe066" },
            { name: "正南", vec: new THREE.Vector3(0, -frameRadius * 1.06, 0), color: "#ffe066" },
            { name: "正西", vec: new THREE.Vector3(-frameRadius * 1.06, 0, 0), color: "#ffe066" }
        ];
        cardinals.forEach(c => {
            const sp = this.createTextSprite(c.name, c.color);
            sp.position.copy(c.vec);
            sp.scale.set(1.1, 1.1, 1.1);
            this.frameworkGroup.add(sp);
        });

        // 4. 中黄地核球 (Terra Core，中黄居中)
        const coreGeom = new THREE.SphereGeometry(0.85, 24, 24);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0x183050,
            emissive: 0x0a1a30,
            metalness: 0.6,
            roughness: 0.3,
            transparent: true,
            opacity: 0.7
        });
        const coreMesh = new THREE.Mesh(coreGeom, coreMat);
        this.frameworkGroup.add(coreMesh);

        const coreWireGeom = new THREE.SphereGeometry(0.86, 12, 8);
        const coreWireMat = new THREE.MeshBasicMaterial({ color: 0xffe066, wireframe: true, transparent: true, opacity: 0.25 });
        const coreWireMesh = new THREE.Mesh(coreWireGeom, coreWireMat);
        this.frameworkGroup.add(coreWireMesh);
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

        // 北极星微星核与星宿光环 (告别巨大白塑料球)
        const northStarGeom = new THREE.SphereGeometry(0.14, 16, 16);
        const northStarMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const northStar = new THREE.Mesh(northStarGeom, northStarMat);
        northStar.position.set(0, 0, 8.5);
        this.celestialGridGroup.add(northStar);

        const northHaloGeom = new THREE.TorusGeometry(0.32, 0.02, 12, 36);
        const northHaloMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.6 });
        const northHalo = new THREE.Mesh(northHaloGeom, northHaloMat);
        northHalo.position.set(0, 0, 8.5);
        this.celestialGridGroup.add(northHalo);

        const northSprite = this.createTextSprite("北极星", "#ffe066");
        northSprite.position.set(0, 0, 9.6);
        this.celestialGridGroup.add(northSprite);
    }

    createArmillaryRings() {
        const radius = 6.0;

        // 1. 赤道环 (水平 0° 面，金属赤红)
        const equatorGeom = new THREE.TorusGeometry(radius, 0.07, 16, 120);
        const equatorMat = new THREE.MeshStandardMaterial({ color: 0xff5252, metalness: 0.8, roughness: 0.2, emissive: 0x880000 });
        const equatorMesh = new THREE.Mesh(equatorGeom, equatorMat);
        this.equatorGroup.add(equatorMesh);

        // 2. 黄道环 (绕春分-秋分 X 轴旋转 +23.5°，金属翠绿)
        const eclipticMat = new THREE.MeshStandardMaterial({ color: 0x40c057, metalness: 0.8, roughness: 0.2, emissive: 0x006600 });
        const eclipticMesh = new THREE.Mesh(equatorGeom.clone(), eclipticMat);
        eclipticMesh.rotation.x = THREE.MathUtils.degToRad(23.5);
        this.eclipticGroup.add(eclipticMesh);

        // 3. 白道环 (解绑卯酉单轴！绕天门-地户轴立体旋转 18°，金属青蓝)
        const lunarMat = new THREE.MeshStandardMaterial({ color: 0x4dabf7, metalness: 0.8, roughness: 0.2, emissive: 0x0033aa });
        const lunarMesh = new THREE.Mesh(equatorGeom.clone(), lunarMat);
        lunarMesh.quaternion.setFromAxisAngle(AXIS_TIANMEN_DIHU, THREE.MathUtils.degToRad(18));
        this.lunarGroup.add(lunarMesh);

        // 4. 十二地支星宿位点：彻底移除死板塑料大球与斜金环，升华为【微光星宿晶核 + 浑天星曜玉璧】
        EARTHLY_BRANCHES.forEach((b) => {
            const pos = getBranch3DPos(b.idx, radius);

            // 环上微型星宿光核 (半径仅 0.07，精致纯粹如恒星微芒，不遮挡轨道流线)
            const starGeom = new THREE.SphereGeometry(0.07, 12, 12);
            const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const starMesh = new THREE.Mesh(starGeom, starMat);
            starMesh.position.copy(pos);
            this.orbsGroup.add(starMesh);

            // 浑天星曜玉璧徽标 (贴合环轨外缘，比例优雅和谐)
            const sprite = this.createTextSprite(b.name, b.color);
            sprite.position.copy(pos.clone().multiplyScalar(1.08));
            this.orbsGroup.add(sprite);
        });
    }

    // 绘制高质感“浑天星曜玉璧”地支徽标
    createTextSprite(text, colorHex) {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        // 1. 柔和外围星辉光晕
        const radGlow = ctx.createRadialGradient(64, 64, 28, 64, 64, 58);
        radGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
        radGlow.addColorStop(0.65, colorHex + "33");
        radGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = radGlow;
        ctx.beginPath();
        ctx.arc(64, 64, 58, 0, Math.PI * 2);
        ctx.fill();

        // 2. 浑天黑曜石半透明微透星盘底
        ctx.fillStyle = "rgba(10, 16, 28, 0.88)";
        ctx.beginPath();
        ctx.arc(64, 64, 46, 0, Math.PI * 2);
        ctx.fill();

        // 3. 双重同心浑天仪规金线
        ctx.strokeStyle = colorHex;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(64, 64, 40, 0, Math.PI * 2);
        ctx.stroke();

        // 4. 正中温润书法地支大字 (带内辉)
        ctx.font = "Bold 44px 'Noto Serif SC', 'KaiTi', 'SimSun', serif";
        ctx.fillStyle = "#ffffff";
        ctx.shadowColor = colorHex;
        ctx.shadowBlur = 8;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 64, 65);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(1.4, 1.4, 1.4);
        return sprite;
    }

    clearPipe3DGroup() {
        while (this.pipe3DGroup.children.length > 0) {
            const obj = this.pipe3DGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
        this.activeCurve = null;
        this.dataPulseMesh = null;
    }

    renderNumber12StepTrajectory(inputNum) {
        this.clearPipe3DGroup();
        const radius = 6.0;
        const points = [];

        for (let k = 1; k <= 12; k++) {
            const val = inputNum * k;
            const rem12 = val % 12 === 0 ? 12 : val % 12;
            const bIdx = rem12 - 1;
            points.push(getBranch3DPos(bIdx, radius));
        }

        points.push(points[0]);

        this.activeCurve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.05);
        const tubeGeom = new THREE.TubeGeometry(this.activeCurve, 100, 0.08, 8, true);
        const tubeMat = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xaa7c11, transparent: true, opacity: 0.9 });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        this.pipe3DGroup.add(tubeMesh);

        points.slice(0, 12).forEach((p) => {
            const sphereGeom = new THREE.SphereGeometry(0.18, 16, 16);
            const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffe066 });
            const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            sphereMesh.position.copy(p);
            this.pipe3DGroup.add(sphereMesh);
        });

        const pulseGeom = new THREE.SphereGeometry(0.32, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.pipe3DGroup.add(this.dataPulseMesh);
    }

    // 单个地支高亮：升级为“浑天同心耀金灵光环” (告别粗笨大实心白球)
    highlightSingleBranch(bIdx) {
        this.clearPipe3DGroup();
        const pos = getBranch3DPos(bIdx);

        // 1. 核心星光发光点
        const starGeom = new THREE.SphereGeometry(0.14, 16, 16);
        const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const starMesh = new THREE.Mesh(starGeom, starMat);
        starMesh.position.copy(pos);
        this.pipe3DGroup.add(starMesh);

        // 2. 悬浮面向相机的双重同心光晕环 (准星聚焦仪轨)
        const ringGeom = new THREE.TorusGeometry(0.46, 0.03, 12, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.85 });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(pos);
        if (this.camera) ringMesh.quaternion.copy(this.camera.quaternion);
        this.pipe3DGroup.add(ringMesh);

        const outerRingGeom = new THREE.TorusGeometry(0.68, 0.02, 12, 48);
        const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.4 });
        const outerRingMesh = new THREE.Mesh(outerRingGeom, outerRingMat);
        outerRingMesh.position.copy(pos);
        if (this.camera) outerRingMesh.quaternion.copy(this.camera.quaternion);
        this.pipe3DGroup.add(outerRingMesh);
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
    const engine = new PipelinePureMath3DEngine("three-canvas-pipeline");

    const matrixContainer = document.getElementById("taiyi-81-matrix");
    const numInput = document.getElementById("num-input");
    const btnCalculate = document.getElementById("btn-calculate");
    const seqTableBody = document.getElementById("seq-table-body");
    const pipeBadgeTitle = document.getElementById("pipe-badge-title");
    const pipeBadgeDesc = document.getElementById("pipe-badge-desc");

    let isDeductionRunning = false;
    let stepAnimationTimer = null;

    let currentJu = 0; // 当前所处矩数 (0=第1矩 1~81, 1=第2矩 82~162, 864=第865矩...)
    let activeDeductionN = 70000; // 当前输入的推演数值

    const currentJuBadge = document.getElementById("current-ju-badge");
    const btnJuCurrentN = document.getElementById("btn-ju-current-n");

    function renderLuoshuTaiyi9x9Matrix(juIndex, activeRem81 = null) {
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

            palace.numbers.forEach(baseNum => {
                const currentVal = baseNum + juIndex * 81;
                const r12 = currentVal % 12 === 0 ? 12 : currentVal % 12;
                const branch = EARTHLY_BRANCHES[r12 - 1];
                const subTag = TAIYI_81_SUB_LABELS[baseNum] || "";
                const palacePosText = subTag.replace(/[()]/g, "");

                const cell = document.createElement("div");
                cell.className = "taiyi-81-cell";
                cell.dataset.pos = baseNum;
                cell.dataset.val = currentVal;
                cell.title = `数值: ${currentVal} (第${juIndex + 1}矩)\n落宫位次: ${palace.name} ${palacePosText}\n地支: ${branch.name}位 (${branch.system})`;

                cell.innerHTML = `
                    <div class="cell-num" style="font-size: ${currentVal >= 10000 ? '13px' : (currentVal >= 1000 ? '15.5px' : '18px')};">${currentVal}</div>
                    <div class="cell-sub" style="font-size: 10.5px; display: flex; gap: 2px; align-items: center; justify-content: center; line-height: 1.1;">
                        <span style="opacity: 0.85;">${palacePosText}</span>
                        <span style="color: ${branch.color}; font-weight: 900;">${branch.name}</span>
                    </div>
                `;

                if (activeRem81 && baseNum === activeRem81) {
                    cell.classList.add("active-pos");
                }

                cell.addEventListener("click", () => {
                    numInput.value = currentVal;
                    calculatePipeline(currentVal);
                });

                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    function switchJuTier(ju, activeRem = null) {
        currentJu = Math.max(0, parseInt(ju, 10) || 0);

        // 更新按钮激活状态
        document.querySelectorAll(".ju-tier-btn").forEach(btn => {
            const bJu = btn.dataset.ju;
            if (bJu === "auto") {
                btn.classList.toggle("active", currentJu > 3);
            } else {
                btn.classList.toggle("active", parseInt(bJu, 10) === currentJu);
            }
        });

        // 更新徽章文本 (无跳跃动画，保持静态稳定)
        if (currentJuBadge) {
            const startVal = currentJu * 81 + 1;
            const endVal = (currentJu + 1) * 81;
            currentJuBadge.innerText = `第 ${currentJu + 1} 矩 (${startVal}~${endVal})`;
        }

        // 更新“N所在矩”按钮文字
        if (btnJuCurrentN) {
            const nJu = Math.floor((activeDeductionN - 1) / 81);
            btnJuCurrentN.innerText = `N所在矩(第${nJu + 1}矩)`;
            btnJuCurrentN.title = `切回 N = ${activeDeductionN} 所在矩 (第 ${nJu + 1} 矩)`;
        }

        // 阵图时空跃迁波动动效
        if (matrixContainer) {
            matrixContainer.classList.remove("matrix-shift-anim");
            void matrixContainer.offsetWidth;
            matrixContainer.classList.add("matrix-shift-anim");
        }

        const targetRem = activeRem !== null ? activeRem : (activeDeductionN % 81 === 0 ? 81 : activeDeductionN % 81);
        renderLuoshuTaiyi9x9Matrix(currentJu, targetRem);
    }

    function setupJuTierControls() {
        document.querySelectorAll(".ju-tier-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                this.classList.add("row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);

                const bJu = this.dataset.ju;
                if (bJu === "auto") {
                    const nJu = Math.floor((activeDeductionN - 1) / 81);
                    switchJuTier(nJu);
                } else {
                    switchJuTier(parseInt(bJu, 10));
                }
            });
        });
    }

    setupJuTierControls();
    switchJuTier(0);

    function getDigitalRoot(n) {
        let val = Math.abs(n);
        while (val >= 10) {
            val = val.toString().split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
        }
        return val;
    }

    function calculatePipeline(n) {
        const inputVal = parseInt(n, 10);
        if (isNaN(inputVal) || inputVal <= 0) return;

        activeDeductionN = inputVal;
        const rem81 = inputVal % 81 === 0 ? 81 : inputVal % 81;
        const rem12 = inputVal % 12 === 0 ? 12 : inputVal % 12;
        const branch = EARTHLY_BRANCHES[rem12 - 1];
        const digRoot = getDigitalRoot(inputVal);
        const subTag = TAIYI_81_SUB_LABELS[rem81] || "";

        // 根据输入的 N 自动动态切换至该数字所在的矩数
        const nJu = Math.floor((inputVal - 1) / 81);
        switchJuTier(nJu, rem81);

        document.getElementById("val-step-1").innerText = `N = ${inputVal}`;
        document.getElementById("val-step-2").innerText = `${inputVal} % 81 = ${rem81} -> ${getPalacePosDesc(rem81)}`;
        document.getElementById("val-step-3").innerText = `余 ${rem12} -> ${branch.name}位`;
        
        const step4El = document.getElementById("val-step-4");
        step4El.innerText = `${branch.system}`;
        step4El.className = "step-val " + (branch.rem % 3 === 1 ? "badge-red" : (branch.rem % 3 === 2 ? "badge-green" : "badge-blue"));

        document.getElementById("val-step-5").innerText = `众和极数 = ${digRoot}`;

        let tableHtml = "";
        for (let k = 1; k <= 12; k++) {
            const val = inputVal * k;
            const r12 = val % 12 === 0 ? 12 : val % 12;
            const b = EARTHLY_BRANCHES[r12 - 1];
            tableHtml += `
                <tr class="interactive-row" data-k="${k}" data-val="${val}" data-branch="${r12 - 1}">
                    <td class="interactive-cell">${k}</td>
                    <td class="interactive-cell">${inputVal}×${k}</td>
                    <td class="interactive-cell"><strong style="color:#ffe066;">${val}</strong></td>
                    <td class="interactive-cell">${r12}</td>
                    <td class="interactive-cell" style="color:${b.color}; font-weight:700;">${b.name}</td>
                    <td class="interactive-cell">${b.system.split('(')[0]}</td>
                </tr>
            `;
        }
        seqTableBody.innerHTML = tableHtml;

        engine.renderNumber12StepTrajectory(inputVal);

        bindTableEvents(inputVal);

        pipeBadgeTitle.innerText = `数值 ${inputVal} 3D 周天空间轨迹`;
        pipeBadgeDesc.innerText = `模 81 降维落于第 ${rem81} 宫 ${subTag}。地支属【${branch.name}】(${branch.system})`;
    }

    // 绑定 N x k 表格行/单格点击 (使用受好评的 rowBounceShake 弹簧震荡晃动 + Toggle Off)
    function bindTableEvents(inputVal) {
        if (!seqTableBody) return;

        seqTableBody.querySelectorAll(".interactive-row").forEach(tr => {
            tr.addEventListener("click", function() {
                const isAlreadyActive = this.classList.contains("active-row");
                seqTableBody.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));

                if (isAlreadyActive) {
                    // 取消选中：恢复 N 本身所在的矩数，并重新绘制全量 12 步 3D 轨迹
                    const nJu = Math.floor((inputVal - 1) / 81);
                    const nRem81 = inputVal % 81 === 0 ? 81 : inputVal % 81;
                    const nRem12 = inputVal % 12 === 0 ? 12 : inputVal % 12;
                    const branch = EARTHLY_BRANCHES[nRem12 - 1];
                    const subTag = TAIYI_81_SUB_LABELS[nRem81] || "";
                    switchJuTier(nJu, nRem81);
                    engine.renderNumber12StepTrajectory(inputVal);
                    if (pipeBadgeTitle) pipeBadgeTitle.innerText = `数值 ${inputVal} 3D 周天空间轨迹`;
                    if (pipeBadgeDesc) pipeBadgeDesc.innerText = `模 81 降维落于第 ${nRem81} 宫 ${subTag}。地支属【${branch.name}】(${branch.system})`;
                    return;
                }

                this.classList.add("active-row");
                this.classList.add("row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);

                const bIdx = parseInt(this.dataset.branch, 10);
                const val = parseInt(this.dataset.val, 10);
                const k = this.dataset.k;
                const rem81 = val % 81 === 0 ? 81 : val % 81;
                const branch = EARTHLY_BRANCHES[bIdx];
                const subTag = TAIYI_81_SUB_LABELS[rem81] || "";

                // 核心修复：自动时空跃迁切换至该乘积所在真实矩数，并高亮该位置！
                const valJu = Math.floor((val - 1) / 81);
                switchJuTier(valJu, rem81);

                engine.highlightSingleBranch(bIdx);

                if (pipeBadgeTitle) pipeBadgeTitle.innerText = `第 ${k} 步: ${inputVal}×${k} = ${val} -> ${branch.name}位`;
                if (pipeBadgeDesc) pipeBadgeDesc.innerText = `乘积 ${val} 跃迁至第 ${valJu + 1} 矩 (${valJu * 81 + 1}~${(valJu + 1) * 81})，落于第 ${rem81} 宫 ${subTag}，归【${branch.name}位】(${branch.system})`;
            });
        });
    }

    // 5 步拆解推演流水线动画执行逻辑 (步步高亮 + 侧向弹簧晃动震荡)
    function animate5StepsDeduction() {
        const steps = [1, 2, 3, 4, 5];
        let currentStep = 0;

        steps.forEach(s => {
            const el = document.getElementById(`step-box-${s}`);
            if (el) el.classList.remove("active", "row-click-flash");
        });

        stepAnimationTimer = setInterval(() => {
            if (currentStep > 0) {
                const prevEl = document.getElementById(`step-box-${steps[currentStep - 1]}`);
                if (prevEl) prevEl.classList.remove("row-click-flash");
            }

            if (currentStep < steps.length) {
                const stepNum = steps[currentStep];
                const curEl = document.getElementById(`step-box-${stepNum}`);
                if (curEl) {
                    curEl.classList.add("active", "row-click-flash");
                }
                currentStep++;
            } else {
                clearInterval(stepAnimationTimer);
                stepAnimationTimer = null;
            }
        }, 450);
    }

    // 绑定 5 步推演流水线卡片独立点击联动 (支持反向点击联动太乙九宫与取消)
    [1, 2, 3, 4, 5].forEach(s => {
        const el = document.getElementById(`step-box-${s}`);
        if (!el) return;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
            const isAlreadyActive = el.classList.contains("active");
            [1, 2, 3, 4, 5].forEach(i => {
                const box = document.getElementById(`step-box-${i}`);
                if (box) box.classList.remove("active", "row-click-flash");
            });

            if (isAlreadyActive) {
                // 取消选中，恢复全量轨迹与默认阵图
                calculatePipeline(activeDeductionN);
                return;
            }

            el.classList.add("active", "row-click-flash");
            setTimeout(() => el.classList.remove("row-click-flash"), 450);

            const n = activeDeductionN;
            const rem81 = n % 81 === 0 ? 81 : n % 81;
            const rem12 = n % 12 === 0 ? 12 : n % 12;
            const branch = EARTHLY_BRANCHES[rem12 - 1];
            const nJu = Math.floor((n - 1) / 81);

            // 切换到 N 所在矩
            switchJuTier(nJu, rem81);

            if (s === 1 || s === 2) {
                engine.highlightSingleBranch(rem12 - 1);
                if (pipeBadgeTitle) pipeBadgeTitle.innerText = `第 ${s} 步 · 数值 ${n} -> 归入太乙第 ${rem81} 宫`;
                if (pipeBadgeDesc) pipeBadgeDesc.innerText = `该数落于第 ${nJu + 1} 矩 (${nJu * 81 + 1}~${(nJu + 1) * 81})，${getPalacePosDesc(rem81)}。`;
            } else if (s === 3 || s === 4) {
                engine.highlightSingleBranch(rem12 - 1);
                if (pipeBadgeTitle) pipeBadgeTitle.innerText = `第 ${s} 步 · 12地支定位 -> 【${branch.name}位】(${branch.system})`;
                if (pipeBadgeDesc) pipeBadgeDesc.innerText = `模 12 余 ${rem12} 严格定域在 ${branch.system}，天体坐标系精确收敛。`;
            } else if (s === 5) {
                const root = getDigitalRoot(n);
                if (pipeBadgeTitle) pipeBadgeTitle.innerText = `第 5 步 · 众和极数 -> 【${root}】`;
                if (pipeBadgeDesc) pipeBadgeDesc.innerText = `原著数理法则：大数连续累加为单数字，数字根为 ${root}。`;
            }
        });
    });

    // 实时监听输入更改 (手动输入数字时自动实时更新推演与 3D 轨迹)
    if (numInput) {
        numInput.addEventListener("input", function() {
            const val = parseInt(this.value, 10);
            if (!isNaN(val) && val > 0) {
                calculatePipeline(val);
            }
        });
        numInput.addEventListener("keyup", function(e) {
            if (e.key === "Enter") {
                calculatePipeline(this.value);
                animate5StepsDeduction();
            }
        });
    }

    // 按钮点击：推演数理 / 再次点击取消 (Toggle Off)
    if (btnCalculate) {
        btnCalculate.addEventListener("click", () => {
            isDeductionRunning = !isDeductionRunning;

            if (isDeductionRunning) {
                btnCalculate.innerText = "结束推演 (再点取消)";
                btnCalculate.style.background = "linear-gradient(135deg, #ff5252 0%, #c92a2a 100%)";
                btnCalculate.style.color = "#ffffff";

                calculatePipeline(numInput.value);
                animate5StepsDeduction();
            } else {
                if (stepAnimationTimer) {
                    clearInterval(stepAnimationTimer);
                    stepAnimationTimer = null;
                }
                btnCalculate.innerText = "推演数理 (点击启动)";
                btnCalculate.style.background = "linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)";
                btnCalculate.style.color = "#0a0e17";

                // 重置 / 清除 5 步高亮
                [1, 2, 3, 4, 5].forEach(s => {
                    const el = document.getElementById(`step-box-${s}`);
                    if (el) el.classList.remove("active", "row-click-flash");
                });

                calculatePipeline(numInput.value);
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

    calculatePipeline(70000);
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
