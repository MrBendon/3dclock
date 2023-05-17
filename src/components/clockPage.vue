<template>
  <div class="divBox w-full h-screen bg-gradient-to-b from-slate-900 to-blue-700"></div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
// import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

let scene, camera, renderer, object3DSphere;
export default {
  data() {
    return {};
  },
  methods: {
    create3D() {
      scene = new THREE.Scene(); //建立場景
      this.initAxesHelper(); //建立輔助軸線
      this.initCamera(); // 建立相機
      this.initRenderer(); // 建立渲染器
      this.initControls(); // 設置相機軌道控制器
      this.initLight(); // 設置燈光
      //   this.HDRTextureCreate();

      // 加入物件
      this.ObjectCreateFloor(); // 新增地面
      this.ObjectCreateWall(); // 新增牆壁
      this.ObjectCreateEarth(); // 放入地球
      this.ObjectCreateTree(); // 訪入樹木
      this.initClock(); //放入時鐘
      this.ObjectCreateTitle();

      //動畫
      function animate() {
        object3DSphere.rotation.x += 0.01;
        object3DSphere.rotation.y += 0.01;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }
      // 貼到template上
      document.querySelector(".divBox").appendChild(renderer.domElement);
      animate();
    },
    HDRTextureCreate() {
      const loader = new THREE.DataTextureLoader();
      loader.load("img/HDR.hdr", function (texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        scene.environment = texture;
      });
    },
    ObjectCreateFloor() {
      const geometryPlane = new THREE.BoxGeometry(100, 5, 50); // 幾何體
      const texture2 = new THREE.TextureLoader().load("img/turf.jpg");
      const material = new THREE.MeshPhongMaterial({ map: texture2 });
      // 應用上面的圖形與材質建立物體
      const Plane = new THREE.Mesh(geometryPlane, material);
      Plane.position.set(0, -25, 20);

      Plane.receiveShadow = true;
      // 將物體1加到場景中
      scene.add(Plane);
    },
    ObjectCreateEarth() {
      const geometrySphere = new THREE.SphereGeometry(10, 32, 16); //圓型體
      const textureSphere = new THREE.TextureLoader().load("img/earth.jpeg");
      const materialSphere = new THREE.MeshPhongMaterial({ map: textureSphere });

      // 應用上面的圖形與材質建立物體
      object3DSphere = new THREE.Mesh(geometrySphere, materialSphere);
      //   object3DSphere.rotate.x += 0.01;
      //   object3DSphere.rotate.y += 0.01;
      object3DSphere.position.set(0, 0, 10);
      object3DSphere.receiveShadow = true;
      object3DSphere.castShadow = true;

      // 將物體2加到場景中
      scene.add(object3DSphere);
    },
    ObjectCreateWall() {
      /////////////////////// 牆壁
      const geometryBox = new THREE.BoxGeometry(100, 70, 2); // 幾何體
      const texture = new THREE.TextureLoader().load("img/wall-texture.jpeg");
      const materialBox = new THREE.MeshPhongMaterial({ map: texture });

      // 應用上面的圖形與材質建立物體
      const object3DBox = new THREE.Mesh(geometryBox, materialBox);
      object3DBox.position.set(0, 10, -5);
      object3DBox.receiveShadow = true;
      object3DBox.castShadow = true;

      // 將物體2加到場景中
      scene.add(object3DBox);
    },
    ObjectCreateTitle() {
      const loader = new FontLoader();
      loader.load("font/gentilis_regular.typeface.json", function (font) {
        const textgeometry = new TextGeometry(`Hello Luci`, {
          font: font,
          size: 6, //  文字大小
          height: 2, //文字厚度
          curveSegments: 12, //文字曲線解析度
        });
        // 設定圖形材質
        const textMateial = new THREE.MeshPhongMaterial({
          color: 0x87cefa,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        });

        // 應用上面的圖形與材質建立物體
        const object3DText = new THREE.Mesh(textgeometry, textMateial);
        object3DText.position.set(10, -22, 10);
        object3DText.castShadow = true;
        // object3DText.receiveShadow = true;
        //   object3DText.rotation.x = Math.PI / 2;
        // 將物體加到場景中
        scene.add(object3DText);
      });
    },
    ObjectCreateTree() {
      const TrunkGeometry = new THREE.CylinderGeometry(5, 5, 20, 32);
      const TrunkTexture = new THREE.TextureLoader().load("img/tree.jpeg");
      const TrunkMaterial = new THREE.MeshPhongMaterial({ map: TrunkTexture });
      const TrunkCylinder = new THREE.Mesh(TrunkGeometry, TrunkMaterial);
      TrunkCylinder.position.set(-30, -15, 15);
      TrunkCylinder.receiveShadow = true;
      TrunkCylinder.castShadow = true;
      scene.add(TrunkCylinder);

      const LeavesGeometry = new THREE.ConeGeometry(15, 20, 32);
      const LeavesTexture = new THREE.TextureLoader().load("img/leave.jpeg");
      const LeavesMaterial = new THREE.MeshPhongMaterial({ map: LeavesTexture });
      const LeavesCone = new THREE.Mesh(LeavesGeometry, LeavesMaterial);
      LeavesCone.receiveShadow = true;
      LeavesCone.castShadow = true;

      LeavesCone.position.set(-30, 5, 15);
      scene.add(LeavesCone);

      const LeavesCone2 = LeavesCone.clone();
      LeavesCone2.position.set(-30, 15, 15);
      scene.add(LeavesCone2);
    },
    initClock() {
      let Time = this.createTime();

      function renderText() {
        const textContent = `${Time.Hours}:${Time.Minutes}:${Time.Seconds}`;
        const loader = new FontLoader();
        loader.load("font/gentilis_regular.typeface.json", function (font) {
          const textgeometry = new TextGeometry(`${textContent}`, {
            font: font,
            size: 4, //  文字大小
            height: 1, //文字厚度
            curveSegments: 12, //文字曲線解析度
          });
          // 設定圖形材質
          const textMateial = new THREE.MeshPhongMaterial({
            color: 0x778899,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide,
          });

          // 應用上面的圖形與材質建立物體
          const object3DText = new THREE.Mesh(textgeometry, textMateial);
          object3DText.position.set(25, 20, 1);
          object3DText.castShadow = true;
          //   object3DText.rotation.x = Math.PI / 2;
          // 將物體加到場景中
          scene.add(object3DText);
          setTimeout(() => {
            scene.remove(object3DText);
          }, 1000);
        });
      }
      setInterval(() => {
        renderText();
        Time = this.createTime();
      }, 1000);
    },
    initAxesHelper() {
      //建立輔助軸線
      //X軸為紅色，Y軸綠色、Z軸藍色，
      const axesHelper = new THREE.AxesHelper(50);
      scene.add(axesHelper);
    },
    initCamera() {
      camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      // 設定相機初始位置
      camera.position.set(0, -10, 60);
      camera.lookAt(0, 0, 0);
    },
    initControls() {
      // 設置相機軌道控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.update();
    },
    initRenderer() {
      // 建立渲染器
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight); // 場景大小
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.shadowMap.enabled = true; // 開啟渲染陰影效果

      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    },
    initLight() {
      // 環境光設置
      //   scene.add(new THREE.AmbientLight(0xffffff, 0.3));

      // 點光源設置
      const Light1 = new THREE.PointLight(0xffffff, 0.75, 1000);
      // X軸為紅色，Y軸綠色、Z軸藍色，
      Light1.position.set(20, 30, 20);
      Light1.castShadow = true;
      Light1.shadow.mapSize.width = 100;
      Light1.shadow.mapSize.height = 100;
      // 增加到場景中
      scene.add(Light1);
      //   設置聚光燈 SpotLight
      const spotLight = new THREE.SpotLight(0xfaf0e6, 1, 100);
      spotLight.position.set(0, 20, 50);
      spotLight.castShadow = true;
      scene.add(spotLight);
    },
    createTime() {
      const nowTimeStamp = Date.now();
      const timeObject = new Date(nowTimeStamp);
      let Hours = timeObject.getHours();
      let Minutes = timeObject.getMinutes();
      let Seconds = timeObject.getSeconds();
      if (Hours < 10) {
        Hours = "0" + Hours;
      }
      if (Minutes < 10) {
        Minutes = "0" + Minutes;
      }
      if (Seconds < 10) {
        Seconds = "0" + Seconds;
      }
      const TimeObj = {
        Hours: Hours,
        Minutes: Minutes,
        Seconds: Seconds,
      };
      return TimeObj;
    },
  },

  mounted() {
    this.create3D();
    this.createTime();
  },
};
</script>
