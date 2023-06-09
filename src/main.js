import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import './assets/tailwind.css'

const app = createApp(App);

// const scene = new THREE.Scene();
// app.use(THREE);

app.use(store).mount("#app");
