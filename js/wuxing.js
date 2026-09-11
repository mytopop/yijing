/* ==========================================================================
   《易经数理秘笈》五行三元解构馆 - (wuxing.js)
   特点：纯粹数理逻辑 3D 浑天坐标 + 三合局文字动态更新 + 按钮与表格闪耀高亮与三向联动
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

class WuxingPureMath3DEngine {
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
        this.wuxing3DGroup = new THREE.Group();

        this.autoRotate = true;
        this.pulseProgress = 0;
        this.speedMultiplier = 1.0;
        this.activeCurve = null;
        this.dataPulseMesh = null;

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
        this.scene.add(this.wuxing3DGroup);
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

        // 北极星微星核与星宿光环 (告别巨大白塑料球，无 emoji)
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

        // 十二地支星宿位点：彻底移除死板塑料大球与斜金环，升华为【微光星宿晶核 + 浑天星曜玉璧】
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

    clearWuxing3DGroup() {
        while (this.wuxing3DGroup.children.length > 0) {
            const obj = this.wuxing3DGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
        this.activeCurve = null;
        this.dataPulseMesh = null;
    }

    renderSanheTriangle(branchIndices, colorHex) {
        this.clearWuxing3DGroup();
        const p1 = getBranch3DPos(branchIndices[0]);
        const p2 = getBranch3DPos(branchIndices[1]);
        const p3 = getBranch3DPos(branchIndices[2]);
        const points = [p1, p2, p3, p1];

        this.activeCurve = new THREE.CatmullRomCurve3(points, true);
        const geom = new THREE.BufferGeometry().setFromPoints(this.activeCurve.getPoints(60));
        const mat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.wuxing3DGroup.add(line);

        points.slice(0, 3).forEach(p => {
            const sGeom = new THREE.SphereGeometry(0.45, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.wuxing3DGroup.add(sMesh);
        });

        // 光速数据脉冲球
        const pulseGeom = new THREE.SphereGeometry(0.48, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: colorHex, emissiveIntensity: 1.5 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.wuxing3DGroup.add(this.dataPulseMesh);
    }

    renderPentagramKe() {
        this.clearWuxing3DGroup();
        const pentIndices = [0, 6, 9, 3, 4, 0];
        const points = pentIndices.map(idx => getBranch3DPos(idx));

        this.activeCurve = new THREE.CatmullRomCurve3(points, true);
        const geom = new THREE.BufferGeometry().setFromPoints(this.activeCurve.getPoints(100));
        const mat = new THREE.LineBasicMaterial({ color: 0xffe066, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.wuxing3DGroup.add(line);

        points.slice(0, 5).forEach(p => {
            const sGeom = new THREE.SphereGeometry(0.4, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xaa7c11 });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.wuxing3DGroup.add(sMesh);
        });

        // 光速数据脉冲球
        const pulseGeom = new THREE.SphereGeometry(0.48, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe066, emissiveIntensity: 1.5 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.wuxing3DGroup.add(this.dataPulseMesh);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.002;
        }

        if (this.activeCurve && this.dataPulseMesh) {
            this.pulseProgress += 0.004 * this.speedMultiplier;
            if (this.pulseProgress > 1.0) this.pulseProgress = 0;
            const pos = this.activeCurve.getPointAt(this.pulseProgress);
            this.dataPulseMesh.position.copy(pos);
        }

        if (this.controls) this.controls.update();
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }

    highlightBranchPos(branchIdx) {
        const pos = getBranch3DPos(branchIdx);
        if (this.dataPulseMesh) {
            this.dataPulseMesh.position.copy(pos);
        }
    }

    renderKePair(branchIdx1, branchIdx2, colorHex = 0xff5252) {
        this.clearWuxing3DGroup();
        const p1 = getBranch3DPos(branchIdx1);
        const p2 = getBranch3DPos(branchIdx2);
        const points = [p1, p2];

        this.activeCurve = new THREE.CatmullRomCurve3(points);
        const geom = new THREE.BufferGeometry().setFromPoints(this.activeCurve.getPoints(40));
        const mat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.wuxing3DGroup.add(line);

        [p1, p2].forEach(p => {
            const sGeom = new THREE.SphereGeometry(0.42, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.wuxing3DGroup.add(sMesh);
        });

        const pulseGeom = new THREE.SphereGeometry(0.48, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: colorHex, emissiveIntensity: 1.5 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.wuxing3DGroup.add(this.dataPulseMesh);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new WuxingPureMath3DEngine("three-canvas-wuxing");

    const matrixContainer = document.getElementById("taiyi-81-matrix");
    const activeInfoEl = document.getElementById("wuxing-active-info");
    const cellFocusInfoEl = document.getElementById("wuxing-cell-focus-info");

    let currentJu = 0;
    let currentActivePositions = [];
    let currentFocusedCell = null;
    let currentActiveVal = 1;
    let activeOverrideMap = {};
    let currentModule = "sanhe";

    // 4 大三合局详尽文本与数据字典
    const SANHE_MAP = {
        water: {
            name: "申子辰 (水局)",
            color: "#4dabf7",
            branches: [8, 0, 4],
            branchNames: "申 · 子 · 辰",
            branchDetail: "申(白道) · 子(赤道) · 辰(黄道)",
            title: "申子辰水局与农历出落时辰预报 (原书 P246)",
            desc: `• <strong>生于申</strong>：初一至初七，月出在申位（西南），初三上弦月出。<br>
                   • <strong>旺于子</strong>：十五月圆（望），子时居于正北夜空最高点。<br>
                   • <strong>墓于辰</strong>：二十二日后，残月（下弦）在辰位（东南）没入。`
        },
        metal: {
            name: "巳酉丑 (金局)",
            color: "#dee2e6",
            branches: [5, 9, 1],
            branchNames: "巳 · 酉 · 丑",
            branchDetail: "巳(白道) · 酉(赤道) · 丑(黄道)",
            title: "巳酉丑金局与九宫金气运化 (原书 P248)",
            desc: `• <strong>生于巳</strong>：巳位（东南）为金气长生之始，地户天门互通。<br>
                   • <strong>旺于酉</strong>：酉位（正西）帝旺，日落西山而金气最为充盈肃杀。<br>
                   • <strong>墓于丑</strong>：丑位（东北）归墓收敛，金气入库藏于严冬寒土。`
        },
        wood: {
            name: "亥卯未 (木局)",
            color: "#40c057",
            branches: [11, 3, 7],
            branchNames: "亥 · 卯 · 未",
            branchDetail: "亥(白道) · 卯(赤道) · 未(黄道)",
            title: "亥卯未木局与东天万物生发 (原书 P250)",
            desc: `• <strong>生于亥</strong>：亥位（天门）长生，木德受气于北天极受德之筐。<br>
                   • <strong>旺于卯</strong>：卯位（正东）帝旺，旭日东升而万物滋荣生长。<br>
                   • <strong>墓于未</strong>：未位（西南）归墓收敛，夏末木气归藏于坤土。`
        },
        fire: {
            name: "寅午戌 (火局)",
            color: "#ff5252",
            branches: [2, 6, 10],
            branchNames: "寅 · 午 · 戌",
            branchDetail: "寅(白道) · 午(赤道) · 戌(黄道)",
            title: "寅午戌火局与太阳中天运化 (原书 P252)",
            desc: `• <strong>生于寅</strong>：寅位（东北）长生，黎明三阳开泰生发火德。<br>
                   • <strong>旺于午</strong>：午位（正南）帝旺，正午烈日当空发辉至极。<br>
                   • <strong>墓于戌</strong>：戌位（西北）归墓收敛，夕阳西下火气落于乾宫。`
        }
    };

    function getBranchSanheInfo(branchIdx) {
        for (const key in SANHE_MAP) {
            if (SANHE_MAP[key].branches.includes(branchIdx)) {
                return {
                    key: key,
                    name: SANHE_MAP[key].name,
                    color: SANHE_MAP[key].color
                };
            }
        }
        return null;
    }

    function renderLuoshuTaiyi9x9Matrix(juIndex = 0, activePositions = [], focusedPos = null, overrideMap = {}) {
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

            palace.numbers.forEach((num, idx) => {
                const cell = document.createElement("div");
                cell.className = "taiyi-81-cell";
                cell.dataset.pos = num;

                const baseNum = num;
                const currentVal = (overrideMap && overrideMap[baseNum] !== undefined)
                    ? overrideMap[baseNum]
                    : (baseNum + juIndex * 81);

                const palacePosText = (TAIYI_81_SUB_LABELS[baseNum] || "").replace(/[()]/g, "");
                const rem12 = currentVal % 12 === 0 ? 12 : currentVal % 12;
                const branch = EARTHLY_BRANCHES[rem12 - 1];
                const sanheInfo = getBranchSanheInfo(branch.idx);
                const sanheBelong = sanheInfo ? sanheInfo.name : "非三合正位";

                cell.dataset.currentVal = currentVal;
                cell.dataset.branch = branch.name;
                cell.title = `宫位: 第 ${baseNum} 宫 (${palace.name} ${palacePosText})\n当前数值: ${currentVal} (第 ${juIndex + 1} 矩)\n对应地支: 【${branch.name}位】(${branch.system})\n三合归属: ${sanheBelong}`;

                const fontSize = currentVal >= 10000 ? '11px' : (currentVal >= 1000 ? '12.5px' : (currentVal >= 100 ? '14px' : '16px'));
                cell.innerHTML = `
                    <div class="cell-num" style="font-size: ${fontSize}; white-space: nowrap; overflow: hidden; text-overflow: clip;">${currentVal}</div>
                    <div class="cell-sub" style="font-size: 10px; white-space: nowrap; display: flex; align-items: center; justify-content: center; gap: 2px;">
                        <span style="opacity: 0.85;">${palacePosText}</span>
                        <span class="cell-branch-name" style="color: ${branch.color}; font-weight: 800;">${branch.name}</span>
                    </div>
                `;

                if (activePositions.includes(baseNum)) {
                    cell.classList.add("active-pos");
                }
                if (focusedPos !== null && baseNum === focusedPos) {
                    cell.classList.add("focused-cell");
                }

                cell.addEventListener("click", () => {
                    handleTaiyiCellClick(baseNum, currentVal, palace, palacePosText, branch, sanheInfo);
                });

                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    function switchJuTier(juIndex, targetActivePositions = null, focusedPos = null, overrideMap = {}) {
        currentJu = Math.max(0, juIndex);
        activeOverrideMap = overrideMap || {};

        const juBadge = document.getElementById("current-ju-badge");
        if (juBadge) {
            const start = currentJu * 81 + 1;
            const end = (currentJu + 1) * 81;
            juBadge.innerText = `第 ${currentJu + 1} 矩 (${start}~${end})`;
        }

        document.querySelectorAll(".ju-tier-btn").forEach(btn => {
            const bJu = btn.dataset.ju;
            if (bJu === "auto") {
                btn.classList.remove("active");
            } else {
                btn.classList.toggle("active", parseInt(bJu, 10) === currentJu);
            }
        });

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
                    const nJu = Math.max(0, Math.floor((currentActiveVal - 1) / 81));
                    switchJuTier(nJu, [currentFocusedCell], currentFocusedCell, { [currentFocusedCell]: currentActiveVal });
                } else {
                    const parsedJu = parseInt(bJu, 10);
                    switchJuTier(parsedJu, [currentFocusedCell], currentFocusedCell);
                }
            });
        });
    }

    function handleTaiyiCellClick(baseNum, currentVal, palace, palacePosText, branch, sanheInfo) {
        currentFocusedCell = baseNum;
        currentActiveVal = currentVal;

        document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("focused-cell"));
        const targetCell = document.querySelector(`.taiyi-81-cell[data-pos="${baseNum}"]`);
        if (targetCell) targetCell.classList.add("focused-cell");

        if (cellFocusInfoEl) {
            cellFocusInfoEl.innerHTML = `选中: <strong style="color:#ffe066;">第 ${baseNum} 宫 (${currentVal})</strong> | 地支: <strong style="color:${branch.color};">【${branch.name}位】</strong>`;
        }

        engine.highlightBranchPos(branch.idx);

        if (currentModule === "sanhe") {
            if (sanheInfo && sanheInfo.key) {
                document.querySelectorAll(".sanhe-btn").forEach(b => {
                    b.classList.toggle("active", b.dataset.sanhe === sanheInfo.key);
                });
                updateSanheDetail(sanheInfo.key, false);
            } else {
                const rem12 = currentVal % 12 === 0 ? 12 : currentVal % 12;
                engine.renderSanheTriangle([(rem12 - 1) % 12, (rem12 + 3) % 12, (rem12 + 7) % 12], parseInt(branch.color.replace('#', '0x'), 16));
            }
        }
    }

    const wuxingModuleSelect = document.getElementById("wuxing-module-select");
    const moduleCardSanhe = document.getElementById("module-card-sanhe");
    const moduleCardTiangan = document.getElementById("module-card-tiangan");
    const moduleCardShengke = document.getElementById("module-card-shengke");
    const moduleCardSanyuan = document.getElementById("module-card-sanyuan");

    const wuxingBadgeTitle = document.getElementById("wuxing-badge-title");
    const wuxingBadgeDesc = document.getElementById("wuxing-badge-desc");
    const sanheDetailCard = document.getElementById("sanhe-detail-card");

    // 1. 模块 1：地支三合局
    function updateSanheDetail(key, updateFocus = true) {
        const data = SANHE_MAP[key] || SANHE_MAP.water;

        if (sanheDetailCard) {
            sanheDetailCard.innerHTML = `
                <div style="font-size: 13px; font-weight: 800; color: ${data.color}; margin-bottom: 4px;">
                    ${data.title}
                </div>
                <div style="font-size: 11.5px; color: #cbd5e1; line-height: 1.6; font-family: var(--font-sans);">
                    ${data.desc}
                </div>
                <div style="margin-top: 6px; font-size: 11px; color: #ffe066; background: rgba(77,171,247,0.15); padding: 4px 8px; border-radius: 4px;">
                    实时响应：左侧 3D 脉冲球已在 ${data.name} 能量三角形上巡航，中间阵图对应地支【${data.branchNames}】高亮显现！
                </div>
            `;
        }

        engine.renderSanheTriangle(data.branches, parseInt(data.color.replace('#', '0x'), 16));

        const matchingPositions = [];
        for (let num = 1; num <= 81; num++) {
            const currentVal = num + currentJu * 81;
            const rem12 = currentVal % 12 === 0 ? 12 : currentVal % 12;
            if (data.branches.includes(rem12 - 1)) {
                matchingPositions.push(num);
            }
        }
        currentActivePositions = matchingPositions;
        if (updateFocus) {
            currentFocusedCell = matchingPositions[0] || null;
            currentActiveVal = currentFocusedCell ? (currentFocusedCell + currentJu * 81) : 1;
        }

        renderLuoshuTaiyi9x9Matrix(currentJu, currentActivePositions, currentFocusedCell, activeOverrideMap);

        if (activeInfoEl) {
            activeInfoEl.innerHTML = `当前时空: <span style="color:#ffe066; font-weight:700;">${data.name}</span> | 高亮地支: <span style="color:${data.color}; font-weight:700;">${data.branchDetail}</span>`;
        }
        if (cellFocusInfoEl && currentFocusedCell) {
            const r12 = currentActiveVal % 12 === 0 ? 12 : currentActiveVal % 12;
            const b = EARTHLY_BRANCHES[r12 - 1];
            cellFocusInfoEl.innerHTML = `基准: <strong style="color:#ffe066;">第 ${currentFocusedCell} 宫 (${currentActiveVal})</strong> | 地支: <strong style="color:${b.color};">【${b.name}位】</strong>`;
        }

        if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = `地支三合局 · ${data.name} 3D 三角形`;
        if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = `数据脉冲球在 ${data.name} 能量边线上实时游走，高亮地支【${data.branchNames}】`;
    }

    // 2. 模块 2：天干五合化气律
    function selectTiangan(tgId = 1) {
        document.querySelectorAll(".interactive-row[data-tg]").forEach(r => {
            r.classList.toggle("active-row", parseInt(r.dataset.tg, 10) === tgId);
        });

        const palaceTargetMap = { 1: [5, 2, 8], 2: [6, 7], 3: [1], 4: [3, 4], 5: [9] };
        const tgNames = { 1: "甲己合化土", 2: "乙庚合化金", 3: "丙辛合化水", 4: "丁壬合化木", 5: "戊癸合化火" };
        const tgColors = { 1: "#ffe066", 2: "#dee2e6", 3: "#4dabf7", 4: "#40c057", 5: "#ff5252" };
        const tgBranches = {
            1: [1, 4, 7, 10], // 丑辰未戌 (四季土)
            2: [9, 5],        // 酉申 (金)
            3: [0, 11],       // 子亥 (水)
            4: [3, 2],        // 卯寅 (木)
            5: [6, 5]         // 午巳 (火)
        };

        const palaces = palaceTargetMap[tgId] || [5];
        const activePosList = [];
        LUOSHU_PALACES_EXACT.forEach(p => {
            if (palaces.includes(p.num)) {
                activePosList.push(...p.numbers);
            }
        });
        currentActivePositions = activePosList;
        currentFocusedCell = activePosList[0] || null;
        currentActiveVal = currentFocusedCell ? (currentFocusedCell + currentJu * 81) : 1;

        renderLuoshuTaiyi9x9Matrix(currentJu, currentActivePositions, currentFocusedCell);

        if (activeInfoEl) {
            activeInfoEl.innerHTML = `当前时空: <span style="color:${tgColors[tgId]}; font-weight:700;">天干五合 · ${tgNames[tgId]}</span> | 对应九宫: <span style="color:#ffe066; font-weight:700;">${palaces.map(n => n + '宫').join('/')}</span>`;
        }
        if (cellFocusInfoEl && currentFocusedCell) {
            const r12 = currentActiveVal % 12 === 0 ? 12 : currentActiveVal % 12;
            const b = EARTHLY_BRANCHES[r12 - 1];
            cellFocusInfoEl.innerHTML = `首落点: <strong style="color:#ffe066;">第 ${currentFocusedCell} 宫</strong> | 地支: <strong style="color:${b.color};">【${b.name}位】</strong>`;
        }

        if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = `天干五合 · ${tgNames[tgId]}`;
        if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = `合化气数在太乙 81 宫对应 ${palaces.map(n => n + '宫').join('/')} 同步高亮`;

        const bList = tgBranches[tgId] || [0, 4, 8];
        if (bList.length >= 3) {
            engine.renderSanheTriangle([bList[0], bList[1], bList[2]], parseInt(tgColors[tgId].replace('#', '0x'), 16));
        } else if (bList.length === 2) {
            engine.renderKePair(bList[0], bList[1], parseInt(tgColors[tgId].replace('#', '0x'), 16));
        } else {
            engine.renderSanheTriangle([0, 4, 8], 0xffe066);
        }
    }

    // 3. 模块 3：五行相生相克
    function selectShengke(keKey = "all") {
        document.querySelectorAll(".shengke-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.ke === keKey);
        });

        const keMap = {
            "all": {
                name: "全部五行相克星阵",
                desc: "水克火 · 火克金 · 金克木 · 木克土 · 土克水",
                palaces: [1, 9, 3, 4, 2, 5, 8, 6, 7],
                branches: [0, 6, 9, 3, 4],
                color: "#ffe066",
                mode: "pentagram"
            },
            "water-fire": {
                name: "水克火 (坎一克离九)",
                desc: "北方坎一水 冲克 南方离九火 (水灭火)",
                palaces: [1, 9],
                branches: [0, 6], // 子午冲
                color: "#4dabf7",
                mode: "pair"
            },
            "fire-metal": {
                name: "火克金 (离九克乾六兑七)",
                desc: "南方离九火 烈焰熔金 (克西方金)",
                palaces: [9, 6, 7],
                branches: [6, 9], // 午酉
                color: "#ff5252",
                mode: "pair"
            },
            "metal-wood": {
                name: "金克木 (乾兑克震巽)",
                desc: "西方乾六兑七肃杀之金 斩伐东方震三巽四之木",
                palaces: [6, 7, 3, 4],
                branches: [9, 3], // 酉卯冲
                color: "#dee2e6",
                mode: "pair"
            },
            "wood-earth": {
                name: "木克土 (震巽克坤中艮)",
                desc: "东方震巽曲直之木 破坤中艮厚土",
                palaces: [3, 4, 2, 5, 8],
                branches: [3, 4], // 卯辰
                color: "#40c057",
                mode: "pair"
            },
            "earth-water": {
                name: "土克水 (坤中艮克坎一)",
                desc: "中央与四维厚土 筑堤挡水",
                palaces: [2, 5, 8, 1],
                branches: [4, 0], // 辰子
                color: "#ffe066",
                mode: "pair"
            }
        };

        const item = keMap[keKey] || keMap["all"];
        const activePosList = [];
        LUOSHU_PALACES_EXACT.forEach(p => {
            if (item.palaces.includes(p.num)) {
                activePosList.push(...p.numbers);
            }
        });
        currentActivePositions = activePosList;
        currentFocusedCell = activePosList[0] || null;
        currentActiveVal = currentFocusedCell ? (currentFocusedCell + currentJu * 81) : 1;

        renderLuoshuTaiyi9x9Matrix(currentJu, currentActivePositions, currentFocusedCell);

        if (activeInfoEl) {
            activeInfoEl.innerHTML = `当前时空: <span style="color:${item.color}; font-weight:700;">五行生克 · ${item.name}</span> | 对应九宫: <span style="color:#ffe066;">${item.palaces.map(n => n + '宫').join('/')}</span>`;
        }
        if (cellFocusInfoEl) {
            cellFocusInfoEl.innerHTML = `<span style="color:#cbd5e1;">${item.desc}</span>`;
        }

        if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = `五行相克 · ${item.name}`;
        if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = `数据粒子在 3D 天球相克冲射拓扑边线上高速巡航`;

        if (item.mode === "pentagram") {
            engine.renderPentagramKe();
        } else {
            engine.renderKePair(item.branches[0], item.branches[1], parseInt(item.color.replace('#', '0x'), 16));
        }
    }

    // 4. 模块 4：三元九运
    function selectSanyuan(yunId = 9) {
        document.querySelectorAll(".interactive-row[data-yun]").forEach(r => {
            r.classList.toggle("active-row", parseInt(r.dataset.yun, 10) === yunId);
        });

        const yunInfoMap = {
            1: { name: "上元一运坎水", years: "1864 - 1883", palace: 1, startYear: 1864, color: "#4dabf7" },
            2: { name: "上元二运坤土", years: "1884 - 1903", palace: 2, startYear: 1884, color: "#e5c07b" },
            3: { name: "上元三运震木", years: "1904 - 1923", palace: 3, startYear: 1904, color: "#40c057" },
            4: { name: "中元四运巽木", years: "1924 - 1943", palace: 4, startYear: 1924, color: "#40c057" },
            5: { name: "中元五运中土", years: "1944 - 1963", palace: 5, startYear: 1944, color: "#ffe066" },
            6: { name: "中元六运乾金", years: "1964 - 1983", palace: 6, startYear: 1964, color: "#dee2e6" },
            7: { name: "下元七运兑金", years: "1984 - 2003", palace: 7, startYear: 1984, color: "#dee2e6" },
            8: { name: "下元八运艮土", years: "2004 - 2023", palace: 8, startYear: 2004, color: "#e5c07b" },
            9: { name: "下元九运离火", years: "2024 - 2043", palace: 9, startYear: 2024, color: "#ff5252" }
        };

        const yInfo = yunInfoMap[yunId] || yunInfoMap[9];
        const targetPalace = LUOSHU_PALACES_EXACT.find(p => p.num === yInfo.palace);
        const palaceNums = targetPalace ? targetPalace.numbers : [];

        currentActivePositions = palaceNums;
        currentActiveVal = yInfo.startYear;
        currentFocusedCell = palaceNums[0] || yInfo.palace;

        renderLuoshuTaiyi9x9Matrix(currentJu, currentActivePositions, currentFocusedCell);

        const rem12Year = yInfo.startYear % 12 === 0 ? 12 : yInfo.startYear % 12;
        const yearBranch = EARTHLY_BRANCHES[rem12Year - 1];

        if (activeInfoEl) {
            activeInfoEl.innerHTML = `当前时空: <span style="color:${yInfo.color}; font-weight:700;">${yInfo.name} (${yInfo.years})</span> | 卦象: <span style="color:#ffe066; font-weight:700;">第 ${yInfo.palace} 宫</span>`;
        }
        if (cellFocusInfoEl) {
            cellFocusInfoEl.innerHTML = `基准年份: <strong style="color:#ffe066;">${yInfo.startYear}</strong> | 岁次地支: <strong style="color:${yearBranch.color};">【${yearBranch.name}位】</strong> | 点击'当前值所在矩'跃迁`;
        }

        if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = `180 年甲子三元九运 · ${yInfo.name}`;
        if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = `年份 ${yInfo.years} 对应洛书第 ${yInfo.palace} 宫，气数已在太乙 81 宫高亮`;

        engine.renderSanheTriangle([(yunId - 1) % 12, (yunId + 3) % 12, (yunId + 7) % 12], 0xffe066);
    }

    // 模块切换总函数
    function switchModule(modKey) {
        currentModule = modKey;

        // 同步顶部导航按钮
        document.querySelectorAll(".wuxing-nav-btn").forEach(btn => {
            btn.classList.toggle("active", btn.dataset.mod === modKey);
        });
        if (wuxingModuleSelect && wuxingModuleSelect.value !== modKey) {
            wuxingModuleSelect.value = modKey;
        }

        [moduleCardSanhe, moduleCardTiangan, moduleCardShengke, moduleCardSanyuan].forEach(el => {
            if (el) el.style.display = "none";
        });

        currentFocusedCell = null;
        activeOverrideMap = {};

        if (modKey === "sanhe") {
            if (moduleCardSanhe) moduleCardSanhe.style.display = "block";
            const activeSanheBtn = document.querySelector(".sanhe-btn.active");
            const key = activeSanheBtn ? activeSanheBtn.dataset.sanhe : "water";
            updateSanheDetail(key, true);
        } else if (modKey === "tiangan") {
            if (moduleCardTiangan) moduleCardTiangan.style.display = "block";
            selectTiangan(1);
        } else if (modKey === "shengke") {
            if (moduleCardShengke) moduleCardShengke.style.display = "block";
            selectShengke("all");
        } else if (modKey === "sanyuan") {
            if (moduleCardSanyuan) moduleCardSanyuan.style.display = "block";
            selectSanyuan(9);
        }
    }

    // 绑定 4 大导航按钮点击
    document.querySelectorAll(".wuxing-nav-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 450);
            switchModule(this.dataset.mod);
        });
    });

    if (wuxingModuleSelect) {
        wuxingModuleSelect.addEventListener("change", (e) => {
            switchModule(e.target.value);
        });
    }

    // 绑定 4 大三合局按钮点击
    document.querySelectorAll(".sanhe-btn[data-sanhe]").forEach(btn => {
        btn.addEventListener("click", function() {
            const isAlreadyActive = this.classList.contains("active");
            document.querySelectorAll(".sanhe-btn[data-sanhe]").forEach(b => b.classList.remove("active"));

            if (isAlreadyActive) {
                currentActivePositions = [];
                currentFocusedCell = null;
                renderLuoshuTaiyi9x9Matrix(currentJu, [], null);

                if (sanheDetailCard) {
                    sanheDetailCard.innerHTML = `
                        <div style="font-size: 13px; font-weight: 800; color: #ffe066; margin-bottom: 4px;">
                            【五行三元大纲】地支三合与天文月出预报 (原书 P246-252)
                        </div>
                        <div style="font-size: 11.5px; color: #cbd5e1; line-height: 1.5;">
                            点击下方 4 大三合局按钮或表格行，探查申子辰水局、巳酉丑金局、亥卯未木局与寅午戌火局的详细月相气数！再次点击可取消选择。
                        </div>
                    `;
                }
                if (activeInfoEl) {
                    activeInfoEl.innerHTML = `当前时空: <span style="color:#ffe066;">请选择地支三合局</span> | 待命状态`;
                }
                if (cellFocusInfoEl) {
                    cellFocusInfoEl.innerText = "点击单元格查看地支归属";
                }
                engine.clearWuxing3DGroup();
                return;
            }

            this.classList.add("active");
            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 450);

            const key = this.dataset.sanhe;
            updateSanheDetail(key);
        });
    });

    // 绑定模块 3 五行相克按钮点击
    document.querySelectorAll(".shengke-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 450);
            selectShengke(this.dataset.ke);
        });
    });

    // 绑定天干五合与三元九运表格行点击
    document.querySelectorAll(".interactive-row").forEach(row => {
        row.addEventListener("click", function() {
            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 450);

            if (this.dataset.tg) {
                selectTiangan(parseInt(this.dataset.tg, 10));
            } else if (this.dataset.yun) {
                selectSanyuan(parseInt(this.dataset.yun, 10));
            }
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

    setupJuTierControls();
    switchModule("sanhe");
});
