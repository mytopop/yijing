/* ==========================================================================
   《易经数理秘笈》任意数据流水线与 12 步拆解推演系统 - 核心逻辑 (pipeline.js)
   特点：无中间大球 + 12地支三分坐标环 + 恢复原版 9 宫卡片 + 书中精确太乙81数
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

const CHIHDAO_REMS = [1, 4, 7, 10];
const HUANGDAO_REMS = [2, 5, 8, 11];
const BAIDAO_REMS = [3, 6, 9, 0];

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

class Pipeline3DEngine {
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
        this.trajectoryGroup = new THREE.Group();
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
        this.scene.add(this.trajectoryGroup);
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

    clearTrajectory() {
        while (this.trajectoryGroup.children.length > 0) {
            const obj = this.trajectoryGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
        this.activeCurve = null;
        this.dataPulseMesh = null;
    }

    updateTrajectory(k) {
        this.clearTrajectory();
        const radius = 6.0;
        const points = [];

        for (let step = 1; step <= 12; step++) {
            const prod = k * step;
            const rem = prod % 12;
            const branchIdx = remToBranchIdx(rem);
            const pos = getBranch3DPos(branchIdx, radius);
            points.push(pos);
        }
        points.push(points[0]);

        this.activeCurve = new THREE.CatmullRomCurve3(points, true, "catmullrom", 0.05);
        const tubeGeom = new THREE.TubeGeometry(this.activeCurve, 120, 0.1, 8, true);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.95 });
        const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
        this.trajectoryGroup.add(tubeMesh);

        const pulseGeom = new THREE.SphereGeometry(0.38, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xff5252 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.trajectoryGroup.add(this.dataPulseMesh);

        points.slice(0, 12).forEach((p) => {
            const sphereMat = new THREE.MeshBasicMaterial({ color: 0xff5252 });
            const sphereGeom = new THREE.SphereGeometry(0.24, 12, 12);
            const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            sphereMesh.position.copy(p);
            this.trajectoryGroup.add(sphereMesh);
        });
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
    const engine = new Pipeline3DEngine("three-canvas-pipeline");

    const matrixContainer = document.getElementById("taiyi-81-matrix");

    function initLuoshuTaiyi9x9Matrix() {
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
                    toggleDataPipeline(num);
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    function highlightTaiyi81Pos(targetPos) {
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            if (parseInt(cell.dataset.pos, 10) === targetPos) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });
    }

    initLuoshuTaiyi9x9Matrix();

    const numInput = document.getElementById("num-input");
    const btnCalculate = document.getElementById("btn-calculate");
    const seqTableBody = document.getElementById("seq-table-body");

    const valStep1 = document.getElementById("val-step-1");
    const valStep2 = document.getElementById("val-step-2");
    const valStep3 = document.getElementById("val-step-3");
    const valStep4 = document.getElementById("val-step-4");
    const valStep5 = document.getElementById("val-step-5");

    const badgeTitle = document.getElementById("pipe-badge-title");
    const badgeDesc = document.getElementById("pipe-badge-desc");

    let currentActiveK = null;

    function toggleDataPipeline(k) {
        if (currentActiveK === k) {
            currentActiveK = null;
            engine.clearTrajectory();
            highlightTaiyi81Pos(-1);
            badgeTitle.innerText = "数据展示已取消 (3D 浑天仪与 81 宫干干净净)";
            badgeDesc.innerText = "再次点击按钮或输入数值可开启数理轨迹与 81 宫高亮";

            valStep1.innerText = "N = -";
            valStep2.innerText = "-";
            valStep3.innerText = "-";
            valStep4.innerText = "-";
            valStep5.innerText = "-";
            seqTableBody.innerHTML = "";
            document.querySelectorAll(".pipe-step").forEach(s => s.classList.remove("active"));
            return;
        }

        currentActiveK = k;
        numInput.value = k;

        valStep1.innerText = `N = ${k}`;
        let rem81 = k % 81;
        if (rem81 === 0) rem81 = 81;

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
        highlightTaiyi81Pos(rem81);

        badgeTitle.innerText = `数值 N = ${k} 12步跳跃数理连线`;
        badgeDesc.innerText = `矩 81 削减得第 ${rem81} 宫位，落入 ${sys.name} ${branch.name}位 (点击可取消展示)`;

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
        const steps = document.forEach ? document.querySelectorAll(".pipe-step") : [];
        steps.forEach((step, idx) => {
            step.classList.remove("active");
            setTimeout(() => {
                step.classList.add("active");
            }, idx * 100);
        });
    }

    btnCalculate.addEventListener("click", () => {
        const val = parseInt(numInput.value, 10);
        if (!isNaN(val) && val > 0) {
            toggleDataPipeline(val);
        }
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

    toggleDataPipeline(7);
});
