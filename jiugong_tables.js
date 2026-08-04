/* ==========================================================================
   《易经数理秘笈》九宫纪气数一览表全景馆引擎 - (jiugong_tables.js)
   特点：支持 81 宫主表与 729 矩大阵两大模式，9 大宫原书解构 + 全页三向联动
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
    { num: 4, name: "巽四宫 (木)", numbers: [31, 76, 13, 22, 40, 58, 67, 4, 49], class: "palace-xun", color: "#40c057" },
    { num: 9, name: "离九宫 (火)", numbers: [36, 81, 18, 27, 45, 63, 72, 9, 54], class: "palace-li", color: "#ff5252" },
    { num: 2, name: "坤二宫 (土)", numbers: [29, 74, 11, 20, 38, 56, 65, 2, 47], class: "palace-kun", color: "#e5c07b" },
    { num: 3, name: "震三宫 (木)", numbers: [30, 75, 12, 21, 39, 57, 66, 3, 48], class: "palace-zhen", color: "#40c057" },
    { num: 5, name: "中五宫 (土)", numbers: [32, 77, 14, 23, 41, 59, 68, 5, 50], class: "palace-zhong", color: "#ffe066" },
    { num: 7, name: "兑七宫 (金)", numbers: [34, 79, 16, 25, 43, 61, 70, 7, 52], class: "palace-dui", color: "#dee2e6" },
    { num: 8, name: "艮八宫 (土)", numbers: [35, 80, 17, 26, 44, 62, 71, 8, 53], class: "palace-gen", color: "#e5c07b" },
    { num: 1, name: "坎一宫 (水)", numbers: [28, 73, 10, 19, 37, 55, 64, 1, 46], class: "palace-kan", color: "#4dabf7" },
    { num: 6, name: "乾六宫 (金)", numbers: [33, 78, 15, 24, 42, 60, 69, 6, 51], class: "palace-qian", color: "#dee2e6" },
];

// 原书 9 大宫数理大纲定义
const PALACE_MASTERS = {
    1: { name: "坎一宫 (水)", element: "北方润下之水", num: 1, numbers: [1, 10, 19, 28, 37, 46, 55, 64, 73], desc: "原书 P210：坎一宫领北方水气，含 1、10、19、28、37、46、55、64、73 九数，主阳气萌动生发。" },
    2: { name: "坤二宫 (土)", element: "西南万物之母土", num: 2, numbers: [2, 11, 20, 29, 38, 47, 56, 65, 74], desc: "原书 P214：坤二宫领西南阴土，含 2、11、20、29、38、47、56、65、74 九数，主阴阳包容怀藏。" },
    3: { name: "震三宫 (木)", element: "东方曲直之木", num: 3, numbers: [3, 12, 21, 30, 39, 48, 57, 66, 75], desc: "原书 P218：震三宫领东方雷木，含 3、12、21、30、39、48、57、66、75 九数，主万物奋起出震。" },
    4: { name: "巽四宫 (木)", element: "东南风行之木", num: 4, numbers: [4, 13, 22, 31, 40, 49, 58, 67, 76], desc: "原书 P222：巽四宫领东南风木，含 4、13、22、31、40、49、58、67、76 九数，主气数申布周达。" },
    5: { name: "中五宫 (土)", element: "中央中正太极土", num: 5, numbers: [5, 14, 23, 32, 41, 50, 59, 68, 77], desc: "原书 P226：中五宫领中央皇极土，含 5、14、23、32、41、50、59、68、77 九数，主枢纽调度演化。" },
    6: { name: "乾六宫 (金)", element: "西北天道肃杀金", num: 6, numbers: [6, 15, 24, 33, 42, 51, 60, 69, 78], desc: "原书 P230：乾六宫领西北天金，含 6、15、24、33、42、51、60、69、78 九数，主天道刚健自强。" },
    7: { name: "兑七宫 (金)", element: "西方喜悦正金", num: 7, numbers: [7, 16, 25, 34, 43, 52, 61, 70, 79], desc: "原书 P234：兑七宫领西方泽金，含 7、16、25、34、43、52、61、70、79 九数，主月出西方发辉。" },
    8: { name: "艮八宫 (土)", element: "东北山陵止藏土", num: 8, numbers: [8, 17, 26, 35, 44, 53, 62, 71, 80], desc: "原书 P238：艮八宫领东北山土，含 8、17、26, 35, 44, 53, 62, 71, 80 九数，主万物终始交替。" },
    9: { name: "离九宫 (火)", element: "南方炎上明辉火", num: 9, numbers: [9, 18, 27, 36, 45, 54, 63, 72, 81], desc: "原书 P242：离九宫领南方文明火，含 9、18、27、36、45、54、63、72、81 九数，主众和收敛归于 9。" }
};

const HEXAGRAM_NAMES_MAP = {
    1: "乾为天", 2: "坤为地", 3: "水雷屯", 4: "山水蒙", 5: "水天需", 6: "天水讼", 7: "地水师", 8: "水地比",
    9: "风天小畜", 10: "天泽履", 11: "地天泰", 12: "天地否", 13: "天火同人", 14: "火天大有", 15: "地山谦", 16: "雷地豫",
    17: "泽雷随", 18: "山风蛊", 19: "地泽临", 20: "风地观", 21: "火雷噬嗑", 22: "山火贲", 23: "山地剥", 24: "地雷复",
    25: "天雷无妄", 26: "山天大畜", 27: "山雷颐", 28: "泽风大过", 29: "坎为水", 30: "离为火", 31: "泽山咸", 32: "雷风恒",
    33: "天山遁", 34: "雷天大壮", 35: "火地晋", 36: "地火明夷", 37: "风火家人", 38: "火泽睽", 39: "水山蹇", 40: "雷水解",
    41: "山泽损", 42: "风雷益", 43: "泽天夬", 44: "天风姤", 45: "泽地萃", 46: "地风升", 47: "泽水困", 48: "水风井",
    49: "泽火革", 50: "火风鼎", 51: "震为雷", 52: "艮为山", 53: "风山渐", 54: "雷泽归妹", 55: "雷火丰", 56: "火山旅",
    57: "巽为风", 58: "兑为泽", 59: "风水涣", 60: "水泽节", 61: "风泽中孚", 62: "雷山小过", 63: "水火既济", 64: "火水未济"
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

class JiugongTablesPureMath3DEngine {
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
        this.jgt3DGroup = new THREE.Group();

        this.autoRotate = true;
        this.pulseProgress = 0;
        this.speedMultiplier = 1.0;
        this.activeCurve = null;
        this.dataPulseMesh = null;

        this.initScene();
        this.createArmillaryRings();
        this.createCelestialGridAndPoles();
        this.setupDataMotionPulse();
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
        this.scene.add(this.jgt3DGroup);
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

    setupDataMotionPulse() {
        const branchPoints = [];
        for (let i = 0; i < 12; i++) {
            branchPoints.push(getBranch3DPos(i));
        }
        branchPoints.push(branchPoints[0]);

        this.activeCurve = new THREE.CatmullRomCurve3(branchPoints, true);
        const lineGeom = new THREE.BufferGeometry().setFromPoints(this.activeCurve.getPoints(100));
        const lineMat = new THREE.LineDashedMaterial({ color: 0xffe066, dashSize: 0.3, gapSize: 0.15, transparent: true, opacity: 0.6 });
        const motionLine = new THREE.Line(lineGeom, lineMat);
        motionLine.computeLineDistances();
        this.jgt3DGroup.add(motionLine);

        const pulseGeom = new THREE.SphereGeometry(0.48, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe066, emissiveIntensity: 1.5 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.jgt3DGroup.add(this.dataPulseMesh);
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

    highlightBranchPos(branchIdx) {
        const pos = getBranch3DPos(branchIdx);
        if (this.dataPulseMesh) {
            this.dataPulseMesh.position.copy(pos);
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        if (this.autoRotate) {
            this.scene.rotation.z += 0.002;
        }

        if (this.activeCurve && this.dataPulseMesh) {
            this.pulseProgress += 0.003 * this.speedMultiplier;
            if (this.pulseProgress > 1.0) this.pulseProgress = 0;
            const pos = this.activeCurve.getPointAt(this.pulseProgress);
            this.dataPulseMesh.position.copy(pos);
        }

        if (this.controls) this.controls.update();
        if (this.renderer) this.renderer.render(this.scene, this.camera);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const engine = new JiugongTablesPureMath3DEngine("three-canvas-jiugong-tables");

    const matrixContainer = document.getElementById("taiyi-81-matrix");
    const tableBody = document.getElementById("jgt-table-body");
    const tableTitle = document.getElementById("jgt-table-title");
    const palaceBanner = document.getElementById("jgt-palace-banner");
    const detailCard = document.getElementById("jgt-detail-card");
    const badgeTitle = document.getElementById("jgt-badge-title");
    const badgeDesc = document.getElementById("jgt-badge-desc");

    let currentMode = "81"; // "81" 为 81 宫主表模式，"729" 为 729 矩延伸全阵模式

    // 生成 81 宫主表数据集
    const PRIMARY_81_DATA = [];
    LUOSHU_PALACES_EXACT.forEach(palace => {
        palace.numbers.forEach(num => {
            const rem12 = num % 12 === 0 ? 12 : num % 12;
            const branch = EARTHLY_BRANCHES[rem12 - 1];
            const hexName = HEXAGRAM_NAMES_MAP[num] || (num <= 64 ? `第${num}卦` : `大局后续数 ${num}`);
            const deg = (num * 4.4444).toFixed(1) + "°";
            const expr = `${palace.num} 宫 × ${num} = ${palace.num * num}`;

            PRIMARY_81_DATA.push({
                num: num,
                palaceNum: palace.num,
                palaceName: palace.name,
                hexName: hexName,
                expr: expr,
                deg: deg,
                rem12: rem12,
                branchName: branch.name,
                branchColor: branch.color,
                system: branch.system
            });
        });
    });

    // 生成 729 矩延伸全阵数据集 (9 Palaces x 9 Base Numbers x 9 Multipliers = 729 Rows)
    const EXTENDED_729_DATA = [];
    LUOSHU_PALACES_EXACT.forEach(palace => {
        palace.numbers.forEach(baseNum => {
            for (let k = 1; k <= 9; k++) {
                const calcVal = baseNum * k;
                const rem81 = calcVal % 81 === 0 ? 81 : calcVal % 81;
                const rem12 = calcVal % 12 === 0 ? 12 : calcVal % 12;
                const branch = EARTHLY_BRANCHES[rem12 - 1];
                const hexName = HEXAGRAM_NAMES_MAP[rem81] || (rem81 <= 64 ? `第${rem81}卦` : `宫局数 ${rem81}`);
                const deg = (calcVal * 4.4444).toFixed(1) + "°";
                const expr = `${baseNum} × ${k} = ${calcVal} (降维 ${rem81} 宫)`;

                EXTENDED_729_DATA.push({
                    num: calcVal,
                    baseNum: baseNum,
                    multiplier: k,
                    rem81: rem81,
                    palaceNum: palace.num,
                    palaceName: palace.name,
                    hexName: hexName,
                    expr: expr,
                    deg: deg,
                    rem12: rem12,
                    branchName: branch.name,
                    branchColor: branch.color,
                    system: branch.system
                });
            }
        });
    });

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

                    const dataset = currentMode === "81" ? PRIMARY_81_DATA : EXTENDED_729_DATA;
                    const target = dataset.find(d => (d.rem81 || d.num) === num);
                    if (target) {
                        highlightRowAnd3D(target);
                    }
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    function updatePalaceBanner(palaceKey) {
        if (!palaceBanner) return;
        if (palaceKey === "all") {
            palaceBanner.innerHTML = `
                <div style="font-size:13px; font-weight:800; color:#ffe066;">
                    📊 原著《全九宫 81 宫与 729 矩纪气数大表》
                </div>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px;">
                    梁致堂原著 P210-252 揭示：全表涵盖 9 大宫（坎一至离九）、81 宫主项与 729 矩延伸气数全阵。
                </div>
            `;
        } else {
            const pInfo = PALACE_MASTERS[parseInt(palaceKey, 10)] || PALACE_MASTERS[1];
            palaceBanner.innerHTML = `
                <div style="font-size:13px; font-weight:800; color:#ffe066;">
                    🏛️ 原著【${pInfo.name}】纪气数解构大纲 (${pInfo.element})
                </div>
                <div style="font-size:11.5px; color:#cbd5e1; margin-top:2px; line-height:1.4;">
                    ${pInfo.desc}
                </div>
            `;
        }
    }

    function renderTable(filterPalace = "all", searchText = "") {
        if (!tableBody) return;
        tableBody.innerHTML = "";

        let dataset = currentMode === "81" ? PRIMARY_81_DATA : EXTENDED_729_DATA;

        if (filterPalace !== "all") {
            const pNum = parseInt(filterPalace, 10);
            dataset = dataset.filter(d => d.palaceNum === pNum);
        }

        if (searchText.trim() !== "") {
            const q = searchText.trim().toLowerCase();
            dataset = dataset.filter(d => 
                d.num.toString().includes(q) || 
                d.expr.toLowerCase().includes(q) ||
                d.hexName.toLowerCase().includes(q) || 
                d.palaceName.toLowerCase().includes(q) || 
                d.branchName.toLowerCase().includes(q)
            );
        }

        if (tableTitle) {
            const modeNameStr = currentMode === "81" ? "81 宫主项表" : "729 矩全阵大表";
            const pObj = LUOSHU_PALACES_EXACT.find(p => p.num === parseInt(filterPalace, 10));
            const pTitleStr = pObj ? pObj.name : "全九宫";
            tableTitle.innerText = `📋 ${pTitleStr} · ${modeNameStr} (${dataset.length} 条数据，点击行三向联动)`;
        }

        updatePalaceBanner(filterPalace);

        dataset.slice(0, 300).forEach(d => { // 渲染前 300 条保证极致流畅
            const tr = document.createElement("tr");
            tr.className = "interactive-row";
            tr.dataset.num = d.rem81 || d.num;
            tr.innerHTML = `
                <td style="font-weight:700; color:#ffe066;">${d.palaceName.split(' ')[0]}</td>
                <td style="font-family:var(--font-times); font-weight:800;">${d.num}</td>
                <td>${d.hexName}</td>
                <td style="font-family:var(--font-times); font-size:11px;">${d.expr}</td>
                <td style="font-family:var(--font-times);">${d.deg}</td>
                <td style="color:${d.branchColor}; font-weight:800;">${d.branchName}位</td>
                <td>${d.system}</td>
            `;

            tr.addEventListener("click", () => {
                document.querySelectorAll(".interactive-row").forEach(r => r.classList.remove("active-row"));
                tr.classList.add("active-row");

                // 点击瞬间白光冲击动画
                tr.classList.add("row-click-flash");
                setTimeout(() => tr.classList.remove("row-click-flash"), 400);

                highlightRowAnd3D(d);
            });

            tableBody.appendChild(tr);
        });

        if (dataset.length > 0) {
            highlightRowAnd3D(dataset[0]);
        }
    }

    function highlightRowAnd3D(d) {
        const matrixNum = d.rem81 || d.num;

        // 高亮中间太乙 81 宫 (绝不重叠放大)
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            cell.classList.toggle("active-pos", parseInt(cell.dataset.pos, 10) === matrixNum);
        });

        // 驱动 3D 节点
        engine.highlightBranchPos(d.rem12 - 1);

        if (detailCard) {
            detailCard.innerHTML = `
                <div style="font-size: 14px; font-weight: 800; color: #ffe066; margin-bottom: 4px;">
                    📊 【${d.palaceName}】 · 数 ${d.num} 三向联动解析
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.5; font-family: var(--font-times);">
                    • 对应易卦: <strong>${d.hexName}</strong> | 纪气算式: ${d.expr}<br>
                    • 周天角度: <strong>${d.deg}</strong> | 12地支余数: 余 ${d.rem12}<br>
                    • 坐标系归属: <span style="color:${d.branchColor}; font-weight:800;">${d.branchName}位 · ${d.system}</span>
                </div>
                <div style="margin-top: 6px; font-size: 11px; color: #ffffff; background: rgba(77,171,247,0.18); padding: 4px 8px; border-radius: 4px;">
                    原著分析：数值 ${d.num} 归属于【${d.palaceName}】，数据脉冲已定位至【${d.branchName}位】！
                </div>
            `;
        }

        if (badgeTitle) badgeTitle.innerText = `${d.palaceName} · 数 ${d.num} (${d.branchName}位) 3D 节点`;
        if (badgeDesc) badgeDesc.innerText = `${d.hexName} · ${d.expr}，太乙 81 阵图与 3D 浑天坐标系同步闪耀`;
    }

    // 绑定 81 宫与 729 矩模式切换按钮
    const btnMode81 = document.getElementById("btn-mode-81");
    const btnMode729 = document.getElementById("btn-mode-729");

    if (btnMode81) {
        btnMode81.addEventListener("click", () => {
            currentMode = "81";
            btnMode81.classList.add("active");
            if (btnMode729) btnMode729.classList.remove("active");

            const activePalaceBtn = document.querySelector(".palace-tab-btn.active");
            const palaceKey = activePalaceBtn ? activePalaceBtn.dataset.palace : "all";
            const searchVal = document.getElementById("jgt-search-input") ? document.getElementById("jgt-search-input").value : "";
            renderTable(palaceKey, searchVal);
        });
    }

    if (btnMode729) {
        btnMode729.addEventListener("click", () => {
            currentMode = "729";
            btnMode729.classList.add("active");
            if (btnMode81) btnMode81.classList.remove("active");

            const activePalaceBtn = document.querySelector(".palace-tab-btn.active");
            const palaceKey = activePalaceBtn ? activePalaceBtn.dataset.palace : "all";
            const searchVal = document.getElementById("jgt-search-input") ? document.getElementById("jgt-search-input").value : "";
            renderTable(palaceKey, searchVal);
        });
    }

    // 绑定 9 大宫切选按钮
    document.querySelectorAll(".palace-tab-btn").forEach(btn => {
        btn.addEventListener("click", function() {
            document.querySelectorAll(".palace-tab-btn").forEach(b => b.classList.remove("active"));
            this.classList.add("active");

            this.classList.add("row-click-flash");
            setTimeout(() => this.classList.remove("row-click-flash"), 400);

            const palaceKey = this.dataset.palace;
            const searchVal = document.getElementById("jgt-search-input") ? document.getElementById("jgt-search-input").value : "";
            renderTable(palaceKey, searchVal);
        });
    });

    // 绑定搜索输入框
    const searchInput = document.getElementById("jgt-search-input");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const activePalaceBtn = document.querySelector(".palace-tab-btn.active");
            const palaceKey = activePalaceBtn ? activePalaceBtn.dataset.palace : "all";
            renderTable(palaceKey, e.target.value);
        });
    }

    const resetSearchBtn = document.getElementById("jgt-reset-search");
    if (resetSearchBtn) {
        resetSearchBtn.addEventListener("click", () => {
            if (searchInput) searchInput.value = "";
            const activePalaceBtn = document.querySelector(".palace-tab-btn.active");
            const palaceKey = activePalaceBtn ? activePalaceBtn.dataset.palace : "all";
            renderTable(palaceKey, "");
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

    renderTable("all", "");
});
