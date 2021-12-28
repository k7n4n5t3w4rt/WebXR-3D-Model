// @flow
import { h, render } from "../web_modules/preact.js";
import {
  useContext,
  useEffect,
  useState,
} from "../web_modules/preact/hooks.js";
import { html } from "../web_modules/htm/preact.js";
import {
  rawStyles,
  createStyles,
  setSeed,
} from "../web_modules/simplestyle-js.js";
import { AppContext } from "./AppContext.js";
import { ARButton } from "./vendor/ARButton.js";
import Stats from "./vendor/stats.module.js";
import { simpleCssSeed } from "./simpleCssSeed.js";

setSeed(simpleCssSeed("WebXR"));

rawStyles({
  html: {
    height: "100%",
  },
  body: {
    height: "100%",
  },
});

const [styles] = createStyles({});

/*::
type Props = {};
*/
const WebXR = (props /*: Props */) /*: string */ => {
  //   const [state /*: AppState */, dispatch] = useContext(AppContext);
  //   const [count /*: number */, setCount] = useState(props.count);

  useEffect(() => {
    setupMobileDebug();

    let camera, scene, renderer, loader;
    let stats;

    init();
    animate();

    function createStats() {
      stats = new Stats();
      stats.setMode(0);

      // assign css to align it properly on the page
      stats.domElement.style.position = "absolute";
      stats.domElement.style.left = "0";
      stats.domElement.style.top = "0";
    }

    function setupMobileDebug() {
      // First thing we do is setup the mobile debug console
      // This library is very big so only use it while debugging
      // just comment it out when your app is done
      const containerEl = document.getElementById("console-ui");
      if (containerEl !== undefined) {
        // $FlowFixMe
        eruda.init({
          container: containerEl,
        });
        // $FlowFixMe
        const devToolEl = containerEl.shadowRoot.querySelector(
          ".eruda-dev-tools",
        );
        if (devToolEl !== undefined) {
          // $FlowFixMe
          devToolEl.style.height = "40%"; // control the height of the dev tool panel
        }
      }
    }

    // let i = 0;
    // function logsForMobileDebug() {
    //   console.log(i++);
    // }

    function init() {
      // CANVAS
      const container = document.createElement("div");
      // $FlowFixMe
      document.body.firstElementChild.appendChild(container);

      // SCENE
      // $FlowFixMe
      scene = new THREE.Scene();

      // CAMERA
      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        40,
      );

      // RENDERER
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      // LIGHT
      var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      // MODEL
      const modelUrl =
        "https://raw.githubusercontent.com/immersive-web/webxr-samples/main/media/gltf/space/space.gltf";
      // DOCS: https://threejs.org/docs/#api/en/loaders/Loader
      // Loaded in /index.html with a <script> tag.
      // Shit docs - https://threejs.org/docs/#api/en/loaders/Loader.load
      // Loaders for other formats: https://github.com/mrdoob/three.js/tree/dev/examples/js/loaders
      loader = new THREE.GLTFLoader();
      // loader takes in a few arguments loader(model url, onLoad callback, onProgress callback, onError callback)
      loader.load(
        // model URL
        modelUrl,
        // onLoad callback: what get's called once the full model has loaded
        function (gltf) {
          // gltf.scene contains the Three.js object group that represents the 3d object of the model
          // you can optionally change the position of the model
          // gltf.scene.position.z = -10; // negative Z moves the model in the opposite direction the camera is facing
          // gltf.scene.position.y = 5; // positive Y moves the model up
          // gltf.scene.position.x = 10; // positive X moves hte model to the right
          scene.add(gltf.scene);
          console.log("Model added to scene");
        },
        // onProgress callback: optional function for showing progress on model load
        function (xhr) {
          // console.log((xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        // onError callback
        function (error) {
          console.error(error);
        },
      );

      const button = ARButton.createButton(renderer, {
        optionalFeatures: ["dom-overlay", "dom-overlay-for-handheld-ar"],
        domOverlay: {
          root: document.body,
        },
      });
      // $FlowFixMe
      document.body.appendChild(button);

      // add a framerate pane to the page
      createStats();
      // $FlowFixMe
      document.body.appendChild(stats.domElement); // append the stats panel to the page
      window.addEventListener("resize", onWindowResize, false);
    }

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animate() {
      renderer.setAnimationLoop(renderARScene);
    }

    function renderARScene() {
      renderer.render(scene, camera);
      stats.update(); // stats object calculates the amount of time in between frames
    }
  });

  // console.log(props.count.isInteger());
  return html`
    <div>
      <div id="console-ui"></div>
    </div>
  `;
};

export default WebXR;
