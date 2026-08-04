/* ==========================================================================
   《易经数理秘笈》五行生克、天干合化与 180 年三元九运解构引擎 (wuxing.js)
   特点：地支三合局月相算法 + 天干五合化气 + 五行生克 3D 五角星 + 180 年三元历法
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

class Wuxing3DEngine {
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
        this.shapeGroup = new THREE.Group();

        this.autoRotate = true;

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
        this.scene.add(this.shapeGroup);
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
            const sprite = this.createTextSprite(b.name, b.color);
            sprite.position.copy(pos.clone().multiplyScalar(1.18));
            this.scene.add(sprite);
        });
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

    clearShapeGroup() {
        while (this.shapeGroup.children.length > 0) {
            const obj = this.shapeGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
    }

    render3DTriangle(branchIndices, colorHex) {
        this.clearShapeGroup();
        const p1 = getBranch3DPos(branchIndices[0]);
        const p2 = getBranch3DPos(branchIndices[1]);
        const p3 = getBranch3DPos(branchIndices[2]);

        const points = [p1, p2, p3, p1];
        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: colorHex, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.shapeGroup.add(line);

        points.slice(0, 3).forEach(p => {
            const sphereGeom = new THREE.SphereGeometry(0.4, 16, 16);
            const sphereMat = new THREE.MeshStandardMaterial({ color: colorHex, emissive: colorHex, metalness: 0.9 });
            const sphere = new THREE.Mesh(sphereGeom, sphereMat);
            sphere.position.copy(p);
            this.shapeGroup.add(sphere);
        });
    }

    render3DPentagram() {
        this.clearShapeGroup();
        // 5 个五行节点: 木(3), 火(9), 土(5), 金(7), 水(1)
        const order = [3, 9, 5, 7, 1, 3];
        const points = [];
        order.forEach(palaceNum => {
            // map palace to branch: 3->卯(3), 9->午(6), 5->辰(4), 7->酉(9), 1->子(0)
            let bIdx = 0;
            if (palaceNum === 3) bIdx = 3;
            else if (palaceNum === 9) bIdx = 6;
            else if (palaceNum === 5) bIdx = 4;
            else if (palaceNum === 7) bIdx = 9;
            else if (palaceNum === 1) bIdx = 0;

            points.push(getBranch3DPos(bIdx));
        });

        const geom = new THREE.BufferGeometry().setFromPoints(points);
        const mat = new THREE.LineBasicMaterial({ color: 0xffe066, linewidth: 3 });
        const line = new THREE.Line(geom, mat);
        this.shapeGroup.add(line);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.002;
        }

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new Wuxing3DEngine("three-canvas-wuxing");

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
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    // 三合局与月相算法
    const SANHE_DATA = {
        water: {
            name: "申子辰 (水局·润下)",
            color: "#4dabf7",
            branches: [8, 0, 4],
            palaceNums: [1, 5, 9],
            desc: "水局对应润下生灵，原书 P246 明确预报月相出落规律：",
            moonList: [
                "• 农历三日：月出辰时 (黄道)",
                "• 农历十三日：月出申时 (白道)",
                "• 农历二十三日：月出子时 (赤道)"
            ]
        },
        metal: {
            name: "巳酉丑 (金局·从革)",
            color: "#dee2e6",
            branches: [5, 9, 1],
            palaceNums: [2, 6, 7],
            desc: "金局对应从革肃杀，原书 P246 预测月相规律：",
            moonList: [
                "• 农历五日：月出巳时 (白道)",
                "• 农历十五日：月出酉时 (赤道)",
                "• 农历二十五日：月出丑时 (黄道)"
            ]
        },
        fire: {
            name: "寅午戌 (火局·炎上)",
            color: "#ff5252",
            branches: [2, 6, 10],
            palaceNums: [3, 8, 9],
            desc: "火局对应炎上光明，原书 P246 预测月相规律：",
            moonList: [
                "• 农历八日：月出午时 (赤道)",
                "• 农历十八日：月出戌时 (黄道)",
                "• 农历二十八日：月出寅时 (白道)"
            ]
        },
        wood: {
            name: "亥卯未 (木局·发生)",
            color: "#40c057",
            branches: [11, 3, 7],
            palaceNums: [3, 4, 8],
            desc: "木局对应曲直发生，原书 P246 预测月相规律：",
            moonList: [
                "• 农历十日：月出未时 (黄道)",
                "• 农历二十日：月出亥时 (白道)",
                "• 农历三十日：月出卯时 (赤道)"
            ]
        }
    };

    const sanheResultBox = document.getElementById("sanhe-result-box");

    function renderSanhe(sanheKey) {
        const data = SANHE_DATA[sanheKey];
        if (!data) return;

        let moonHtml = data.moonList.map(m => `<div style="font-size:12px; color:#ffffff; margin:3px 0;">${m}</div>`).join('');

        sanheResultBox.innerHTML = `
            <div style="font-size: 13px; font-weight: 800; color: ${data.color}; margin-bottom: 4px;">
                🔺 ${data.name}
            </div>
            <div style="font-size: 11px; color: #cbd5e1; margin-bottom: 6px;">
                ${data.desc}
            </div>
            <div style="background: rgba(10, 14, 23, 0.7); padding: 8px; border-radius: 6px; border: 1px solid ${data.color};">
                ${moonHtml}
            </div>
        `;

        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            const rem81 = p % 81 === 0 ? 81 : p % 81;
            const rem12 = rem81 % 12 === 0 ? 12 : rem81 % 12;
            const bIdx = rem12 - 1;

            if (data.branches.includes(bIdx)) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });

        engine.render3DTriangle(data.branches, parseInt(data.color.replace('#', '0x'), 16));
    }

    document.querySelectorAll(".sanhe-detail-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".sanhe-detail-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            renderSanhe(this.dataset.sanhe);
        });
    });

    // 四大主 Tab 切换
    document.querySelectorAll(".wuxing-tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".wuxing-tab-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            const tabKey = this.dataset.tab;
            document.querySelectorAll(".wuxing-section-box").forEach(box => box.style.display = "none");

            if (tabKey === "tab-sanhe") {
                document.getElementById("section-sanhe").style.display = "block";
                renderSanhe("water");
            } else if (tabKey === "tab-hehua") {
                document.getElementById("section-hehua").style.display = "block";
                engine.clearShapeGroup();
            } else if (tabKey === "tab-shengke") {
                document.getElementById("section-shengke").style.display = "block";
                const shengkeBox = document.getElementById("shengke-result-box");
                shengkeBox.innerHTML = `
                    <div style="font-size:13px; font-weight:700; color:#ffe066;">五行相生相克 3D 几何说明</div>
                    <div style="font-size:12px; color:#cbd5e1; margin-top:4px;">
                        原著第 74 页指出：阴阳二气流行演化为五行。<br>
                        • <strong>相生环</strong>: 坎一水 ➔ 震巽木 ➔ 离九火 ➔ 坤艮中土 ➔ 乾兑金 ➔ 坎一水。<br>
                        • <strong>相克阵</strong>: 在 3D 浑天仪上顺次连结构成五角星阵。
                    </div>
                `;
                engine.render3DPentagram();
            } else if (tabKey === "tab-sanyuan") {
                document.getElementById("section-sanyuan").style.display = "block";
                engine.clearShapeGroup();
            }
        });
    });

    renderSanhe("water"); // 默认水局
});
