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
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new WuxingPureMath3DEngine("three-canvas-wuxing");

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
                cell.innerText = num;
                cell.addEventListener("click", () => {
                    document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("active-pos"));
                    cell.classList.add("active-pos");

                    const rem12 = num % 12 === 0 ? 12 : num % 12;
                    engine.renderSanheTriangle([(rem12 - 1) % 12, (rem12 + 3) % 12, (rem12 + 7) % 12], 0xffe066);
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    const wuxingModuleSelect = document.getElementById("wuxing-module-select");
    const moduleCardSanhe = document.getElementById("module-card-sanhe");
    const moduleCardTiangan = document.getElementById("module-card-tiangan");
    const moduleCardShengke = document.getElementById("module-card-shengke");
    const moduleCardSanyuan = document.getElementById("module-card-sanyuan");

    const wuxingBadgeTitle = document.getElementById("wuxing-badge-title");
    const wuxingBadgeDesc = document.getElementById("wuxing-badge-desc");
    const sanheDetailCard = document.getElementById("sanhe-detail-card");

    // 4 大三合局详尽文本与数据字典
    const SANHE_MAP = {
        water: {
            name: "申子辰 (水局)",
            color: "#4dabf7",
            branches: [8, 0, 4],
            title: "🌙 申子辰水局与农历出落时辰预报 (原书 P246)",
            desc: `• <strong>生于申</strong>：初一至初七，月出在申位（西南），初三上弦月出。<br>
                   • <strong>旺于子</strong>：十五月圆（望），子时居于正北夜空最高点。<br>
                   • <strong>墓于辰</strong>：二十二日后，残月（下弦）在辰位（东南）没入。`
        },
        metal: {
            name: "巳酉丑 (金局)",
            color: "#dee2e6",
            branches: [5, 9, 1],
            title: "⚔️ 巳酉丑金局与九宫金气运化 (原书 P248)",
            desc: `• <strong>生于巳</strong>：巳位（东南）为金气长生之始，地户天门互通。<br>
                   • <strong>旺于酉</strong>：酉位（正西）帝旺，日落西山而金气最为充盈肃杀。<br>
                   • <strong>墓于丑</strong>：丑位（东北）归墓收敛，金气入库藏于严冬寒土。`
        },
        wood: {
            name: "亥卯未 (木局)",
            color: "#40c057",
            branches: [11, 3, 7],
            title: "🌿 亥卯未木局与东天万物生发 (原书 P250)",
            desc: `• <strong>生于亥</strong>：亥位（天门）长生，木德受气于北天极受德之筐。<br>
                   • <strong>旺于卯</strong>：卯位（正东）帝旺，旭日东升而万物滋荣生长。<br>
                   • <strong>墓于未</strong>：未位（西南）归墓收敛，夏末木气归藏于坤土。`
        },
        fire: {
            name: "寅午戌 (火局)",
            color: "#ff5252",
            branches: [2, 6, 10],
            title: "🔥 寅午戌火局与太阳中天运化 (原书 P252)",
            desc: `• <strong>生于寅</strong>：寅位（东北）长生，黎明三阳开泰生发火德。<br>
                   • <strong>旺于午</strong>：午位（正南）帝旺，正午烈日当空发辉至极。<br>
                   • <strong>墓于戌</strong>：戌位（西北）归墓收敛，夕阳西下火气落于乾宫。`
        }
    };

    function updateSanheDetail(key) {
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
                    实时响应：左侧 3D 脉冲球已在 ${data.name} 能量三角形上巡航，中间阵图对应地支宫高亮！
                </div>
            `;
        }

        engine.renderSanheTriangle(data.branches, parseInt(data.color.replace('#', '0x'), 16));
        highlightMatrixByBranches(data.branches);

        if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = `地支三合局 · ${data.name} 3D 三角形`;
        if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = `数据脉冲球在 ${data.name} 能量边线上实时游走 (文字解析已同步更新)`;
    }

    function switchModule(modKey) {
        [moduleCardSanhe, moduleCardTiangan, moduleCardShengke, moduleCardSanyuan].forEach(el => {
            if (el) el.style.display = "none";
        });

        document.querySelectorAll(".taiyi-81-cell").forEach(cell => cell.classList.remove("active-pos"));

        if (modKey === "sanhe") {
            if (moduleCardSanhe) moduleCardSanhe.style.display = "block";
            const activeSanheBtn = document.querySelector(".sanhe-btn.active");
            const key = activeSanheBtn ? activeSanheBtn.dataset.sanhe : "water";
            updateSanheDetail(key);
        } else if (modKey === "tiangan") {
            if (moduleCardTiangan) moduleCardTiangan.style.display = "block";
            if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = "天干五合化气律数据运动";
            if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = "点击右侧表格行，高亮合化五行在太乙 81 宫阵图上的归属";
            engine.clearWuxing3DGroup();
        } else if (modKey === "shengke") {
            if (moduleCardShengke) moduleCardShengke.style.display = "block";
            if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = "五行相生相克 3D 五角星数据运动";
            if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = "数据粒子在 3D 五角星相克拓扑边线上高速巡航";
            engine.renderPentagramKe();
        } else if (modKey === "sanyuan") {
            if (moduleCardSanyuan) moduleCardSanyuan.style.display = "block";
            if (wuxingBadgeTitle) wuxingBadgeTitle.innerText = "180 年甲子三元九运数据运动";
            if (wuxingBadgeDesc) wuxingBadgeDesc.innerText = "点击右侧历表行，高亮三元九运对应 81 宫归属与 3D 天极位";
            engine.clearWuxing3DGroup();
        }
    }

    function highlightMatrixByBranches(branchIndices) {
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            const rem12 = p % 12 === 0 ? 12 : p % 12;
            if (branchIndices.includes(rem12 - 1)) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });
    }

    if (wuxingModuleSelect) {
        wuxingModuleSelect.addEventListener("change", (e) => {
            switchModule(e.target.value);
        });
    }

    // 绑定 4 大三合局按钮点击 (更新文字 + 高亮右侧按钮闪烁 + 3D/81宫联动)
    document.querySelectorAll(".sanhe-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".sanhe-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            // 右侧按钮闪光冲击动画
            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 400);

            const key = this.dataset.sanhe;
            updateSanheDetail(key);
        });
    });

    // 天干五合与三元九运表格行点击高亮动画与三向联动
    document.querySelectorAll(".interactive-row").forEach(row => {
        row.addEventListener("click", function() {
            document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
            this.classList.add("active-row");

            // 闪光冲击视觉动画
            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 400);

            if (this.dataset.tg) {
                const tgId = parseInt(this.dataset.tg, 10);
                const palaceTargetMap = { 1: [5, 2, 8], 2: [6, 7], 3: [1], 4: [3, 4], 5: [9] };
                const palaces = palaceTargetMap[tgId] || [1];

                document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
                    const p = parseInt(cell.dataset.pos, 10);
                    const rem81 = p % 9 === 0 ? 9 : p % 9;
                    cell.classList.toggle("active-pos", palaces.includes(rem81));
                });
            } else if (this.dataset.yun) {
                const yunId = parseInt(this.dataset.yun, 10);
                document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
                    const p = parseInt(cell.dataset.pos, 10);
                    const rem9 = p % 9 === 0 ? 9 : p % 9;
                    cell.classList.toggle("active-pos", rem9 === yunId);
                });
                engine.renderSanheTriangle([(yunId - 1) % 12, (yunId + 3) % 12, (yunId + 7) % 12], 0xffe066);
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

    switchModule("sanhe");
});
