import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// シーン、カメラ、レンダラーを作成
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xfff8e1);
document.body.appendChild(renderer.domElement);

// カメラの位置を設定
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);

// OrbitControlsを追加​
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;


// ライトを追加
const light = new THREE.PointLight(0xffffff, 5, 50);
light.position.set(3, 3, 3);
scene.add(light);

// 座標軸を表示
const axesHelper = new THREE.AxesHelper(20);
scene.add(axesHelper);



//
// レール寸法の定義
//
const RAIL_CENTER_RADIUS = 10;   // レール中心半径
const RAIL_WIDTH = 1.5;          // レール幅（線路間隔）
const INNER_RADIUS = RAIL_CENTER_RADIUS - RAIL_WIDTH / 2;
const OUTER_RADIUS = RAIL_CENTER_RADIUS + RAIL_WIDTH / 2;

//
// レールマテリアル
//
const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x777777,
    roughness: 0.4,
    metalness: 0.2,
});


// RailGroup
const RailGroup = new THREE.Group();

// 内側レール
const innerRail = new THREE.Mesh(
    new THREE.TorusGeometry(INNER_RADIUS, 0.03, 12, 128),
    railMaterial
);

innerRail.rotation.x = Math.PI / 2;

// 外側レール
const outerRail = new THREE.Mesh(
    new THREE.TorusGeometry(OUTER_RADIUS, 0.03, 12, 128),
    railMaterial
);

outerRail.rotation.x = Math.PI / 2;

// 枕木の形状
const sleeperGeometry = new THREE.BoxGeometry(
    0.18,  // 幅
    0.12,  // 高さ
    2.0   // 長さ
);

// 枕木の材質
const sleeperMaterial = new THREE.MeshStandardMaterial({
    color: 0x79502b
});

// 枕木の原型
const sleeperTemplate = new THREE.Mesh(
    sleeperGeometry,
    sleeperMaterial
);

// 枕木をまとめるGroup
const sleepersGroup = new THREE.Group();

// 30本の枕木を配置
for (let i = 0; i < 30; i++) {

    // 回転の中心となるGroup
    const pivot = new THREE.Group();

    // 枕木を複製
    const sleeper = sleeperTemplate.clone();

    // 円の中心から9.5離れた位置に置く
    sleeper.position.set(0, -0.1, RAIL_CENTER_RADIUS);

    pivot.add(sleeper);

    // 12度ずつ回転
    pivot.rotation.y = i * Math.PI * 2 / 30;

    sleepersGroup.add(pivot);
}

//scene.add(sleepersGroup);



//
// Groupへ追加
//
RailGroup.add(innerRail);
RailGroup.add(outerRail);
RailGroup.add(sleepersGroup);

scene.add(RailGroup);

// アニメーション 
function animate() {
 requestAnimationFrame(animate);
 // グループ全体をY軸の周りに回転 
 light.rotation.y += 0.01;
 renderer.render(scene, camera); 
} 
animate();