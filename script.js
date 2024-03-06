import * as THREE from 'https://cdn.skypack.dev/three@0.136.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.136.0/examples/jsm/loaders/GLTFLoader.js';

document.addEventListener(
    'contextmenu',
    function(e) {
        e.preventDefault();
    }
)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ui = document.createElement('span')
ui.id = 'ui'
ui.style = `
position: absolute;
top: 10px;
left: 10px;
display: none;
color: #0f0;
background-color: #000;
font-family: monospace;
z-index: 2;
`
ui.innerHTML = "Loading debug..."
document.body.appendChild(ui)


const playergeom = new THREE.BoxGeometry(1, 3, 1);
const playermat = new THREE.MeshBasicMaterial({color: 0x00ff00});
const player = new THREE.Mesh(playergeom, playermat);
scene.add(player);
player.position.y = 3;

let s;
const loader = new GLTFLoader();
loader.load('scene.gltf', function(gltf) {
    s = gltf.scene;
    scene.add(s);
    s.position.y = 0.5;
}, undefined, function(error) {
    console.error(error);
});


var keys = {};
window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
});
window.addEventListener("keyup", function(e) {
    keys[e.key] = false;
});

// iterate through every element with class 'control' (mobile controls)
document.querySelectorAll('.control').forEach(function(element) {
    element.addEventListener('touchstart', function(e) {
        keys[element.id] = true;
    });
    element.addEventListener('touchend', function(e) {
        keys[element.id] = false;
    });
})

let isTouchscreen;

var camoff = 0
function anim() {
    if (navigator.maxTouchPoints > 0) {
        isTouchscreen = true;
    } else {
        isTouchscreen = false;
    }
    if (keys["w"]) {
        player.translateZ(-0.1)
    }
    if (keys["s"]) {
        player.translateZ(0.1)
    }
    if (keys["a"]) {
        player.rotateY(0.1)
    }
    if (keys["d"]) {
        player.rotateY(-0.1)
    }
    if (keys[" "]) {
        ui.style.display = "block"
    } else {
        ui.style.display = "none"
    }
    if (keys["ArrowUp"]) {
        camoff += 0.1
    }
    if (keys["ArrowDown"]) {
        camoff -= 0.1
    }

    if (isTouchscreen) {
        document.getElementById("touchcontrols").style.display = "block"
    } else {
        document.getElementById("touchcontrols").style.display = "none"
    }

    if (camoff > 1) {
        camoff = 1
    }
    if (camoff < -1) {
        camoff = -1
    }
    camera.position.set(player.position.x, player.position.y+0.5, player.position.z)
    camera.rotation.set(player.rotation.x, player.rotation.y, player.rotation.z)

    camera.rotateX(camoff)


    if (player.position.x < -4) {
        player.position.x = -4
    }
    if (player.position.x > 4) {
        player.position.x = 4
    }
    if (player.position.z > 3.2) {
        player.position.z = 3.2
    }
    if (player.position.z < -4) {
        player.position.z = -4
    }

    ui.innerHTML = `Debug info:
<br>X: ${player.position.x.toFixed(2)}
<br>Y: ${player.position.y.toFixed(2)}
<br>Z: ${player.position.z.toFixed(2)}
<br>NeckAngle: ${camoff}
<br>Yaw: ${player.rotation.y.toFixed(2)}
<br>IsTouchscreen: ${isTouchscreen}`
    
    requestAnimationFrame(anim);
    renderer.render(scene, camera);
};
anim();