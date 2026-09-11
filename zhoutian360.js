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
    1: { 
        name: "赤标一宫 (坎一水)", 
        sys: "赤道(天)",
        color: "#ff5252",
        baseSeq: [1, 10, 19, 28, 37, 46, 55, 64, 73], 
        desc: "原书 P241 【附表·赤标一宫】：1 行纵横进数为 9，2 行纵横进数为 90，3 行为 171... 自第 2 行 10 履卦之数起纵横衍进，纪得周天 90°(一象限)，主坎水阳气初萌。" 
    },
    4: { 
        name: "赤标四宫 (巽四木)", 
        sys: "赤道(天)",
        color: "#ff5252",
        baseSeq: [4, 13, 22, 31, 40, 49, 58, 67, 76], 
        desc: "原书 P242 【附表·赤标四宫】：1 行纵横进数为 36，2 行为 117，3 行为 198... 尽为 81 之矩数，总揽周天太虚 360° 之气数，主巽风申布齐洁。" 
    },
    7: { 
        name: "赤标七宫 (兑七金)", 
        sys: "赤道(天)",
        color: "#ff5252",
        baseSeq: [7, 16, 25, 34, 43, 52, 61, 70, 79], 
        desc: "原书 P242 【附表·赤标七宫】：1 行纵横进数为 63，2 行为 144，3 行为 225... 是既济(63九₇)之卦，应周天 630°，使人物得天时之节而亨通。" 
    },
    2: { 
        name: "黄标二宫 (坤二土)", 
        sys: "黄道(地)",
        color: "#40c057",
        baseSeq: [2, 11, 20, 29, 38, 47, 56, 65, 74], 
        desc: "原书 P243 【附表·黄标二宫】：1 行进数为 18，2 行为 99，3 行为 180... 以 180° 逐位衍进，形成天周大圆之直径，以见阴阳两判天地定位之局。" 
    },
    5: { 
        name: "黄标五宫 (中五土)", 
        sys: "黄道(地)",
        color: "#40c057",
        baseSeq: [5, 14, 23, 32, 41, 50, 59, 68, 77], 
        desc: "原书 P243 【附表·黄标五宫】：1 行进数为 45，2 行为 126，3 行为 207... 是黄赤相交之萃卦 45九₅，以 450° 逐位衍进，分初中终三气，中五之极临制四方。" 
    },
    8: { 
        name: "黄标八宫 (艮八土)", 
        sys: "黄道(地)",
        color: "#40c057",
        baseSeq: [8, 17, 26, 35, 44, 53, 62, 71, 80], 
        desc: "原书 P244 【附表·黄标八宫】：1 行进数为 72，2 行为 153，3 行为 234... 以 720° 逐位衍进，水纪周天 2 倍之数 (720 = 360 × 2)，天地合纪，阴阳互涵。" 
    },
    3: { 
        name: "白标三宫 (震三木)", 
        sys: "白道(人)",
        color: "#4dabf7",
        baseSeq: [3, 12, 21, 30, 39, 48, 57, 66, 75], 
        desc: "原书 P244 【附表·白标三宫】：1 行进数为 27，2 行为 108，3 行为 189... 以 270° 逐位衍进，以见 27九₃ 之颐卦，全得天度以养也，万物生发。" 
    },
    6: { 
        name: "白标六宫 (乾六金)", 
        sys: "白道(人)",
        color: "#4dabf7",
        baseSeq: [6, 15, 24, 33, 42, 51, 60, 69, 78], 
        desc: "原书 P245 【附表·白标六宫】：1 行进数为 54，2 行为 135，3 行为 216... 是归妹(54九₆)之卦，以 540° 逐位衍进，应周天 6 个 90°，天地之大义，人之终始。" 
    },
    9: { 
        name: "白标九宫 (离九火)", 
        sys: "白道(人)",
        color: "#4dabf7",
        baseSeq: [9, 18, 27, 36, 45, 54, 63, 72, 81], 
        desc: "原书 P245 【附表·白标九宫】：1 行进数为 81，2 行为 162，3 行为 243... 9 宫为总枢，方数 81 矩总摄，以 810° 逐位衍进，天地成规，万数归宗。" 
    }
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

// 球面大圆贴球流线插值 (Geodesic Arc Slerp)
function getGreatCircleArcPoints(p1, p2, radius = 6.0, segments = 20) {
    const v1 = p1.clone().normalize();
    const v2 = p2.clone().normalize();
    const dot = Math.max(-1, Math.min(1, v1.dot(v2)));
    if (dot > 0.9999) return [p1.clone()];

    const pts = [];
    if (dot < -0.9999) {
        const perp = Math.abs(v1.z) < 0.9 
            ? new THREE.Vector3(0, 0, 1).cross(v1).normalize() 
            : new THREE.Vector3(1, 0, 0).cross(v1).normalize();
        for (let i = 0; i <= segments; i++) {
            const angle = Math.PI * (i / segments);
            const p = v1.clone().multiplyScalar(Math.cos(angle)).add(perp.clone().multiplyScalar(Math.sin(angle))).multiplyScalar(radius * 1.01);
            pts.push(p);
        }
        return pts;
    }

    const qStart = new THREE.Quaternion();
    const qEnd = new THREE.Quaternion().setFromUnitVectors(v1, v2);

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const qCur = new THREE.Quaternion();
        THREE.Quaternion.slerp(qStart, qEnd, qCur, t);
        const p = v1.clone().applyQuaternion(qCur).multiplyScalar(radius * 1.01);
        pts.push(p);
    }
    return pts;
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

        this.frameworkGroup = new THREE.Group();
        this.equatorGroup = new THREE.Group();
        this.eclipticGroup = new THREE.Group();
        this.lunarGroup = new THREE.Group();
        this.celestialGridGroup = new THREE.Group();
        this.orbsGroup = new THREE.Group();
        this.trajectoryGroup = new THREE.Group();

        this.autoRotate = true;

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

        // 1. 地平基准大环 (Horizon Ring，外层水平大圆，稳固大地水平坐标)
        const horizonGeom = new THREE.TorusGeometry(frameRadius, 0.055, 12, 120);
        const horizonMesh = new THREE.Mesh(horizonGeom, frameMat);
        this.frameworkGroup.add(horizonMesh);

        // 2. 子午立双环 (Meridian Dual Rings，立于 YZ 垂直面，贯通南北极轴)
        const meridianGeom1 = new THREE.TorusGeometry(frameRadius, 0.05, 12, 120);
        const meridianMesh1 = new THREE.Mesh(meridianGeom1, frameMat);
        meridianMesh1.rotation.y = Math.PI / 2;
        this.frameworkGroup.add(meridianMesh1);

        const meridianGeom2 = new THREE.TorusGeometry(frameRadius * 0.98, 0.035, 12, 120);
        const meridianMesh2 = new THREE.Mesh(meridianGeom2, frameMat);
        meridianMesh2.rotation.y = Math.PI / 2;
        this.frameworkGroup.add(meridianMesh2);

        // 3. 四方地平天标 (正东、正南、正西、正北)
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

        // 4. 中黄地核球 (Terra Core，象征“浑天如鸡子，地如卵中黄”)
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

    clearTrajectoryGroup() {
        while (this.trajectoryGroup.children.length > 0) {
            const obj = this.trajectoryGroup.children[0];
            this.trajectoryGroup.remove(obj);
        }
    }

    // 沿天球表面大圆弧线绘制闭合/有序连线
    renderPointsAlongArcs(pointList, colorHex = 0xffe066, isDashed = false) {
        this.clearTrajectoryGroup();
        if (!pointList || pointList.length < 2) return;

        const arcPoints = [];
        for (let i = 0; i < pointList.length - 1; i++) {
            const arc = getGreatCircleArcPoints(pointList[i], pointList[i + 1], 6.0, 18);
            if (i > 0) arc.shift();
            arcPoints.push(...arc);
        }

        const geom = new THREE.BufferGeometry().setFromPoints(arcPoints);
        let line;
        if (isDashed) {
            const mat = new THREE.LineDashedMaterial({ color: colorHex, dashSize: 0.35, gapSize: 0.15, linewidth: 2.5 });
            line = new THREE.Line(geom, mat);
            line.computeLineDistances();
        } else {
            const mat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 2.5 });
            line = new THREE.Line(geom, mat);
        }
        this.trajectoryGroup.add(line);
    }

    render4XiangSquare() {
        const branchIndices = [5, 6, 9, 11]; // 巳(5)、午(6)、酉(9)、亥(11)
        const pts = branchIndices.map(i => getBranch3DPos(i));
        pts.push(pts[0]);
        this.renderPointsAlongArcs(pts, 0xffe066, false);
    }

    render60JieHexagon() {
        const branchIndices = [0, 2, 4, 6, 8, 10]; // 子, 寅, 辰, 午, 申, 戌
        const pts = branchIndices.map(i => getBranch3DPos(i));
        pts.push(pts[0]);
        this.renderPointsAlongArcs(pts, 0x40c057, true);
    }

    // 单个地支高亮：升级为“浑天同心耀金灵光环” (告别粗笨大实心白球)
    highlightSingleBranch(bIdx) {
        this.clearTrajectoryGroup();
        const pos = getBranch3DPos(bIdx);

        // 1. 核心星光发光点
        const starGeom = new THREE.SphereGeometry(0.14, 16, 16);
        const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const starMesh = new THREE.Mesh(starGeom, starMat);
        starMesh.position.copy(pos);
        this.trajectoryGroup.add(starMesh);

        // 2. 悬浮面向相机的双重同心光晕环 (准星聚焦仪轨)
        const ringGeom = new THREE.TorusGeometry(0.46, 0.03, 12, 48);
        const ringMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.85 });
        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.position.copy(pos);
        if (this.camera) ringMesh.quaternion.copy(this.camera.quaternion);
        this.trajectoryGroup.add(ringMesh);

        const outerRingGeom = new THREE.TorusGeometry(0.68, 0.02, 12, 48);
        const outerRingMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.4 });
        const outerRingMesh = new THREE.Mesh(outerRingGeom, outerRingMat);
        outerRingMesh.position.copy(pos);
        if (this.camera) outerRingMesh.quaternion.copy(this.camera.quaternion);
        this.trajectoryGroup.add(outerRingMesh);
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

    const currentJuBadge = document.getElementById("current-ju-badge");
    const btnJuCurrentN = document.getElementById("btn-ju-current-n");

    let currentJu = 0; // 当前矩数 (0=第1矩, 1=第2矩...)
    let currentActiveVal = 1; // 当前选中的数值
    let currentActivePalace = "1"; // 当前选中的宫位 (1~9)
    let currentActivePositions = [1]; // 当前高亮的太乙宫位数组
    let currentFocusedCell = 1; // 当前聚焦单格
    let activeOverrideMap = {}; // 覆盖特定单元格显示大数值 { [pos]: val }

    // 渲染太乙 81 宫阵图 (支持多重矩数、无括号位次、三道色彩地支与多点聚焦)
    function renderLuoshuTaiyi9x9Matrix(juIndex = 0, activePositions = [], focusedPos = null, overrideMap = {}) {
        if (!matrixContainer) return;
        matrixContainer.className = "luoshu-taiyi-9x9-container";
        matrixContainer.innerHTML = "";

        LUOSHU_PALACES_EXACT.forEach(palace => {
            const block = document.createElement("div");
            block.className = `palace-block ${palace.class}`;
            block.dataset.palaceNum = palace.num;
            
            const title = document.createElement("div");
            title.className = "palace-block-title";
            title.innerText = palace.name;
            block.appendChild(title);

            const grid3x3 = document.createElement("div");
            grid3x3.className = "palace-grid-3x3";

            palace.numbers.forEach(baseNum => {
                const currentVal = overrideMap[baseNum] !== undefined ? overrideMap[baseNum] : (baseNum + juIndex * 81);
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

                // 多点高亮状态
                if (activePositions.includes(baseNum)) {
                    cell.classList.add("active-pos");
                }

                // 核心单点聚焦流金光效
                if (focusedPos === baseNum) {
                    cell.style.boxShadow = "0 0 16px rgba(255, 215, 0, 0.95), inset 0 0 10px rgba(255, 215, 0, 0.4)";
                    cell.style.borderColor = "#ffd700";
                    cell.classList.add("row-click-flash");
                    setTimeout(() => cell.classList.remove("row-click-flash"), 450);
                }

                // 点击单元格：反向联动右侧表格
                cell.addEventListener("click", () => {
                    handleTaiyiCellClick(baseNum, currentVal, palace, palacePosText, branch);
                });

                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    // 切换矩度控制栏
    function switchJuTier(ju, targetActivePositions = null, focusedPos = null, overrideMap = {}) {
        currentJu = Math.max(0, parseInt(ju, 10) || 0);
        activeOverrideMap = overrideMap;

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
            const nJu = Math.floor((currentActiveVal - 1) / 81);
            btnJuCurrentN.innerText = `N所在矩(第${nJu + 1}矩)`;
            btnJuCurrentN.title = `切回 数值 ${currentActiveVal} 所在矩 (第 ${nJu + 1} 矩)`;
        }

        // 阵图时空跃迁波动动效
        if (matrixContainer) {
            matrixContainer.classList.remove("matrix-shift-anim");
            void matrixContainer.offsetWidth;
            matrixContainer.classList.add("matrix-shift-anim");
        }

        const positions = targetActivePositions !== null ? targetActivePositions : currentActivePositions;
        const focus = focusedPos !== null ? focusedPos : currentFocusedCell;
        renderLuoshuTaiyi9x9Matrix(currentJu, positions, focus, activeOverrideMap);
    }

    function setupJuTierControls() {
        document.querySelectorAll(".ju-tier-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                this.classList.add("row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);

                const bJu = this.dataset.ju;
                if (bJu === "auto") {
                    const nJu = Math.floor((currentActiveVal - 1) / 81);
                    switchJuTier(nJu, [currentFocusedCell], currentFocusedCell, { [currentFocusedCell]: currentActiveVal });
                } else {
                    const parsedJu = parseInt(bJu, 10);
                    switchJuTier(parsedJu, [currentFocusedCell], currentFocusedCell);
                }
            });
        });
    }

    // 中间太乙阵图点击 -> 反查右侧表格并高亮全部对应项 (再次点击取消选中)
    function handleTaiyiCellClick(baseNum, currentVal, palace, palacePosText, branch) {
        if (currentActivePositions.length === 1 && currentActivePositions[0] === baseNum) {
            currentActivePositions = [];
            currentFocusedCell = null;
            document.querySelectorAll(".taiyi-81-cell").forEach(c => {
                c.classList.remove("active-pos");
                c.style.boxShadow = "";
                c.style.borderColor = "";
            });
            document.querySelectorAll(".prod-cell, .base-num-cell, .carry-cell").forEach(td => {
                td.classList.remove("active-cell");
            });
            document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
            engine.clearTrajectoryGroup();
            if (badgeTitle) badgeTitle.innerText = "太乙九宫八十一宫阵图 (已取消选中)";
            if (badgeDesc) badgeDesc.innerText = "点击任意单元格，反向全息映射右侧表格与 3D 浑天坐标。";
            return;
        }

        currentActivePositions = [baseNum];
        currentFocusedCell = baseNum;
        currentActiveVal = currentVal;

        document.querySelectorAll(".taiyi-81-cell").forEach(c => {
            const isMatch = parseInt(c.dataset.pos, 10) === baseNum;
            c.classList.toggle("active-pos", isMatch);
            if (isMatch) {
                c.style.boxShadow = "0 0 16px rgba(255, 215, 0, 0.95), inset 0 0 10px rgba(255, 215, 0, 0.4)";
                c.style.borderColor = "#ffd700";
            } else {
                c.style.boxShadow = "";
                c.style.borderColor = "";
            }
        });

        const r12 = currentVal % 12 === 0 ? 12 : currentVal % 12;
        engine.highlightSingleBranch(r12 - 1);

        let matchCount = 0;
        document.querySelectorAll(".prod-cell, .base-num-cell, .carry-cell").forEach(td => {
            const tdVal = parseInt(td.dataset.val, 10);
            const tdRem81 = tdVal % 81 === 0 ? 81 : tdVal % 81;
            if (tdRem81 === baseNum) {
                td.classList.add("active-cell");
                matchCount++;
            } else {
                td.classList.remove("active-cell");
            }
        });

        if (badgeTitle) {
            badgeTitle.innerText = `太乙 ${palace.name} ${palacePosText} (第 ${baseNum} 宫) -> 反向匹配右表 ${matchCount} 处`;
        }
        if (badgeDesc) {
            badgeDesc.innerText = `当前格数值 ${currentVal} | 地支属【${branch.name}位 (${branch.system})】 | 对应洛书第 ${palace.num} 宫本位。`;
        }
    }

    // 渲染原书《九宫纪周天(360°)气数一览大表》 (P241-245 9 大表与进位数)
    function renderZhoutian360MasterTable(palaceKey = "1") {
        currentActivePalace = palaceKey;
        const tableHead = document.getElementById("zt-table-head");
        const tableBody = document.getElementById("zt-table-body");
        const tableTitle = document.getElementById("zt-table-title");

        if (!tableHead || !tableBody) return;
        tableHead.innerHTML = "";
        tableBody.innerHTML = "";

        const pNum = parseInt(palaceKey, 10) || 1;
        const pInfo = ZHOUTIAN_360_PALACES_INFO[pNum] || ZHOUTIAN_360_PALACES_INFO[1];

        if (tableTitle) {
            tableTitle.innerText = `原书【${pInfo.name}】周天 360° 气数矩阵大表 (${pInfo.sys})`;
        }

        if (ztBanner) {
            ztBanner.innerHTML = `
                <div style="font-size:13px; font-weight:800; color:${pInfo.color};">
                    原著【${pInfo.name}】周天 360° 气数解构 · ${pInfo.sys}
                </div>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px; line-height:1.4;">
                    ${pInfo.desc}
                </div>
            `;
        }

        const seq = pInfo.baseSeq;

        // 默认初始化太乙九宫：不默认涂满整宫黄色高光，保持视野清爽；当用户点击表格行或格时精准点亮
        currentActivePositions = [];
        currentFocusedCell = null;
        currentActiveVal = seq[0];
        switchJuTier(0, [], null);

        // 构建原书表头：0 / 基数, s1, s2, ..., s9, 进位数
        const trHead = document.createElement("tr");
        let headHtml = `<th style="color:#ffe066; font-size:12px; cursor:pointer;" title="点击切换整宫9数全息高亮/取消">0 / 基数</th>`;
        seq.forEach(colVal => {
            const sub = (TAIYI_81_SUB_LABELS[colVal] || "").replace(/[()]/g, "");
            headHtml += `
                <th class="interactive-th" data-col="${colVal}" style="cursor:pointer;" title="点击联动第 ${colVal} 列 9 数">
                    <div class="th-cell-base">${colVal}</div>
                    <div class="th-cell-sub">${sub}</div>
                </th>
            `;
        });
        headHtml += `<th style="color:#ff5252; font-size:12px; cursor:pointer;" title="点击高亮全行进位数">进位数</th>`;
        trHead.innerHTML = headHtml;
        tableHead.appendChild(trHead);

        // 表头列点击事件 (支持点击高亮列与再次点击取消)
        trHead.querySelectorAll(".interactive-th").forEach(th => {
            th.addEventListener("click", () => {
                const isThActive = th.classList.contains("active-th");
                trHead.querySelectorAll(".interactive-th").forEach(t => {
                    t.classList.remove("active-th");
                    t.style.background = "";
                });
                const firstTh = trHead.querySelector("th");
                if (firstTh) {
                    firstTh.classList.remove("active-th");
                    firstTh.style.background = "";
                }
                document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));
                document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));

                if (isThActive) {
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = `${pInfo.name} 周天 360° 气数矩阵 (已取消选择)`;
                    if (badgeDesc) badgeDesc.innerText = `点击右侧表格任意单元格或行，即可在太乙九宫与 3D 浑天仪中联动定点推演。`;
                    return;
                }

                th.classList.add("active-th");
                th.style.background = "rgba(255, 224, 102, 0.3)";
                const colVal = parseInt(th.dataset.col, 10);
                highlightZtCol(colVal, seq, pInfo);
            });
        });

        // 表头左上角 0/基数 点击 (切换整宫 9 数高亮与取消)
        const firstTh = trHead.querySelector("th");
        if (firstTh) {
            firstTh.addEventListener("click", () => {
                const isFirstActive = firstTh.classList.contains("active-th");
                trHead.querySelectorAll(".interactive-th").forEach(t => {
                    t.classList.remove("active-th");
                    t.style.background = "";
                });
                document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));
                document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));

                if (isFirstActive) {
                    firstTh.classList.remove("active-th");
                    firstTh.style.background = "";
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = `${pInfo.name} 周天 360° 气数矩阵 (已取消选择)`;
                    if (badgeDesc) badgeDesc.innerText = `点击右侧表格任意单元格或行，即可在太乙九宫与 3D 浑天仪中联动定点推演。`;
                } else {
                    firstTh.classList.add("active-th");
                    firstTh.style.background = "rgba(255, 224, 102, 0.35)";
                    currentActivePositions = [...seq];
                    currentFocusedCell = seq[0];
                    switchJuTier(0, seq, seq[0]);
                    if (badgeTitle) badgeTitle.innerText = `${pInfo.name} 9 大基数已在太乙九宫全量定格`;
                    if (badgeDesc) badgeDesc.innerText = `九数: [${seq.join(', ')}]，统摄本宫周天 360° 气数演进。`;
                }
            });
        }

        // 构建 9 行数据
        seq.forEach(rowVal => {
            const tr = document.createElement("tr");
            tr.className = "interactive-row";
            tr.dataset.num = rowVal;

            const rowSub = (TAIYI_81_SUB_LABELS[rowVal] || "").replace(/[()]/g, "");
            let cellsHtml = `
                <td class="interactive-cell base-num-cell" data-row="${rowVal}" data-col="${rowVal}" data-val="${rowVal}" style="font-weight:800; color:#ffe066; background:rgba(212,175,55,0.12);" title="点击聚焦基数 ${rowVal}">
                    <div class="cell-val">${rowVal}</div>
                    <div class="cell-tag" style="color:#ffe066;">${rowSub}</div>
                </td>
            `;

            // 9 列交叉乘积：rowVal × colVal
            seq.forEach(colVal => {
                const prod = rowVal * colVal;
                const rem81 = prod % 81 === 0 ? 81 : prod % 81;
                const cellTag = (TAIYI_81_SUB_LABELS[rem81] || "").replace(/[()]/g, "");
                cellsHtml += `
                    <td class="interactive-cell prod-cell" data-row="${rowVal}" data-col="${colVal}" data-val="${prod}" title="${rowVal} × ${colVal} = ${prod} (模81落第${rem81}宫)">
                        <div class="cell-val">${prod}</div>
                        <div class="cell-tag">${cellTag}</div>
                    </td>
                `;
            });

            // 行末进位数：rowVal × 9
            const rowCarry = rowVal * 9;
            const carryRem81 = rowCarry % 81 === 0 ? 81 : rowCarry % 81;
            const carryTag = (TAIYI_81_SUB_LABELS[carryRem81] || "").replace(/[()]/g, "");
            cellsHtml += `
                <td class="interactive-cell carry-cell" data-row="${rowVal}" data-col="9" data-val="${rowCarry}" style="font-weight:800; color:#ff5252; background:rgba(255,82,82,0.12);" title="进位数 ${rowVal} × 9 = ${rowCarry}">
                    <div class="cell-val">${rowCarry}</div>
                    <div class="cell-tag" style="color:#ff5252;">${carryTag}</div>
                </td>
            `;

            tr.innerHTML = cellsHtml;

            // 行点击事件 (点击行头空白处或整行触发 9 数多点共振，再次点击取消)
            tr.addEventListener("click", (e) => {
                if (e.target.closest(".interactive-cell")) return;

                const isAlreadyActive = tr.classList.contains("active-row");
                document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
                document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));
                trHead.querySelectorAll(".interactive-th").forEach(t => {
                    t.classList.remove("active-th");
                    t.style.background = "";
                });
                const firstTh = trHead.querySelector("th");
                if (firstTh) {
                    firstTh.classList.remove("active-th");
                    firstTh.style.background = "";
                }

                if (isAlreadyActive) {
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = `${pInfo.name} 周天 360° 气数矩阵 (已取消选择)`;
                    if (badgeDesc) badgeDesc.innerText = `点击右侧表格任意单元格或行，即可在太乙九宫与 3D 浑天仪中联动定点推演。`;
                    return;
                }

                tr.classList.add("active-row");
                tr.classList.add("row-click-flash");
                setTimeout(() => tr.classList.remove("row-click-flash"), 450);

                highlightZtRow(rowVal, seq, pInfo);
            });

            // 单格点击事件 (基数格、乘积格、进位格，再次点击取消)
            tr.querySelectorAll(".interactive-cell").forEach(cellTd => {
                cellTd.addEventListener("click", (e) => {
                    e.stopPropagation();

                    const isCellActive = cellTd.classList.contains("active-cell");
                    document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));
                    document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
                    trHead.querySelectorAll(".interactive-th").forEach(t => {
                        t.classList.remove("active-th");
                        t.style.background = "";
                    });
                    const firstTh = trHead.querySelector("th");
                    if (firstTh) {
                        firstTh.classList.remove("active-th");
                        firstTh.style.background = "";
                    }

                    if (isCellActive) {
                        currentActivePositions = [];
                        currentFocusedCell = null;
                        switchJuTier(0, [], null);
                        engine.clearTrajectoryGroup();
                        if (badgeTitle) badgeTitle.innerText = `${pInfo.name} 周天 360° 气数矩阵 (已取消选择)`;
                        if (badgeDesc) badgeDesc.innerText = `点击右侧表格任意单元格或行，即可在太乙九宫与 3D 浑天仪中联动定点推演。`;
                        return;
                    }

                    cellTd.classList.add("active-cell");
                    tr.classList.add("active-row");
                    tr.classList.add("row-click-flash");
                    setTimeout(() => tr.classList.remove("row-click-flash"), 450);

                    const val = parseInt(cellTd.dataset.val, 10);
                    const rVal = parseInt(cellTd.dataset.row, 10);
                    const cVal = parseInt(cellTd.dataset.col, 10);
                    const isCarry = cellTd.classList.contains("carry-cell");

                    highlightZtCell(val, rVal, cVal, pInfo, isCarry);
                });
            });

            tableBody.appendChild(tr);
        });

        // 底端进位数汇总行
        const trBottomCarry = document.createElement("tr");
        trBottomCarry.className = "carry-bottom-row";
        let bottomHtml = `<td style="font-weight:800; color:#ff5252; background:rgba(255,82,82,0.18); cursor:pointer;" title="点击高亮底端进位数列">进位数</td>`;
        seq.forEach(colVal => {
            const colCarry = colVal * 9;
            const carryRem81 = colCarry % 81 === 0 ? 81 : colCarry % 81;
            const carryTag = (TAIYI_81_SUB_LABELS[carryRem81] || "").replace(/[()]/g, "");
            bottomHtml += `
                <td class="interactive-cell carry-cell" data-row="9" data-col="${colVal}" data-val="${colCarry}" style="font-weight:800; color:#ff5252; background:rgba(255,82,82,0.12);" title="底端进位 ${colVal} × 9 = ${colCarry}">
                    <div class="cell-val">${colCarry}</div>
                    <div class="cell-tag" style="color:#ff5252;">${carryTag}</div>
                </td>
            `;
        });
        const cornerCarry = seq[8] * 9;
        const cornerTag = (TAIYI_81_SUB_LABELS[cornerCarry % 81 === 0 ? 81 : cornerCarry % 81] || "").replace(/[()]/g, "");
        bottomHtml += `
            <td class="interactive-cell carry-cell" data-row="9" data-col="9" data-val="${cornerCarry}" style="font-weight:900; color:#ffe066; background:rgba(212,175,55,0.25);" title="角枢进位数 ${seq[8]} × 9 = ${cornerCarry}">
                <div class="cell-val">${cornerCarry}</div>
                <div class="cell-tag" style="color:#ffe066;">${cornerTag}</div>
            </td>
        `;
        trBottomCarry.innerHTML = bottomHtml;

        trBottomCarry.querySelectorAll(".interactive-cell").forEach(cellTd => {
            cellTd.addEventListener("click", (e) => {
                e.stopPropagation();
                const isCellActive = cellTd.classList.contains("active-cell");
                document.querySelectorAll(".interactive-cell").forEach(c => c.classList.remove("active-cell"));
                document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
                trHead.querySelectorAll(".interactive-th").forEach(t => {
                    t.classList.remove("active-th");
                    t.style.background = "";
                });
                const firstTh = trHead.querySelector("th");
                if (firstTh) {
                    firstTh.classList.remove("active-th");
                    firstTh.style.background = "";
                }

                if (isCellActive) {
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = `${pInfo.name} 周天 360° 气数矩阵 (已取消选择)`;
                    if (badgeDesc) badgeDesc.innerText = `点击右侧表格任意单元格或行，即可在太乙九宫与 3D 浑天仪中联动定点推演。`;
                    return;
                }

                cellTd.classList.add("active-cell");
                const val = parseInt(cellTd.dataset.val, 10);
                const rVal = parseInt(cellTd.dataset.row, 10);
                const cVal = parseInt(cellTd.dataset.col, 10);
                highlightZtCell(val, rVal, cVal, pInfo, true);
            });
        });

        tableBody.appendChild(trBottomCarry);
    }

    // 单格联动太乙九宫 (支持任意大数动态跃迁到所在矩、无括号位次、地支高亮)
    function highlightZtCell(val, rowVal, colVal, pInfo, isCarry = false) {
        currentActiveVal = val;
        const degMod = val % 360;
        const rem81 = val % 81 === 0 ? 81 : val % 81;
        const rem12 = val % 12 === 0 ? 12 : val % 12;
        const branch = EARTHLY_BRANCHES[rem12 - 1];
        const subTag = (TAIYI_81_SUB_LABELS[rem81] || "").replace(/[()]/g, "");
        const nJu = Math.floor((val - 1) / 81);

        currentActivePositions = [rem81];
        currentFocusedCell = rem81;

        // 动态自适应跳转至大数所在的真实矩数，并覆盖当前格的值以呈现大数
        const overrideMap = { [rem81]: val };
        switchJuTier(nJu, [rem81], rem81, overrideMap);

        // 3D 浑天仪联动
        engine.highlightSingleBranch(rem12 - 1);

        let formulaText = "";
        if (isCarry) {
            formulaText = `进位数: ${rowVal === 9 ? colVal : rowVal} × 9 = ${val}`;
        } else if (rowVal === colVal && rowVal === val) {
            formulaText = `基数: ${val}`;
        } else {
            formulaText = `算式: ${rowVal} × ${colVal} = ${val}`;
        }

        if (badgeTitle) {
            badgeTitle.innerText = `${formulaText} -> 第 ${rem81} 宫 ${subTag}`;
        }
        if (badgeDesc) {
            badgeDesc.innerText = `所在矩: 第 ${nJu + 1} 矩 (${nJu * 81 + 1}~${(nJu + 1) * 81}) | 地支: 【${branch.name}位 (${branch.system})】 | 周天模 360° 余 ${degMod}°`;
        }
    }

    // 整行联动太乙九宫 (9 个乘积全息多点点亮)
    function highlightZtRow(rowVal, seq, pInfo) {
        const prodVals = seq.map(colVal => rowVal * colVal);
        const rem81List = prodVals.map(v => v % 81 === 0 ? 81 : v % 81);
        const rem12List = prodVals.map(v => v % 12 === 0 ? 12 : v % 12);
        
        currentActivePositions = rem81List;
        currentFocusedCell = rem81List[0];
        currentActiveVal = prodVals[0];

        const allSameBranch = rem12List.every(r => r === rem12List[0]);
        const sampleBranch = EARTHLY_BRANCHES[rem12List[0] - 1];

        // 太乙九宫同时高亮这 9 个宫位，并确保矩数控制器与徽章同步更新
        switchJuTier(0, rem81List, rem81List[0]);

        // 3D 浑天仪绘制 9 数环周连线 (沿天球表面大圆弧线)
        const pts = rem12List.map(r => getBranch3DPos(r - 1));
        if (pts.length > 0) {
            pts.push(pts[0]);
            engine.renderPointsAlongArcs(pts, 0xffe066);
        }

        if (badgeTitle) {
            badgeTitle.innerText = `第 ${rowVal} 行 9 数全息共振 -> 太乙九宫 ${rem81List.length} 宫同频映射`;
        }
        if (badgeDesc) {
            if (allSameBranch) {
                badgeDesc.innerText = `天象铁证：该行所有乘积地支恒为【${sampleBranch.name}位 (${sampleBranch.system})】，纯一收敛！`;
            } else {
                badgeDesc.innerText = `9 数落宫: [${rem81List.join(', ')}]，统摄周天气数。`;
            }
        }
    }

    // 纵列联动太乙九宫
    function highlightZtCol(colVal, seq, pInfo) {
        const prodVals = seq.map(rowVal => rowVal * colVal);
        const rem81List = prodVals.map(v => v % 81 === 0 ? 81 : v % 81);

        currentActivePositions = rem81List;
        currentFocusedCell = rem81List[0];
        currentActiveVal = prodVals[0];

        switchJuTier(0, rem81List, rem81List[0]);

        if (badgeTitle) {
            badgeTitle.innerText = `第 ${colVal} 列 9 数全息展开 -> 太乙九宫多点分布`;
        }
        if (badgeDesc) {
            badgeDesc.innerText = `纵列倍积九数分布于太乙九宫，落宫: [${rem81List.join(', ')}]。`;
        }
    }

    // 绑定 3x3 九宫切换按钮组
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

    // 5 大解构表格 Tab 切换逻辑 (完美驱动中间太乙九宫联动)
    function switchTablePanel(targetId) {
        tabBtns.forEach(b => b.classList.toggle("active", b.dataset.target === targetId));
        contentPanels.forEach(p => p.style.display = p.id === targetId ? "block" : "none");

        if (targetId === "panel-table-5") {
            renderZhoutian360MasterTable(currentActivePalace || "1");
        } else if (targetId === "panel-table-1") {
            if (badgeTitle) badgeTitle.innerText = "表1 · 4 象 90° 质变与 4 个 81 矩映射表";
            if (badgeDesc) badgeDesc.innerText = "90° 巳位(地户)、180° 午/未位、270° 酉位、360° 亥位(天门)。点击单行联动太乙阵图。";
            engine.render4XiangSquare();
            currentActivePositions = [81];
            currentFocusedCell = 81;
            switchJuTier(0, [81], 81);
        } else if (targetId === "panel-table-2") {
            if (badgeTitle) badgeTitle.innerText = "表2 · 6 × 60° 节卦六步周转表";
            if (badgeDesc) badgeDesc.innerText = "按黄钟(子)、太簇(寅)、姑洗(辰)、蕤宾(午)、夷则(申)、无射(戌)六步构成 360° 等角大周天。";
            engine.render60JieHexagon();
            const jie6 = [60, 39, 18, 78, 57, 36];
            currentActivePositions = jie6;
            currentFocusedCell = 60;
            switchJuTier(0, jie6, 60);
        } else if (targetId === "panel-table-3") {
            if (badgeTitle) badgeTitle.innerText = "表3 · 81 矩九宫分属完整表";
            if (badgeDesc) badgeDesc.innerText = "12 方位 3 大坐标系全部 81 矩气数在太乙 9 宫完美落位。点击各行查看对应九宫全矩。";
            engine.clearTrajectoryGroup();
            currentActivePositions = [1, 9, 81];
            currentFocusedCell = 1;
            switchJuTier(0, [1, 9, 81], 1);
        } else if (targetId === "panel-table-4") {
            if (badgeTitle) badgeTitle.innerText = "表4 · 360° 连续对半分割归九表";
            if (badgeDesc) badgeDesc.innerText = "360° -> 180° -> 90° -> 45° -> 22.5° -> 11.25° -> 5.625° 众和数恒无条件收敛归于 9！";
            engine.clearTrajectoryGroup();
            const li9All = [9, 18, 27, 36, 45, 54, 63, 72, 81];
            currentActivePositions = li9All;
            currentFocusedCell = 81;
            switchJuTier(0, li9All, 81);
        }
    }

    tabBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            switchTablePanel(this.dataset.target);
        });
    });

    // 表 1 ~ 表 4 各单行点击时，强力驱动中间太乙九宫响应
    function setupSubTablesInteractions() {
        // 表 1：4 象 90° 质变表 (4 行)
        const t1Rows = document.querySelectorAll("#panel-table-1 .interactive-row");
        const t1Map = [
            { deg: 90, ju: 0, val: 81, branchIdx: 5, pos: 81, desc: "第一象 90° · 81 矩 · 巳位(白道地户)" },
            { deg: 180, ju: 1, val: 162, branchIdx: 6, pos: 81, desc: "第二象 180° · 162 矩 · 午/未位(赤道/黄道)" },
            { deg: 270, ju: 2, val: 243, branchIdx: 9, pos: 81, desc: "第三象 270° · 243 矩 · 酉位(赤道正西)" },
            { deg: 360, ju: 3, val: 324, branchIdx: 11, pos: 81, desc: "第四象 360° · 324 矩 · 亥位(白道天门)" }
        ];
        t1Rows.forEach((tr, idx) => {
            tr.addEventListener("click", function() {
                const isAlreadyActive = this.classList.contains("active-row");
                t1Rows.forEach(r => r.classList.remove("active-row"));

                if (isAlreadyActive) {
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = "表1 · 4 象 90° 质变与 4 个 81 矩映射表 (已取消选择)";
                    if (badgeDesc) badgeDesc.innerText = "点击任意单行，联动太乙阵图与 3D 浑天坐标。";
                    return;
                }

                this.classList.add("active-row", "row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);

                const item = t1Map[idx] || t1Map[0];
                currentActiveVal = item.val;
                currentActivePositions = [item.pos];
                currentFocusedCell = item.pos;

                // 切换到对应的矩度并覆盖显示真实矩数值
                switchJuTier(item.ju, [item.pos], item.pos, { [item.pos]: item.val });
                engine.highlightSingleBranch(item.branchIdx);

                if (badgeTitle) badgeTitle.innerText = `表1联动 -> 太乙第 ${item.pos} 宫 (九9) | ${item.desc}`;
                if (badgeDesc) badgeDesc.innerText = `角度: ${item.deg}° | 累积矩数: ${item.val} (第 ${item.ju + 1} 矩) | 坐标系: 【${EARTHLY_BRANCHES[item.branchIdx].name}位】`;
            });
        });

        // 表 2：6 × 60° 节卦表 (6 行)
        const t2Rows = document.querySelectorAll("#panel-table-2 .interactive-row");
        const t2Map = [
            { deg: 60, pos: 60, branchIdx: 0, tone: "黄钟 (子)", desc: "第 1 步 60° -> 太乙第 60 宫 (乾六7)" },
            { deg: 120, pos: 39, branchIdx: 2, tone: "太簇 (寅)", desc: "第 2 步 120° -> 太乙第 39 宫 (震三5)" },
            { deg: 180, pos: 18, branchIdx: 4, tone: "姑洗 (辰)", desc: "第 3 步 180° -> 太乙第 18 宫 (离九2)" },
            { deg: 240, pos: 78, branchIdx: 6, tone: "蕤宾 (午)", desc: "第 4 步 240° -> 太乙第 78 宫 (乾六9)" },
            { deg: 300, pos: 57, branchIdx: 8, tone: "夷则 (申)", desc: "第 5 步 300° -> 太乙第 57 宫 (震三7)" },
            { deg: 360, pos: 36, branchIdx: 10, tone: "无射 (戌)", desc: "第 6 步 360° -> 太乙第 36 宫 (离九4)" }
        ];
        t2Rows.forEach((tr, idx) => {
            tr.addEventListener("click", function() {
                const isAlreadyActive = this.classList.contains("active-row");
                t2Rows.forEach(r => r.classList.remove("active-row"));

                if (isAlreadyActive) {
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = "表2 · 6 × 60° 节卦六步周转表 (已取消选择)";
                    if (badgeDesc) badgeDesc.innerText = "点击任意单行，联动太乙阵图与 3D 浑天坐标。";
                    return;
                }

                this.classList.add("active-row", "row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);

                const item = t2Map[idx] || t2Map[0];
                currentActiveVal = item.deg;
                currentActivePositions = [item.pos];
                currentFocusedCell = item.pos;

                // 自动跃迁至该节度角度对应的矩数 (如 120° 跃迁至第 2 矩显示 120, 360° 跃迁至第 5 矩显示 360)
                const degJu = Math.floor((item.deg - 1) / 81);
                switchJuTier(degJu, [item.pos], item.pos);
                engine.highlightSingleBranch(item.branchIdx);

                if (badgeTitle) badgeTitle.innerText = `表2联动 -> ${item.desc}`;
                if (badgeDesc) badgeDesc.innerText = `律吕对应: ${item.tone} | 周天等角大闭环节点 | 地支属【${EARTHLY_BRANCHES[item.branchIdx].name}位】`;
            });
        });

        // 表 3：81 矩九宫归属表 (9 行，分别对应洛书 1~9 宫)
        const t3Rows = document.querySelectorAll("#panel-table-3 .interactive-row");
        const t3Map = [
            { palace: 1, name: "坎一宫", seq: [1, 10, 19, 28, 37, 46, 55, 64, 73], bIdx: 0 },
            { palace: 2, name: "坤二宫", seq: [2, 11, 20, 29, 38, 47, 56, 65, 74], bIdx: 7 },
            { palace: 3, name: "震三宫", seq: [3, 12, 21, 30, 39, 48, 57, 66, 75], bIdx: 3 },
            { palace: 4, name: "巽四宫", seq: [4, 13, 22, 31, 40, 49, 58, 67, 76], bIdx: 4 },
            { palace: 5, name: "中五宫", seq: [5, 14, 23, 32, 41, 50, 59, 68, 77], bIdx: 6 },
            { palace: 6, name: "乾六宫", seq: [6, 15, 24, 33, 42, 51, 60, 69, 78], bIdx: 10 },
            { palace: 7, name: "兑七宫", seq: [7, 16, 25, 34, 43, 52, 61, 70, 79], bIdx: 9 },
            { palace: 8, name: "艮八宫", seq: [8, 17, 26, 35, 44, 53, 62, 71, 80], bIdx: 1 },
            { palace: 9, name: "离九宫", seq: [9, 18, 27, 36, 45, 54, 63, 72, 81], bIdx: 6 }
        ];
        t3Rows.forEach((tr, idx) => {
            tr.addEventListener("click", function() {
                const isAlreadyActive = this.classList.contains("active-row");
                t3Rows.forEach(r => r.classList.remove("active-row"));

                if (isAlreadyActive) {
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = "表3 · 81 矩九宫归属表 (已取消选择)";
                    if (badgeDesc) badgeDesc.innerText = "点击各行，查看对应九宫包含全部 81 矩。";
                    return;
                }

                this.classList.add("active-row", "row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);

                const item = t3Map[idx] || t3Map[0];
                currentActivePositions = [...item.seq];
                currentFocusedCell = item.seq[0];
                currentActiveVal = item.seq[0];

                switchJuTier(0, item.seq, item.seq[0]);
                engine.highlightSingleBranch(item.bIdx);

                if (badgeTitle) badgeTitle.innerText = `表3联动 -> ${item.name} 包含 81 矩之 9 数全息高亮`;
                if (badgeDesc) badgeDesc.innerText = `本宫包含矩数: [${item.seq.join(', ')}]，在太乙九宫中呈现精准归属分布。`;
            });
        });

        // 表 4：360° 连续对半分割归九表 (8 行)
        const t4Rows = document.querySelectorAll("#panel-table-4 .interactive-row");
        const t4Map = [
            { deg: 360, rem81: 36, posDesc: "离九4" },
            { deg: 180, rem81: 18, posDesc: "离九2" },
            { deg: 90,  rem81: 9,  posDesc: "离九1" },
            { deg: 45,  rem81: 45, posDesc: "离九5" },
            { deg: 22.5, rem81: 27, posDesc: "离九3" },
            { deg: 11.25, rem81: 54, posDesc: "离九6" },
            { deg: 5.625, rem81: 63, posDesc: "离九7" },
            { deg: 2.8125, rem81: 72, posDesc: "离九8" }
        ];
        t4Rows.forEach((tr, idx) => {
            tr.addEventListener("click", function() {
                const isAlreadyActive = this.classList.contains("active-row");
                t4Rows.forEach(r => r.classList.remove("active-row"));

                if (isAlreadyActive) {
                    currentActivePositions = [];
                    currentFocusedCell = null;
                    switchJuTier(0, [], null);
                    engine.clearTrajectoryGroup();
                    if (badgeTitle) badgeTitle.innerText = "表4 · 360° 连续对半分割归九表 (已取消选择)";
                    if (badgeDesc) badgeDesc.innerText = "点击单行，联动太乙阵图与 3D 浑天坐标。";
                    return;
                }

                this.classList.add("active-row", "row-click-flash");
                setTimeout(() => this.classList.remove("row-click-flash"), 450);

                const item = t4Map[idx] || t4Map[0];
                const li9All = [9, 18, 27, 36, 45, 54, 63, 72, 81];
                currentActivePositions = li9All;
                currentFocusedCell = item.rem81;
                currentActiveVal = item.rem81;

                const degJu = Math.floor((item.deg - 1) / 81);
                switchJuTier(degJu, li9All, item.rem81);
                engine.highlightSingleBranch(6); // 离九火对应午位

                if (badgeTitle) badgeTitle.innerText = `表4联动 -> 角度 ${item.deg}° 模81对应第 ${item.rem81} 宫 (${item.posDesc})`;
                if (badgeDesc) badgeDesc.innerText = `数理真理：众和数恒为 9，离九宫九数全亮，万流归宗！`;
            });
        });
    }

    // 视角与动画控制按钮
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

    // 初始化装配
    setupJuTierControls();
    setupSubTablesInteractions();
    switchTablePanel("panel-table-5");
});
