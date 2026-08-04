/* ==========================================================================
   《易经数理秘笈》太乙九宫图与周天系数表 - 核心逻辑 (taiyi.js)
   包含：3D 浑天仪 + 太乙八十一宫动态阵图 + 3x3 九宫幻方交互
   ========================================================================== */

const PALACE_BRANCH_MAP = {
    1: 0,   // 坎一宫 -> 子位 (余1)
    2: 7,   // 坤二宫 -> 未位 (余8/地)
    3: 3,   // 震三宫 -> 卯位 (余4/天)
    4: 5,   // 巽四宫 -> 巳位 (余6/物)
    5: 4,   // 中五宫 -> 辰位 (余5/地)
    6: 11,  // 乾六宫 -> 亥位 (余12/物)
    7: 9,   // 兑七宫 -> 酉位 (余10/天)
    8: 1,   // 艮八宫 -> 丑位 (余2/地)
    9: 6    // 离九宫 -> 午位 (余7/天)
};

const PALACE_NAMES = {
    1: "坎一宫 (正北/水)", 2: "坤二宫 (西南/土)", 3: "震三宫 (正东/木)",
    4: "巽四宫 (东南/木)", 5: "中五宫 (中宫/土)", 6: "乾六宫 (西北/金)",
    7: "兑七宫 (正西/金)", 8: "艮八宫 (东北/土)", 9: "离九宫 (正南/火)"
};

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

class Taiyi3DEngine {
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
        this.taiyi3DGroup = new THREE.Group();
        this.nodesGroup = new THREE.Group();
        this.axesGroup = new THREE.Group();

        this.autoRotate = true;

        this.initScene();
        this.createArmillaryStructure();
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
        this.scene.add(this.taiyi3DGroup);
        this.scene.add(this.nodesGroup);
        this.scene.add(this.axesGroup);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
        this.scene.add(ambientLight);

        const goldLight = new THREE.PointLight(0xffe066, 2.2, 50);
        goldLight.position.set(0, 0, 12);
        this.scene.add(goldLight);
    }

    createArmillaryStructure() {
        const radius = 6.0;

        const equatorMat = new THREE.MeshBasicMaterial({ color: 0xff5252, opacity: 0.85, transparent: true });
        const equatorGeom = new THREE.TorusGeometry(radius, 0.07, 16, 100);
        const equatorMesh = new THREE.Mesh(equatorGeom, equatorMat);
        this.equatorGroup.add(equatorMesh);

        const eclipticMat = new THREE.MeshBasicMaterial({ color: 0x40c057, opacity: 0.85, transparent: true });
        const eclipticMesh = new THREE.Mesh(equatorGeom.clone(), eclipticMat);
        eclipticMesh.rotation.x = THREE.MathUtils.degToRad(23.5);
        this.eclipticGroup.add(eclipticMesh);

        const lunarMat = new THREE.MeshBasicMaterial({ color: 0x4dabf7, opacity: 0.85, transparent: true });
        const lunarMesh = new THREE.Mesh(equatorGeom.clone(), lunarMat);
        lunarMesh.rotation.x = THREE.MathUtils.degToRad(-15);
        this.lunarGroup.add(lunarMesh);

        EARTHLY_BRANCHES.forEach((b) => {
            const pos = getEquatorialPos(b.idx, radius);

            const lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), pos]);
            const lineMat = new THREE.LineBasicMaterial({ color: 0xd4af37, opacity: 0.35, transparent: true });
            const lineObj = new THREE.Line(lineGeom, lineMat);
            this.axesGroup.add(lineObj);

            const nodeGeom = new THREE.SphereGeometry(0.3, 16, 16);
            const nodeMat = new THREE.MeshStandardMaterial({ color: 0xffe066, metalness: 0.9, roughness: 0.1 });
            const nodeMesh = new THREE.Mesh(nodeGeom, nodeMat);
            nodeMesh.position.copy(pos);
            this.nodesGroup.add(nodeMesh);

            const sprite = this.createTextSprite(b.name, b.color);
            sprite.position.copy(pos.clone().multiplyScalar(1.17));
            this.nodesGroup.add(sprite);
        });

        this.createStarfield();
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

    clearTaiyiGroup() {
        while (this.taiyi3DGroup.children.length > 0) {
            const obj = this.taiyi3DGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
    }

    renderPalaceHighlight(palaceNum) {
        this.clearTaiyiGroup();
        const branchIdx = PALACE_BRANCH_MAP[palaceNum];
        const radius = 6.0;
        const pos = getEquatorialPos(branchIdx, radius);

        const sphereMat = new THREE.MeshBasicMaterial({ color: 0xffe066 });
        const sphereGeom = new THREE.SphereGeometry(0.55, 20, 20);
        const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
        sphereMesh.position.copy(pos);
        this.taiyi3DGroup.add(sphereMesh);

        const lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), pos]);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffe066, linewidth: 3 });
        const lineObj = new THREE.Line(lineGeom, lineMat);
        this.taiyi3DGroup.add(lineObj);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.0025;
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

document.addEventListener("DOMContentLoaded", () => {
    const engine = new Taiyi3DEngine("three-canvas-taiyi");

    const matrixContainer = document.getElementById("taiyi-81-matrix");
    
    function initTaiyi81Matrix() {
        matrixContainer.innerHTML = "";
        for (let pos = 1; pos <= 81; pos++) {
            const palaceGroup = Math.ceil(pos / 9);
            const cell = document.createElement("div");
            cell.className = `taiyi-81-cell palace-group-${palaceGroup}`;
            cell.dataset.pos = pos;
            cell.dataset.palace = palaceGroup;
            cell.title = `第 ${pos} 宫位 (属宫位 ${palaceGroup})`;
            cell.innerHTML = `<span class="cell-num">${pos}</span>`;
            
            cell.addEventListener("click", () => {
                togglePalace(palaceGroup);
            });
            matrixContainer.appendChild(cell);
        }
    }

    function highlightPalaceIn81Matrix(palaceNum) {
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            if (parseInt(cell.dataset.palace, 10) === palaceNum) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });
    }

    initTaiyi81Matrix();

    const taiyiCells = document.querySelectorAll(".taiyi-cell");
    const taiyiResultBox = document.getElementById("taiyi-result-box");
    const badgeTitle = document.getElementById("taiyi-badge-title");
    const badgeDesc = document.getElementById("taiyi-badge-desc");

    let currentPalace = null;

    function togglePalace(palaceNum) {
        const pInt = parseInt(palaceNum, 10);

        if (currentPalace === pInt) {
            currentPalace = null;
            engine.clearTaiyiGroup();
            highlightPalaceIn81Matrix(-1);
            taiyiCells.forEach(c => c.classList.remove("active"));
            badgeTitle.innerText = "太乙九宫展示已取消 (3D 浑天仪与 81 宫干干净净)";
            badgeDesc.innerText = "点击九宫格或 81 宫阵图可再次开启 3D 高亮";
            taiyiResultBox.innerHTML = `<div style="color:#cbd5e1; text-align:center;">九宫展示已取消，点击九宫格进行解构</div>`;
            return;
        }

        currentPalace = pInt;
        taiyiCells.forEach(c => c.classList.remove("active"));
        const activeCell = document.querySelector(`.taiyi-cell[data-palace="${palaceNum}"]`);
        if (activeCell) activeCell.classList.add("active");

        const name = PALACE_NAMES[pInt];
        const branchIdx = PALACE_BRANCH_MAP[pInt];
        const branch = EARTHLY_BRANCHES[branchIdx];

        engine.renderPalaceHighlight(pInt);
        highlightPalaceIn81Matrix(pInt);

        badgeTitle.innerText = `太乙【${name}】 3D 空间定位`;
        badgeDesc.innerText = `宫位数 ${pInt}，落入 ${branch.name}位 (${branch.system})，中间 81 宫矩阵对应 9 个位置同步亮起！`;

        taiyiResultBox.innerHTML = `
            <div style="font-weight: 700; color: #ffffff;">
                选中宫位：<strong style="color: #fff066;">${name}</strong> ➔ 地支落位 = <strong style="color: ${branch.color};">${branch.name}位 (${branch.system})</strong>
            </div>
            <div style="margin-top: 6px; font-size: 12px; color: #cbd5e1;">
                九宫幻方任意横向、纵向、对角线三数相加之和恒为 <strong>15</strong>！<br>
                15 经数位相加得 1 + 5 = 6（或 15 模 9 余 6），完美契合九宫气数节律！
            </div>
        `;
    }

    taiyiCells.forEach(cell => {
        cell.addEventListener("click", () => {
            togglePalace(cell.dataset.palace);
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

    togglePalace(5);
});
