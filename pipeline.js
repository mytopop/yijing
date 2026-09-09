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

class PipelinePureMath3DEngine {
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
        this.pipe3DGroup = new THREE.Group();

        this.autoRotate = true;

        this.activeCurve = null;
        this.dataPulseMesh = null;
        this.pulseProgress = 0;
        this.pulseSpeedMultiplier = 1.0;

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
            const sphereGeom = new THREE.SphereGeometry(0.3, 16, 16);
            const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffe066, emissive: 0xffe066 });
            const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
            sphereMesh.position.copy(p);
            this.pipe3DGroup.add(sphereMesh);
        });

        const pulseGeom = new THREE.SphereGeometry(0.42, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.pipe3DGroup.add(this.dataPulseMesh);
    }

    highlightSingleBranch(bIdx) {
        this.clearPipe3DGroup();
        const pos = getBranch3DPos(bIdx);
        const pulseGeom = new THREE.SphereGeometry(0.5, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe066, emissiveIntensity: 1.8 });
        const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        pulseMesh.position.copy(pos);
        this.pipe3DGroup.add(pulseMesh);
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
                cell.addEventListener("click", () => {
                    numInput.value = num;
                    calculatePipeline(num);
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

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

        const rem81 = inputVal % 81 === 0 ? 81 : inputVal % 81;
        const rem12 = inputVal % 12 === 0 ? 12 : inputVal % 12;
        const branch = EARTHLY_BRANCHES[rem12 - 1];
        const digRoot = getDigitalRoot(inputVal);
        const subTag = TAIYI_81_SUB_LABELS[rem81] || "";

        document.getElementById("val-step-1").innerText = `N = ${inputVal}`;
        document.getElementById("val-step-2").innerText = `${inputVal} % 81 = ${rem81} ➔ ${getPalacePosDesc(rem81)}`;
        document.getElementById("val-step-3").innerText = `余 ${rem12} ➔ ${branch.name}位`;
        
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

        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            cell.classList.toggle("active-pos", p === rem81);
        });

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
                    calculatePipeline(inputVal); // 取消选中，恢复全量 12 步轨迹
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

                document.querySelectorAll(".taiyi-81-cell").forEach(c => {
                    c.classList.toggle("active-pos", parseInt(c.dataset.pos, 10) === rem81);
                });

                engine.highlightSingleBranch(bIdx);

                if (pipeBadgeTitle) pipeBadgeTitle.innerText = `第 ${k} 步: ${inputVal}×${k} = ${val} ➔ ${branch.name}位`;
                if (pipeBadgeDesc) pipeBadgeDesc.innerText = `乘积 ${val} 降维落于第 ${rem81} 宫 ${subTag}，定位至 【${branch.name}位】 (${branch.system})`;
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
                btnCalculate.innerText = "🛑 结束推演 (再点取消)";
                btnCalculate.style.background = "linear-gradient(135deg, #ff5252 0%, #c92a2a 100%)";
                btnCalculate.style.color = "#ffffff";

                calculatePipeline(numInput.value);
                animate5StepsDeduction();
            } else {
                if (stepAnimationTimer) {
                    clearInterval(stepAnimationTimer);
                    stepAnimationTimer = null;
                }
                btnCalculate.innerText = "🚀 推演数理 (点击启动)";
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
