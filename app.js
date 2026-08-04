/* ==========================================================================
   《易经数理秘笈》3D立体天球与六十四卦数理拓扑解析系统 (JavaScript)
   包含连续动态粒子数据流、高亮光脉冲与全速运转天球
   ========================================================================== */

// ---------- 1. 地支与坐标系基础数据 ----------
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

const CHIHDAO_REMS = [1, 4, 7, 10];
const HUANGDAO_REMS = [2, 5, 8, 11];
const BAIDAO_REMS = [3, 6, 9, 0];

const HEXAGRAMS_DATA = [
    { id: 1,  name: "乾为天",   lines: [1,1,1,1,1,1] },
    { id: 2,  name: "坤为地",   lines: [0,0,0,0,0,0] },
    { id: 3,  name: "水雷屯",   lines: [1,0,0,0,1,0] },
    { id: 4,  name: "山水蒙",   lines: [0,1,0,0,0,1] },
    { id: 5,  name: "水天需",   lines: [1,1,1,0,1,0] },
    { id: 6,  name: "天水讼",   lines: [0,1,0,1,1,1] },
    { id: 7,  name: "地水师",   lines: [0,1,0,0,0,0] },
    { id: 8,  name: "水地比",   lines: [0,0,0,0,1,0] },
    { id: 9,  name: "风天小畜", lines: [1,1,1,0,1,1] },
    { id: 10, name: "天泽履",   lines: [1,1,0,1,1,1] },
    { id: 11, name: "地天泰",   lines: [1,1,1,0,0,0] },
    { id: 12, name: "天地否",   lines: [0,0,0,1,1,1] },
    { id: 13, name: "天火同人", lines: [1,0,1,1,1,1] },
    { id: 14, name: "火天大有", lines: [1,1,1,1,0,1] },
    { id: 15, name: "地山谦",   lines: [0,0,1,0,0,0] },
    { id: 16, name: "雷地豫",   lines: [0,0,0,1,0,0] },
    { id: 17, name: "泽雷随",   lines: [1,0,0,0,1,1] },
    { id: 18, name: "山风蛊",   lines: [1,1,0,0,0,1] },
    { id: 19, name: "地泽临",   lines: [1,1,0,0,0,0] },
    { id: 20, name: "风地观",   lines: [0,0,0,0,1,1] },
    { id: 21, name: "火雷噬嗑", lines: [1,0,0,1,0,1] },
    { id: 22, name: "山火贲",   lines: [1,0,1,0,0,1] },
    { id: 23, name: "山地剥",   lines: [0,0,0,0,0,1] },
    { id: 24, name: "地雷复",   lines: [1,0,0,0,0,0] },
    { id: 25, name: "天雷无妄", lines: [1,0,0,1,1,1] },
    { id: 26, name: "山天大畜", lines: [1,1,1,0,0,1] },
    { id: 27, name: "山雷颐",   lines: [1,0,0,0,0,1] },
    { id: 28, name: "泽风大过", lines: [0,1,1,1,1,0] },
    { id: 29, name: "坎为水",   lines: [0,1,0,0,1,0] },
    { id: 30, name: "离为火",   lines: [1,0,1,1,0,1] },
    { id: 31, name: "泽山咸",   lines: [0,0,1,1,1,0] },
    { id: 32, name: "雷风恒",   lines: [0,1,1,1,0,0] },
    { id: 33, name: "天山遁",   lines: [0,0,1,1,1,1] },
    { id: 34, name: "雷天大壮", lines: [1,1,1,1,0,0] },
    { id: 35, name: "火地晋",   lines: [0,0,0,1,0,1] },
    { id: 36, name: "地火明夷", lines: [1,0,1,0,0,0] },
    { id: 37, name: "风火家人", lines: [1,0,1,0,1,1] },
    { id: 38, name: "火泽睽",   lines: [1,1,0,1,0,1] },
    { id: 39, name: "水山蹇",   lines: [0,0,1,0,1,0] },
    { id: 40, name: "雷水解",   lines: [0,1,0,1,0,0] },
    { id: 41, name: "山泽损",   lines: [1,1,0,0,0,1] },
    { id: 42, name: "风雷益",   lines: [1,0,0,0,1,1] },
    { id: 43, name: "泽天夬",   lines: [1,1,1,1,1,0] },
    { id: 44, name: "天风姤",   lines: [0,1,1,1,1,1] },
    { id: 45, name: "泽地萃",   lines: [0,0,0,1,1,0] },
    { id: 46, name: "地风升",   lines: [0,1,1,0,0,0] },
    { id: 47, name: "泽水困",   lines: [0,1,0,1,1,0] },
    { id: 48, name: "水风井",   lines: [0,1,1,0,1,0] },
    { id: 49, name: "泽火革",   lines: [1,0,1,1,1,0] },
    { id: 50, name: "火风鼎",   lines: [0,1,1,1,0,1] },
    { id: 51, name: "震为雷",   lines: [1,0,0,1,0,0] },
    { id: 52, name: "艮为山",   lines: [0,0,1,0,0,1] },
    { id: 53, name: "风山渐",   lines: [0,0,1,0,1,1] },
    { id: 54, name: "雷泽归妹", lines: [1,1,0,1,0,0] },
    { id: 55, name: "雷火丰",   lines: [1,0,1,1,0,0] },
    { id: 56, name: "火山旅",   lines: [0,0,1,1,0,1] },
    { id: 57, name: "巽为风",   lines: [0,1,1,0,1,1] },
    { id: 58, name: "兑为泽",   lines: [1,1,0,1,1,0] },
    { id: 59, name: "风水涣",   lines: [0,1,0,0,1,1] },
    { id: 60, name: "水泽节",   lines: [1,1,0,0,1,0] },
    { id: 61, name: "风泽中孚", lines: [1,1,0,0,1,1] },
    { id: 62, name: "雷山小过", lines: [0,0,1,1,0,0] },
    { id: 63, name: "水火既济", lines: [1,0,1,0,1,0] },
    { id: 64, name: "火水未济", lines: [0,1,0,1,0,1] }
];

const YAO_NAMES = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

function getBranchAngleRad(branchIdx) {
    const deg = 90 - branchIdx * 30;
    return THREE.MathUtils.degToRad(deg);
}

function getEquatorialPos(branchIdx, radius = 6.0) {
    const angle = getBranchAngleRad(branchIdx);
    return new THREE.Vector3(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
    );
}

function calcDigitRoot(n) {
    let num = Math.abs(Math.round(n));
    while (num >= 10) {
        let sum = 0;
        const str = num.toString();
        for (let i = 0; i < str.length; i++) {
            if (str[i] >= '0' && str[i] <= '9') {
                sum += parseInt(str[i], 10);
            }
        }
        num = sum;
    }
    return num;
}

function getSystemByRem(rem12) {
    const r = rem12 % 12;
    if (CHIHDAO_REMS.includes(r)) return { name: "赤道(天)", color: "#ff5252", class: "badge-red" };
    if (HUANGDAO_REMS.includes(r)) return { name: "黄道(地)", color: "#40c057", class: "badge-green" };
    return { name: "白道(万物)", color: "#4dabf7", class: "badge-blue" };
}

function remToBranchIdx(rem) {
    const r = rem % 12;
    return r === 0 ? 11 : r - 1;
}

// ---------- Three.js 动态 3D 天球引擎 ----------
class Yijing3DEngine {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        this.equatorGroup = new THREE.Group();
        this.eclipticGroup = new THREE.Group();
        this.lunarGroup = new THREE.Group();
        this.trajectoryGroup = new THREE.Group();
        this.nodesGroup = new THREE.Group();
        this.hexagram3DGroup = new THREE.Group();
        this.flowParticlesGroup = new THREE.Group(); // 动态流动数据光子组

        this.autoRotate = true;
        this.activeCurve = null;
        this.dataPulseMesh = null;
        this.pulseProgress = 0;

        this.initScene();
        this.createRingsAndNodes();
        this.setupLights();
        this.animate();

        window.addEventListener("resize", () => this.onResize());
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x101628, 0.025);

        this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
        this.camera.position.set(0, -13, 15);

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
        this.scene.add(this.trajectoryGroup);
        this.scene.add(this.nodesGroup);
        this.scene.add(this.hexagram3DGroup);
        this.scene.add(this.flowParticlesGroup);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        const goldLight = new THREE.PointLight(0xffe066, 2.0, 50);
        goldLight.position.set(0, 0, 12);
        this.scene.add(goldLight);

        const blueLight = new THREE.PointLight(0x4dabf7, 1.5, 40);
        blueLight.position.set(0, 0, -10);
        this.scene.add(blueLight);
    }

    createRingsAndNodes() {
        const radius = 6.0;

        // 1. 赤道环 (朱砂红)
        const equatorMat = new THREE.MeshBasicMaterial({ color: 0xff5252, opacity: 0.8, transparent: true });
        const equatorGeom = new THREE.TorusGeometry(radius, 0.06, 16, 100);
        const equatorMesh = new THREE.Mesh(equatorGeom, equatorMat);
        this.equatorGroup.add(equatorMesh);

        // 2. 黄道环 (松石绿)
        const eclipticMat = new THREE.MeshBasicMaterial({ color: 0x40c057, opacity: 0.8, transparent: true });
        const eclipticMesh = new THREE.Mesh(equatorGeom.clone(), eclipticMat);
        eclipticMesh.rotation.x = THREE.MathUtils.degToRad(23.5);
        this.eclipticGroup.add(eclipticMesh);

        // 3. 白道环 (靛青蓝)
        const lunarMat = new THREE.MeshBasicMaterial({ color: 0x4dabf7, opacity: 0.8, transparent: true });
        const lunarMesh = new THREE.Mesh(equatorGeom.clone(), lunarMat);
        lunarMesh.rotation.x = THREE.MathUtils.degToRad(-15);
        this.lunarGroup.add(lunarMesh);

        // 4. 12地支高清晰度标牌
        EARTHLY_BRANCHES.forEach((b) => {
            const pos = getEquatorialPos(b.idx, radius);

            const nodeGeom = new THREE.SphereGeometry(0.3, 16, 16);
            const nodeMat = new THREE.MeshStandardMaterial({ color: 0xffe066, metalness: 0.9, roughness: 0.1 });
            const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
            nodeMesh.position.copy(pos);
            this.nodesGroup.add(nodeMesh);

            const sprite = this.createTextSprite(b.name, b.color);
            sprite.position.copy(pos.clone().multiplyScalar(1.17));
            this.nodesGroup.add(sprite);
        });

        // 创建三大轨道上的动态流体光子粒子流
        this.createOrbitFlowParticles(radius);
        this.createStarfield();
    }

    // 动态在三大轨道上生成沿圆弧连续公转的粒子流
    createOrbitFlowParticles(radius) {
        const particleCount = 60;

        // 赤道流子
        const equatorParticles = this.generateRingParticles(radius, 0, 0xff5252, particleCount);
        this.equatorGroup.add(equatorParticles);

        // 黄道流子
        const eclipticParticles = this.generateRingParticles(radius, THREE.MathUtils.degToRad(23.5), 0x40c057, particleCount);
        this.eclipticGroup.add(eclipticParticles);

        // 白道流子
        const lunarParticles = this.generateRingParticles(radius, THREE.MathUtils.degToRad(-15), 0x4dabf7, particleCount);
        this.lunarGroup.add(lunarParticles);
    }

    generateRingParticles(radius, rotX, colorHex, count) {
        const geom = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            positions[i*3] = radius * Math.cos(angle);
            positions[i*3+1] = radius * Math.sin(angle);
            positions[i*3+2] = 0;
        }

        geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ color: colorHex, size: 0.2, transparent: true, opacity: 0.9 });
        const pointsObj = new THREE.Points(geom, mat);
        pointsObj.rotation.x = rotX;
        return pointsObj;
    }

    createStarfield() {
        const starsGeom = new THREE.BufferGeometry();
        const count = 400;
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 70;
            positions[i+1] = (Math.random() - 0.5) * 70;
            positions[i+2] = (Math.random() - 0.5) * 70;
        }

        starsGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const starsMat = new THREE.PointsMaterial({ color: 0xffe066, size: 0.09, transparent: true, opacity: 0.5 });
        const starfield = new THREE.Points(starsGeom, starsMat);
        this.scene.add(starfield);
    }

    createTextSprite(text, colorHex) {
        const canvas = document.createElement("canvas");
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgba(24, 34, 56, 0.95)";
        ctx.beginPath();
        ctx.arc(64, 64, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#d4af37";
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.font = "Bold 40px 'Noto Serif SC', 'KaiTi', serif";
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.scale.set(1.3, 1.3, 1.3);
        return sprite;
    }

    // 绘制 12步跳跃连线，并创建沿着连线持续飞行的流动数据光球
    updateTrajectory(k) {
        while (this.trajectoryGroup.children.length > 0) {
            const obj = this.trajectoryGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }

        const radius = 6.0;
        const points = [];

        for (let step = 1; step <= 12; step++) {
            const prod = k * step;
            const rem = prod % 12;
            const branchIdx = remToBranchIdx(rem);
            const pos = getEquatorialPos(branchIdx, radius);
            points.push(pos);
        }
        points.push(points[0]);

        this.activeCurve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.05);
        const tubeGeom = new THREE.TubeGeometry(this.activeCurve, 120, 0.08, 8, true);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: 0xffe066,
            transparent: true,
            opacity: 0.9
        });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        this.trajectoryGroup.add(tubeMesh);

        // 创建连续飞行的流动光球
        const pulseGeom = new THREE.SphereGeometry(0.35, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xff5252 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.trajectoryGroup.add(this.dataPulseMesh);

        points.slice(0, 12).forEach((p) => {
            const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff5252 });
            const sphereGeom = new THREE.SphereGeometry(0.22, 12, 12);
            const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            sphereMesh.position.copy(p);
            this.trajectoryGroup.add(sphereMesh);
        });
    }

    // 机制 A：六十四卦 3D 拓扑闭合几何
    renderHexagramTopology(hex) {
        while (this.hexagram3DGroup.children.length > 0) {
            const obj = this.hexagram3DGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }

        const radius = 6.0;
        const points = [];

        hex.lines.forEach((isYang, idx) => {
            const step = idx + 1;
            const val = isYang ? 9 * step : 6 * step;
            const rem = val % 12;
            const branchIdx = remToBranchIdx(rem);
            const pos = getEquatorialPos(branchIdx, radius);
            points.push(pos);

            const nodeMat = new THREE.MeshBasicMaterial({ color: isYang ? 0xffe066 : 0x4dabf7 });
            const nodeGeom = new THREE.SphereGeometry(0.35, 16, 16);
            const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
            nodeMesh.position.copy(pos);
            this.hexagram3DGroup.add(nodeMesh);
        });

        points.push(points[0]);
        this.activeCurve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.05);
        const tubeGeom = new THREE.TubeGeometry(this.activeCurve, 80, 0.1, 8, true);
        const tubeMat = new THREE.MeshBasicMaterial({
            color: 0xffe066,
            transparent: true,
            opacity: 0.95
        });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        this.hexagram3DGroup.add(tubeMesh);

        // 创建飞行的拓扑数据流子
        const pulseGeom = new THREE.SphereGeometry(0.4, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0x40c057 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.hexagram3DGroup.add(this.dataPulseMesh);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // 天球自动旋转 (加速动态感)
        if (this.autoRotate) {
            this.scene.rotation.z += 0.0025;
        }

        // 数据光球沿轨迹线飞越运转
        if (this.activeCurve && this.dataPulseMesh) {
            this.pulseProgress += 0.004;
            if (this.pulseProgress > 1.0) this.pulseProgress = 0;
            const pos = this.activeCurve.getPointAt(this.pulseProgress);
            this.dataPulseMesh.position.copy(pos);
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }
}

// ---------- UI 交互与应用控制 ----------
document.addEventListener("DOMContentLoaded", () => {
    const engine = new Yijing3DEngine("three-canvas-container");

    const numInput = document.getElementById("num-input");
    const btnCalculate = document.getElementById("btn-calculate");
    const seqTableBody = document.getElementById("seq-table-body");
    const presetBtns = document.querySelectorAll(".preset-btn");

    const hexSelect = document.getElementById("hexagram-select");
    const btnAnalyzeHex = document.getElementById("btn-analyze-hex");
    const hexDetailBox = document.getElementById("hexagram-detail-box");

    const valStep1 = document.getElementById("val-step-1");
    const valStep2 = document.getElementById("val-step-2");
    const valStep3 = document.getElementById("val-step-3");
    const valStep4 = document.getElementById("val-step-4");
    const valStep5 = document.getElementById("val-step-5");

    const badgeTitle = document.getElementById("badge-title");
    const badgeDesc = document.getElementById("badge-desc");

    HEXAGRAMS_DATA.forEach((hex) => {
        const opt = document.createElement("option");
        opt.value = hex.id;
        opt.innerText = `第${hex.id}卦 · ${hex.name}`;
        hexSelect.appendChild(opt);
    });

    function runHexagramAnalysis(hexId) {
        const hex = HEXAGRAMS_DATA.find(h => h.id === parseInt(hexId, 10)) || HEXAGRAMS_DATA[0];

        let sumVal = 0;
        let rowsHtml = "";

        hex.lines.forEach((isYang, idx) => {
            const step = idx + 1;
            const val = isYang ? 9 * step : 6 * step;
            sumVal += val;

            const rem = val % 12;
            const branchIdx = remToBranchIdx(rem);
            const branch = EARTHLY_BRANCHES[branchIdx];
            const sys = getSystemByRem(rem);

            const symbolHtml = isYang ? 
                `<div class="yao-line-yang"></div>` : 
                `<div class="yao-line-yin"><span></span><span></span></div>`;

            rowsHtml += `
                <div class="yao-row">
                    <span class="yao-name">${YAO_NAMES[idx]} (${isYang?'阳':'阴'})</span>
                    <div class="yao-symbol">${symbolHtml}</div>
                    <div class="yao-math">
                        <span>${isYang?9:6}×${step} = ${val}</span>
                        <span>余${rem===0?12:rem}</span>
                        <span class="yao-branch" style="color:${branch.color}">${branch.name}</span>
                        <span style="color:${sys.color}">${sys.name}</span>
                    </div>
                </div>
            `;
        });

        const totalRoot = calcDigitRoot(sumVal);

        hexDetailBox.innerHTML = `
            <div class="hex-header">
                <span class="hex-name">【${hex.name}】 6爻空间拓扑</span>
                <span class="hex-sum">爻数总和: ${sumVal} ➔ 归九极数: ${totalRoot}</span>
            </div>
            <div class="hex-lines-grid">
                ${rowsHtml}
            </div>
        `;

        engine.renderHexagramTopology(hex);

        badgeTitle.innerText = `【${hex.name}】 3D 六爻数理空间拓扑`;
        badgeDesc.innerText = `6爻数值和 ${sumVal}，极数 ${totalRoot}，数据光球持续沿 3D 拓扑线飞行`;
    }

    function runDataPipeline(k) {
        numInput.value = k;

        valStep1.innerText = `N = ${k}`;
        const rem81 = k % 81;
        valStep2.innerText = `${k} % 81 = ${rem81}`;
        const rem12 = k % 12;
        const branchIdx = remToBranchIdx(rem12);
        const branch = EARTHLY_BRANCHES[branchIdx];
        valStep3.innerText = `余 ${rem12 === 0 ? 12 : rem12} ➔ ${branch.name}位`;

        const sys = getSystemByRem(rem12);
        valStep4.innerText = sys.name;
        valStep4.className = `step-val ${sys.class}`;

        const root = calcDigitRoot(k);
        valStep5.innerText = `众和极数 = ${root}`;

        engine.updateTrajectory(k);

        if (k === 1000 || k === 10 || k === 100) {
            badgeTitle.innerText = `示范B：10ⁿ 太阳赤道常数推演 (k = ${k})`;
            badgeDesc.innerText = `10ⁿ ÷ 81 余 ${rem81} ➔ 模12 余 ${rem12} (锁定赤道卯位，数据球循环飞越)`;
        } else if (k === 7) {
            badgeTitle.innerText = "步长 k = 7 (逆向十二芒星)";
            badgeDesc.innerText = "按 7×n 顺次经过 12 地支方位，连成北斗天象芒星";
        } else if (k === 360) {
            badgeTitle.innerText = "360° 周天对半分割 (归九律验算)";
            badgeDesc.innerText = "无限分割角度众和数最终恒收敛归于 9";
        } else {
            badgeTitle.innerText = `步长 k = ${k} (数理几何轨迹)`;
            badgeDesc.innerText = `经由矩81削减为 ${rem81}，落入 ${sys.name} ${branch.name}位`;
        }

        animatePipelineSteps();
        renderSequenceTable(k);
    }

    function renderSequenceTable(k) {
        seqTableBody.innerHTML = "";
        for (let step = 1; step <= 12; step++) {
            const prod = k * step;
            const rem = prod % 12;
            const branchIdx = remToBranchIdx(rem);
            const branch = EARTHLY_BRANCHES[branchIdx];
            const sys = getSystemByRem(rem);

            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${step}</strong></td>
                <td>${k} × ${step}</td>
                <td>${prod}</td>
                <td>${rem === 0 ? 12 : rem}</td>
                <td><strong style="color: ${branch.color}">${branch.name}</strong></td>
                <td><span style="color: ${sys.color}">${sys.name}</span></td>
            `;
            seqTableBody.appendChild(tr);
        }
    }

    function animatePipelineSteps() {
        const steps = document.querySelectorAll(".pipe-step");
        steps.forEach((step, idx) => {
            step.classList.remove("active");
            setTimeout(() => {
                step.classList.add("active");
            }, idx * 100);
        });
    }

    btnAnalyzeHex.addEventListener("click", () => {
        runHexagramAnalysis(hexSelect.value);
    });

    hexSelect.addEventListener("change", () => {
        runHexagramAnalysis(hexSelect.value);
    });

    btnCalculate.addEventListener("click", () => {
        const val = parseInt(numInput.value, 10);
        if (!isNaN(val) && val > 0) {
            runDataPipeline(val);
        }
    });

    presetBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            presetBtns.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            const presetVal = parseInt(btn.dataset.preset, 10);
            runDataPipeline(presetVal);
        });
    });

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
        engine.camera.position.set(0, -13, 15);
        engine.controls.target.set(0, 0, 0);
    });
    document.getElementById("btn-toggle-autorotate").addEventListener("click", function() {
        this.classList.toggle("active");
        engine.autoRotate = this.classList.contains("active");
    });

    runHexagramAnalysis(1);
    runDataPipeline(1000);
});
