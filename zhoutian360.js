/* ==========================================================================
   《易经数理秘笈》周天 360° 气数与原书 4 大表格解构引擎 (zhoutian360.js)
   特点：包含原书第 24-26 页 4 大权威表格与 3D 天极切割模型
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

class Zhoutian360Engine {
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
        this.sectorGroup = new THREE.Group();

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
        this.scene.add(this.sectorGroup);
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

    render360Sectors(count = 4) {
        while (this.sectorGroup.children.length > 0) {
            const obj = this.sectorGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }

        const stepAngle = (2 * Math.PI) / count;
        const radius = 6.0;

        for (let i = 0; i < count; i++) {
            const startA = i * stepAngle;
            const endA = (i + 1) * stepAngle;

            const shape = new THREE.Shape();
            shape.moveTo(0, 0);
            shape.arc(0, 0, radius, startA, endA, false);
            shape.lineTo(0, 0);

            const geom = new THREE.ShapeGeometry(shape);
            const color = i % 2 === 0 ? 0xffe066 : 0x4dabf7;
            const mat = new THREE.MeshBasicMaterial({
                color: color,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.15
            });
            const mesh = new THREE.Mesh(geom, mat);
            this.sectorGroup.add(mesh);
        }
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
    const engine = new Zhoutian360Engine("three-canvas-360");

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

    // 4 大原书表格数据
    const TABLES_DATA = {
        tab1: {
            title: "表1：原书四象 90° 质变与 4 个 81 矩 360° 周天映射表",
            columns: ["四象区间", "角度", "81矩累计", "子午天地门", "核心卦象", "周天质变说明"],
            rows: [
                ["第一象 (春/太阳)", "0° ~ 90°", "1 个 81 矩 (81)", "18九2 (蛊卦·巳)", "45九萃卦 / 90已", "少阳发生，至 90° 已位起质变，引吉无咎"],
                ["第二象 (夏/太阴)", "90° ~ 180°", "2 个 81 矩 (162)", "36九4 (明夷·亥)", "90小畜 / 180亥", "太阳升极，明夷生人地，亥位天门交会"],
                ["第三象 (秋/少阳)", "180° ~ 270°", "3 个 81 矩 (243)", "54九 (归妹·巳)", "270已", "少阴肃杀，54九归妹巳位地户"],
                ["第四象 (冬/少阴)", "270° ~ 360°", "4 个 81 矩 (324)", "72九 (节卦·亥)", "360周天归九", "太阴闭藏，72九节卦节制 360° 气数归九"]
            ],
            summary: "梁致堂原著指出：4 个 90° 为周天 360°，需 4 个 81 之矩 (324) 配合子午天门地户气数 (36)，全功达成 360° 周天大圆满！",
            highlightPositions: [9, 18, 27, 36, 45, 54, 63, 72, 81],
            sectorsCount: 4
        },
        tab2: {
            title: "表2：原书 6 × 60° 节卦六步周转与 60 花甲子周天表",
            columns: ["周转步次", "节卦角度", "花甲子纪时", "地支方位", "三元坐标", "周天节律说明"],
            rows: [
                ["第一步 (初爻)", "60°", "甲子 ~ 癸酉", "子 / 丑", "赤道 / 黄道", "60 六节卦第一步，起圆规内在联系"],
                ["第二步 (二爻)", "120°", "甲戌 ~ 癸未", "寅 / 卯", "白道 / 赤道", "气数自天门地户推进，少阳通融"],
                ["第三步 (三爻)", "180°", "甲申 ~ 癸巳", "辰 / 巳", "黄道 / 白道", "半周天 180°，阴阳分界质变点"],
                ["第四步 (四爻)", "240°", "甲午 ~ 癸卯", "午 / 未", "赤道 / 黄道", "太阳转少阴，四象进阶"],
                ["第五步 (五爻)", "300°", "甲辰 ~ 癸丑", "申 / 酉", "白道 / 赤道", "白道 243 矩交接，天地人感应"],
                ["第六步 (上爻)", "360°", "甲寅 ~ 癸亥", "戌 / 亥", "黄道 / 白道", "完成 360° 大周转，六爻皆归于 9"]
            ],
            summary: "原著谓：“卦之六爻是描写六十花甲子纪时单元的六步周转，360° = 6 × 60° 节卦。”",
            highlightPositions: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 81],
            sectorsCount: 6
        },
        tab3: {
            title: "表3：原书九宫范畴对 12 方位 3 大坐标系 81 矩完整归属表",
            columns: ["宫位分类", "坐标系统", "包含地支", "包含宫数示例", "降维特征"],
            rows: [
                ["一、四、七宫", "🔴 赤道坐标 (天)", "子、午、卯、酉", "1, 4, 7, 10, 19, 28, 37, 46, 55, 64, 73", "子午为经，卯酉为纬，直承天德"],
                ["二、五、八宫", "🟢 黄道坐标 (地)", "丑、辰、未、戌", "2, 5, 8, 11, 20, 29, 38, 47, 56, 65, 74", "春夏秋冬四季墓土，黄道运转"],
                ["三、六、九宫", "🔵 白道坐标 (万物)", "寅、申、巳、亥", "3, 6, 9, 12, 21, 30, 39, 48, 57, 66, 75, 81", "四立四维，九宫矩数所集出入天门"]
            ],
            summary: "梁致堂先生强调：12 方位全部气数尽归于九宫范畴！一四七赤道、二五八黄道、三六九白道，严丝合缝！",
            highlightPositions: [1, 4, 7, 2, 5, 8, 3, 6, 9],
            sectorsCount: 12
        },
        tab4: {
            title: "表4：周天 360° 连续对半分割归九收敛验证表",
            columns: ["分割次序", "分割角度", "角度求和算式", "众和数计算", "众和极数"],
            rows: [
                ["原周天 (0)", "360°", "3 + 6 + 0", "9", "9 (极数)"],
                ["第 1 次分割", "180°", "1 + 8 + 0", "9", "9 (极数)"],
                ["第 2 次分割", "90°", "9 + 0", "9", "9 (极数)"],
                ["第 3 次分割", "45°", "4 + 5", "9", "9 (极数)"],
                ["第 4 次分割", "22.5°", "2 + 2 + 5", "9", "9 (极数)"],
                ["第 5 次分割", "11.25°", "1 + 1 + 2 + 5", "9", "9 (极数)"],
                ["第 6 次分割", "5.625°", "5 + 6 + 2 + 5", "18 ➔ 1 + 8", "9 (极数)"],
                ["第 7 次分割", "2.8125°", "2 + 8 + 1 + 2 + 5", "18 ➔ 1 + 8", "9 (极数)"],
                ["第 8 次分割", "1.40625°", "1+4+0+6+2+5", "18 ➔ 1 + 8", "9 (极数)"],
                ["第 9 次分割", "0.703125°", "7+0+3+1+2+5", "18 ➔ 1 + 8", "9 (极数)"]
            ],
            summary: "证明：周天 360° 无论对半分割多少次，其数位众和数 100% 恒无条件收敛归于极数 9！",
            highlightPositions: [9, 18, 27, 36, 45, 54, 63, 72, 81],
            sectorsCount: 8
        }
    };

    const tableTitle = document.getElementById("table-360-title");
    const tableThead = document.getElementById("table-360-thead");
    const tableTbody = document.getElementById("table-360-tbody");
    const tableSummary = document.getElementById("table-360-summary");

    function renderTable(tabKey) {
        const data = TABLES_DATA[tabKey];
        if (!data) return;

        tableTitle.innerHTML = `<span>📋</span> ${data.title}`;

        // 表头
        let headerHtml = "<tr>";
        data.columns.forEach(col => {
            headerHtml += `<th>${col}</th>`;
        });
        headerHtml += "</tr>";
        tableThead.innerHTML = headerHtml;

        // 表体
        let bodyHtml = "";
        data.rows.forEach(row => {
            bodyHtml += "<tr>";
            row.forEach((cell, idx) => {
                if (idx === row.length - 1) {
                    bodyHtml += `<td style="color:#ffe066; font-weight:700;">${cell}</td>`;
                } else {
                    bodyHtml += `<td>${cell}</td>`;
                }
            });
            bodyHtml += "</tr>";
        });
        tableTbody.innerHTML = bodyHtml;

        // 分析总结
        tableSummary.innerHTML = `
            <div class="card-title"><span>💡</span> 原著深度解构</div>
            <div class="law-desc-text" style="color:#ffffff;">${data.summary}</div>
        `;

        // 亮起太乙 81 矩阵
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            const p = parseInt(cell.dataset.pos, 10);
            if (data.highlightPositions.includes(p)) {
                cell.classList.add("active-pos");
            } else {
                cell.classList.remove("active-pos");
            }
        });

        // 更新 3D 扇区
        engine.render360Sectors(data.sectorsCount);
    }

    document.querySelectorAll(".tab-360-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".tab-360-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            const key = this.dataset.tab;
            renderTable(key);
        });
    });

    renderTable("tab1"); // 默认展示表 1
});
