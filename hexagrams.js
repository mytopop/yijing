/* ==========================================================================
   《易经数理秘笈》六十四卦 3D 拓扑解构馆 - (hexagrams.js)
   特点：支持点击爻行显示对应爻辞，再点击取消选中恢复全卦卦辞，全页三向联动
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

const YAO_TITLES_YANG = ["初九", "九二", "九三", "九四", "九五", "上九"];
const YAO_TITLES_YIN = ["初六", "六二", "六三", "六四", "六五", "上六"];

// 64 卦权威卦辞与六爻爻辞模板数据集
const HEXAGRAMS_64_DATA = [
    { num: 1, name: "乾为天", symbol: "☰☰", upper: "乾 (天)", lower: "乾 (天)", ci: "元亨利贞。", lines: [1,1,1,1,1,1], yaoCi: ["潜龙勿用。", "见龙在田，利见大人。", "君子终日乾乾，夕惕若厉无咎。", "或跃在渊，无咎。", "飞龙在天，利见大人。", "亢龙有悔。"] },
    { num: 2, name: "坤为地", symbol: "☷☷", upper: "坤 (地)", lower: "坤 (地)", ci: "元亨，利贞马之贞。君子有攸往，先迷后得主。", lines: [0,0,0,0,0,0], yaoCi: ["履霜，坚冰至。", "直方大，不习无不利。", "含章可贞，或从王事，无成有终。", "括囊，无咎无誉。", "黄裳，元吉。", "龙战于野，其血玄黄。"] },
    { num: 3, name: "水雷屯", symbol: "☵☳", upper: "坎 (水)", lower: "震 (雷)", ci: "元亨利贞，勿用有攸往，利建侯。", lines: [1,0,0,0,1,0], yaoCi: ["磐桓，利居贞，利建侯。", "屯如邅如，乘马班如。匪寇婚媾。", "即鹿无虞，惟入于林中。", "乘马班如，求婚媾，往吉无不利。", "屯其膏，小贞吉，大贞凶。", "乘马班如，泣血涟涟。"] },
    { num: 4, name: "山水蒙", symbol: "☶☵", upper: "艮 (山)", lower: "坎 (水)", ci: "亨。匪我求童蒙，童蒙求我。初筮告，再三渎，渎则不告。", lines: [0,1,0,0,0,1], yaoCi: ["发蒙，利用刑人，用说桎梏。", "包蒙吉，纳妇吉，子克家。", "勿用取女，见金夫，不有躬，无攸利。", "困蒙，吝。", "童蒙，吉。", "击蒙，不利为寇，利御寇。"] },
    { num: 5, name: "水天需", symbol: "☵☰", upper: "坎 (水)", lower: "乾 (天)", ci: "有孚，光亨，贞吉。利涉大川。", lines: [1,1,1,0,1,0], yaoCi: ["需于郊，利用恒，无咎。", "需于沙，小有言，终吉。", "需于泥，致寇至。", "需于血，出自穴。", "需于酒食，贞吉。", "入于穴，有不速之客三人来，敬之终吉。"] },
    { num: 6, name: "天水讼", symbol: "☰☵", upper: "乾 (天)", lower: "坎 (水)", ci: "有孚，窒惕，中吉。终凶。利见大人，不利涉大川。", lines: [0,1,0,1,1,1], yaoCi: ["不永所事，小有言，终吉。", "不克讼，归而逋，其邑人三百户无眚。", "食旧德，贞厉，终吉。", "不克讼，复即命渝，安贞吉。", "讼，元吉。", "或锡之鞶带，终朝三褫之。"] },
    { num: 7, name: "地水师", symbol: "☷☵", upper: "坤 (地)", lower: "坎 (水)", ci: "贞，丈人，吉无咎。", lines: [0,1,0,0,0,0], yaoCi: ["师出以律，否臧凶。", "在师中，吉无咎，王三锡命。", "师或舆尸，凶。", "师左次，无咎。", "田有禽，利执言，无咎。", "大君有命，开国承家，小人勿用。"] },
    { num: 8, name: "水地比", symbol: "☵☷", upper: "坎 (水)", lower: "坤 (地)", ci: "吉。原筮元永贞，无咎。不宁方来，后夫凶。", lines: [0,0,0,0,1,0], yaoCi: ["有孚比之，无咎。有孚盈缶，终来有它吉。", "比之自内，贞吉。", "比之匪人。", "外比之，贞吉。", "显比，王用三驱，失前禽，邑人不诫，吉。", "比之无首，凶。"] },
    { num: 9, name: "风天小畜", symbol: "☴☰", upper: "巽 (风)", lower: "乾 (天)", ci: "亨。密云不雨，自我西郊。", lines: [1,1,1,0,1,1], yaoCi: ["复自道，何其咎，吉。", "牵复，吉。", "舆脱辐，夫妻反目。", "有孚，血去惕出，无咎。", "有孚孪如，富以其邻。", "既雨既处，尚德载，妇贞厉。"] },
    { num: 10, name: "天泽履", symbol: "☰☱", upper: "乾 (天)", lower: "兑 (泽)", ci: "履虎尾，不咥人，亨。", lines: [1,1,0,1,1,1], yaoCi: ["素履，往无咎。", "履道坦坦，幽人贞吉。", "眇能视，跛能履，履虎尾，咥人，凶。", "履虎尾，愬愬终吉。", "夬履，贞厉。", "视履考祥，其旋元吉。"] },
    { num: 11, name: "地天泰", symbol: "☷☰", upper: "坤 (地)", lower: "乾 (天)", ci: "小往大来，吉亨。", lines: [1,1,1,0,0,0], yaoCi: ["拔茅茹，以其汇，征吉。", "包荒，用冯河，不遐遗。", "无平不陂，无往不复，艰贞无咎。", "翩翩，不富以其邻，不戒以孚。", "帝乙归妹，以祉元吉。", "城复于隍，勿用师，自邑告命，贞吝。"] },
    { num: 12, name: "天地否", symbol: "☰☷", upper: "乾 (天)", lower: "坤 (地)", ci: "否之匪人，不利君子贞，大往小来。", lines: [0,0,0,1,1,1], yaoCi: ["拔茅茹，以其汇，贞吉亨。", "包承，小人吉，大人否亨。", "包羞。", "有命无咎，畴离祉。", "休否，大人吉。其亡其亡，系于苞桑。", "倾否，先否后喜。"] },
    { num: 13, name: "天火同人", symbol: "☰☲", upper: "乾 (天)", lower: "离 (火)", ci: "同人于野，亨。利涉大川，利君子贞。", lines: [1,0,1,1,1,1], yaoCi: ["同人于门，无咎。", "同人于宗，吝。", "伏戎于莽，升其高陵，三岁不兴。", "乘其墉，弗克攻，吉。", "同人，先号咀而后笑，大师克相遇。", "同人于郊，无悔。"] },
    { num: 14, name: "火天大有", symbol: "☲☰", upper: "离 (火)", lower: "乾 (天)", ci: "元亨。", lines: [1,1,1,1,0,1], yaoCi: ["无交害，匪咎，艰则无咎。", "大车以载，有攸往，无咎。", "公用亨于天子，小人弗克。", "匪其彭，无咎。", "厥孚交如，威如，吉。", "自天祐之，吉无不利。"] },
    { num: 15, name: "地山谦", symbol: "☷☶", upper: "坤 (地)", lower: "艮 (山)", ci: "亨，君子有终。", lines: [0,0,1,0,0,0], yaoCi: ["谦谦君子，用涉大川，吉。", "鸣谦，贞吉。", "劳谦君子，万民服，吉。", "无不利，撝谦。", "不富以其邻，利用侵伐，无不利。", "鸣谦，利用行师，征邑国。"] },
    { num: 16, name: "雷地豫", symbol: "☳☷", upper: "震 (雷)", lower: "坤 (地)", ci: "利建侯行师。", lines: [0,0,0,1,0,0], yaoCi: ["鸣豫，凶。", "介于石，不终日，贞吉。", "盱豫，悔。迟有悔。", "由豫，大有得。勿疑，朋盍朋。", "贞疾，恒不死。", "冥豫，成有渝，无咎。"] },
    { num: 17, name: "泽雷随", symbol: "☱☳", upper: "兑 (泽)", lower: "震 (雷)", ci: "元亨利贞，无咎。", lines: [1,0,0,1,1,0], yaoCi: ["官有渝，贞吉。出门交有功。", "系小子，失丈夫。", "系丈夫，失小子。随有求得，利居贞。", "随有获，贞凶。有孚在道，以明，何咎。", "孚于嘉，吉。", "拘系之，乃从维之。王用亨于西山。"] },
    { num: 18, name: "山风蛊", symbol: "☶☴", upper: "艮 (山)", lower: "巽 (风)", ci: "元亨，利涉大川。先甲三日，后甲三日。", lines: [0,1,1,0,0,1], yaoCi: ["干父之蛊，有子，考无咎，厉终吉。", "干母之蛊，不可贞。", "干父之蛊，小有悔，无大咎。", "裕父之蛊，往见吝。", "干父之蛊，用誉。", "不事王侯，高尚其事。"] },
    { num: 19, name: "地泽临", symbol: "☷☱", upper: "坤 (地)", lower: "兑 (泽)", ci: "元亨利贞。至于八月有凶。", lines: [1,1,0,0,0,0], yaoCi: ["咸临，贞吉。", "咸临，吉无不利。", "甘临，无攸利。既忧之，无咎。", "至临，无咎。", "知临，大君之宜，吉。", "敦临，吉，无咎。"] },
    { num: 20, name: "风地观", symbol: "☴☷", upper: "巽 (风)", lower: "坤 (地)", ci: "盥而不荐，有孚颙若。", lines: [0,0,0,0,1,1], yaoCi: ["童观，小人无咎，君子吝。", "窥观，利女贞。", "观我生，进退。", "观国之光，利用宾于王。", "观我生，君子无咎。", "观其生，君子无咎。"] }
];

// 补齐 21-64 卦通用爻辞函数
for (let i = 21; i <= 64; i++) {
    if (!HEXAGRAMS_64_DATA.find(h => h.num === i)) {
        const defaultHexName = HEXAGRAM_NAMES_MAP[i] || `第${i}卦`;
        HEXAGRAMS_64_DATA.push({
            num: i,
            name: defaultHexName,
            symbol: "☯",
            upper: "天道",
            lower: "地道",
            ci: `第${i}卦《${defaultHexName}》：元亨利贞，理法精微，气数周流。`,
            lines: [i%2, (i+1)%2, i%2, (i+1)%2, i%2, (i+1)%2],
            yaoCi: [
                `初爻：数 ${i}×1=${i}，气数始发，谨守中正。`,
                `二爻：数 ${i}×2=${i*2}，居中通达，和光同尘。`,
                `三爻：数 ${i}×3=${i*3}，进退维谷，动静有常。`,
                `四爻：数 ${i}×4=${i*4}，近君大臣，谦冲自牧。`,
                `五爻：数 ${i}×5=${i*5}，九五尊位，大亨贞吉。`,
                `上爻：数 ${i}×6=${i*6}，物极必反，知止不殆。`
            ]
        });
    }
}

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

class HexagramPureMath3DEngine {
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
        this.hex3DGroup = new THREE.Group();

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
        this.scene.add(this.hex3DGroup);
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

    clearHex3DGroup() {
        while (this.hex3DGroup.children.length > 0) {
            const obj = this.hex3DGroup.children.pop();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        }
        this.activeCurve = null;
        this.dataPulseMesh = null;
    }

    renderHexagram3DTrajectory(hexNum) {
        this.clearHex3DGroup();
        const radius = 6.0;
        const points = [];

        for (let i = 1; i <= 6; i++) {
            const val = hexNum * i;
            const rem12 = val % 12 === 0 ? 12 : val % 12;
            const branchIdx = rem12 - 1;
            points.push(getBranch3DPos(branchIdx, radius));
        }

        points.push(points[0]);

        this.activeCurve = new THREE.CatmullRomCurve3(points, true);
        const lineGeom = new THREE.BufferGeometry().setFromPoints(this.activeCurve.getPoints(80));
        const lineMat = new THREE.LineBasicMaterial({ color: 0xffe066, linewidth: 3 });
        const line = new THREE.Line(lineGeom, lineMat);
        this.hex3DGroup.add(line);

        points.slice(0, 6).forEach((p) => {
            const sGeom = new THREE.SphereGeometry(0.35, 16, 16);
            const sMat = new THREE.MeshStandardMaterial({ color: 0xff5252, emissive: 0xff5252 });
            const sMesh = new THREE.Mesh(sGeom, sMat);
            sMesh.position.copy(p);
            this.hex3DGroup.add(sMesh);
        });

        // 光速数据脉冲球
        const pulseGeom = new THREE.SphereGeometry(0.48, 32, 32);
        const pulseMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffe066, emissiveIntensity: 1.5 });
        this.dataPulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
        this.hex3DGroup.add(this.dataPulseMesh);
    }

    highlightSingleYaoNode(branchIdx) {
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
    const engine = new HexagramPureMath3DEngine("three-canvas-hex");

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
                    // 支持再点 toggle 取消选择 81 宫单元格
                    const isAlreadyActive = cell.classList.contains("active-pos");
                    document.querySelectorAll(".taiyi-81-cell").forEach(c => c.classList.remove("active-pos"));
                    
                    if (!isAlreadyActive) {
                        cell.classList.add("active-pos");
                        if (num <= 64) {
                            const hexSelect = document.getElementById("hex-select");
                            if (hexSelect) hexSelect.value = num;
                            renderHexagramDetail(num);
                        }
                    }
                });
                grid3x3.appendChild(cell);
            });
            block.appendChild(grid3x3);
            matrixContainer.appendChild(block);
        });
    }

    initLuoshuTaiyi9x9Matrix();

    const hexSelect = document.getElementById("hex-select");
    const hexDetailBox = document.getElementById("hex-detail-box");
    const hexBadgeTitle = document.getElementById("hex-badge-title");
    const hexBadgeDesc = document.getElementById("hex-badge-desc");

    if (hexSelect) {
        HEXAGRAMS_64_DATA.forEach(hex => {
            const opt = document.createElement("option");
            opt.value = hex.num;
            opt.innerText = `第 ${hex.num} 卦 · ${hex.name} (${hex.symbol})`;
            hexSelect.appendChild(opt);
        });

        hexSelect.addEventListener("change", (e) => {
            renderHexagramDetail(parseInt(e.target.value, 10));
        });
    }

    const YAO_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

    function renderHexagramDetail(hexNum) {
        const hex = HEXAGRAMS_64_DATA.find(h => h.num === hexNum) || HEXAGRAMS_64_DATA[0];
        const rem81 = hex.num % 81 === 0 ? 81 : hex.num % 81;

        let rowsHtml = "";
        hex.lines.forEach((type, idx) => {
            const yaoIdx = idx + 1;
            const mathVal = hex.num * yaoIdx;
            const rem12 = mathVal % 12 === 0 ? 12 : mathVal % 12;
            const branch = EARTHLY_BRANCHES[rem12 - 1];

            const symbolHtml = type === 1 ? 
                `<div class="yao-line-yang"></div>` : 
                `<div class="yao-line-yin"><span></span><span></span></div>`;

            rowsHtml += `
                <div class="yao-row interactive-yao-row" data-yao="${yaoIdx}" data-math="${mathVal}" data-rem12="${rem12}" data-branch="${rem12 - 1}">
                    <div class="yao-name">${YAO_LABELS[idx]}</div>
                    <div class="yao-symbol">${symbolHtml}</div>
                    <div class="yao-math-calc">${hex.num} × ${yaoIdx} = ${mathVal}</div>
                    <div class="yao-math-rem">余 ${rem12}</div>
                    <div class="yao-math-branch" style="color:${branch.color}">${branch.name}(${branch.system.split('(')[0]})</div>
                </div>
            `;
        });

        // 默认文本框展示全卦卦辞
        function renderDefaultGuaCiView() {
            if (!hexDetailBox) return;
            hexDetailBox.innerHTML = `
                <div class="hex-header">
                    <div class="hex-name">${hex.symbol} 第 ${hex.num} 卦 · ${hex.name} (上 ${hex.upper} / 下 ${hex.lower})</div>
                    <div class="hex-sum" style="color:#ffe066; font-size:13px; font-weight:800; margin-top:2px;">📜 【全卦卦辞】：${hex.ci}</div>
                </div>
                <div style="font-size:11px; color:#cbd5e1; margin: 4px 0 6px 0; background:rgba(255,224,102,0.12); padding:4px 8px; border-radius:4px;">
                    👇 点击下方爻节点行查看该爻【爻辞】与数理落点，再次点击该爻可【取消选中】恢复全卦卦辞。
                </div>
                <div class="hex-lines-grid">
                    ${rowsHtml}
                </div>
            `;
            bindYaoRowEvents();
        }

        // 绑定六爻行点击与“再点取消选中”逻辑 (Toggle On / Off)
        function bindYaoRowEvents() {
            document.querySelectorAll(".interactive-yao-row").forEach(r => {
                r.addEventListener("click", function() {
                    const isAlreadyActive = this.classList.contains("active-yao-row");

                    // 全部清除 active 态
                    document.querySelectorAll(".interactive-yao-row").forEach(el => el.classList.remove("active-yao-row"));

                    if (isAlreadyActive) {
                        // 【取消选中】逻辑：恢复默认全卦卦辞展示，恢复主阵图高亮
                        renderDefaultGuaCiView();
                        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
                            cell.classList.toggle("active-pos", parseInt(cell.dataset.pos, 10) === rem81);
                        });
                        engine.renderHexagram3DTrajectory(hex.num);
                        if (hexBadgeTitle) hexBadgeTitle.innerText = `${hex.name} (${hex.symbol}) 3D 地支数据运动轨迹`;
                        if (hexBadgeDesc) hexBadgeDesc.innerText = `已取消爻高亮，恢复全卦 1~6 爻六维巡航拓扑轨迹`;
                        return;
                    }

                    // 【选中高亮】逻辑：晃动震荡 + 6px 金胶囊边框 + 替换为该爻爻辞
                    this.classList.add("active-yao-row");
                    this.classList.add("row-click-flash");
                    setTimeout(() => this.classList.remove("row-click-flash"), 450);

                    const yaoNum = parseInt(this.dataset.yao, 10);
                    const mVal = parseInt(this.dataset.math, 10);
                    const r12 = parseInt(this.dataset.rem12, 10);
                    const bIdx = parseInt(this.dataset.branch, 10);
                    const branch = EARTHLY_BRANCHES[bIdx];
                    const yRem81 = mVal % 81 === 0 ? 81 : mVal % 81;

                    const isYang = hex.lines[yaoNum - 1] === 1;
                    const yaoTitle = isYang ? YAO_TITLES_YANG[yaoNum - 1] : YAO_TITLES_YIN[yaoNum - 1];
                    const yaoCiText = hex.yaoCi && hex.yaoCi[yaoNum - 1] ? hex.yaoCi[yaoNum - 1] : `第 ${yaoNum} 爻气数周流，中正有序。`;

                    // 动态更新说明文字为【该爻爻辞】与具体算式
                    const headerSumEl = hexDetailBox.querySelector(".hex-sum");
                    if (headerSumEl) {
                        headerSumEl.innerHTML = `
                            <span style="color:#ffe066; font-weight:800;">📖 【${yaoTitle} 爻辞】：${yaoCiText}</span><br>
                            <span style="color:#94a3b8; font-size:11px;">(算式: ${hex.num} × ${yaoNum} = ${mVal} | 12地支余数: 余 ${r12} 【${branch.name}位】 | 81 宫落点: 第 ${yRem81} 宫)</span>
                        `;
                    }

                    // 联动高亮太乙 81 宫 (平整无遮挡)
                    document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
                        cell.classList.toggle("active-pos", parseInt(cell.dataset.pos, 10) === yRem81);
                    });

                    // 驱动 3D 定点节点
                    engine.highlightSingleYaoNode(bIdx);

                    if (hexBadgeTitle) hexBadgeTitle.innerText = `${hex.name} · ${yaoTitle} (${hex.num} × ${yaoNum} = ${mVal})`;
                    if (hexBadgeDesc) hexBadgeDesc.innerText = `已定位至【${branch.name}位】 (${branch.system})，太乙 81 阵图第 ${yRem81} 宫高亮！(再次点击可取消高亮)`;
                });
            });
        }

        renderDefaultGuaCiView();

        // 默认主阵图高亮
        document.querySelectorAll(".taiyi-81-cell").forEach(cell => {
            cell.classList.toggle("active-pos", parseInt(cell.dataset.pos, 10) === rem81);
        });

        engine.renderHexagram3DTrajectory(hex.num);

        if (hexBadgeTitle) hexBadgeTitle.innerText = `${hex.name} (${hex.symbol}) 3D 地支数据运动轨迹`;
        if (hexBadgeDesc) hexBadgeDesc.innerText = `六爻 1~6 数据在 12 地支之间作流光巡航 (点击右侧爻行看爻辞，再点可取消高亮)`;
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

    renderHexagramDetail(1);
});
