<template>
  <div class="desc w-full h-40 bg-slate-300">Description</div>
</template>

<script>
import * as THREE from "three";
export default {
  methods: {
    createElement() {
      const scene = new THREE.Scene(); //建立場景

      // 建立渲染器
      const renderer = new THREE.WebGLRenderer({
        // canvas: document.querySelector("#canvas"),
      });
      renderer.setSize(window.innerWidth, window.innerHeight); // 場景大小
      renderer.setClearColor(0xeeeeee, 1.0); // 預設背景顏色
      renderer.shadowMap.enable = true; // 陰影效果

      // 建立相機
      const camera = new THREE.PerspectiveCamera(45, window.canvasWidth / window.canvasHeight, 0.1, 100);
      camera.position.set(10, 10, 10); //相機位置
      camera.lookAt(scene.position); // 相機焦點
      scene.add(camera);

      //建立光源
      let pointLight = new THREE.PointLight(0xffffff);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      //建立物體
      const geometry = new THREE.BoxGeometry(1, 1, 1); // 幾何體
      const material = new THREE.MeshPhongMaterial({
        color: 0x0000ff,
      }); // 材質
      const cube = new THREE.Mesh(geometry, material); // 建立網格物件
      cube.position.set(0, 0, 0);
      scene.add(cube);
      document.querySelector(".desc").appendChild(renderer.domElement);
    },
    createAnimate() {},
  },
  mounted() {
    this.createElement();
  },
};
</script>
