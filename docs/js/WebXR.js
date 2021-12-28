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

    let camera, scene, renderer;
    let mesh;
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
      const container = document.createElement("div");
      // $FlowFixMe
      document.body.appendChild(container);

      // $FlowFixMe
      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.01,
        40,
      );

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.xr.enabled = true;
      container.appendChild(renderer.domElement);

      var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
      light.position.set(0.5, 1, 0.25);
      scene.add(light);

      const geometry = new THREE.IcosahedronGeometry(0.1, 1);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color("rgb(226,35,213)"),
        shininess: 6,
        flatShading: true,
        transparent: 1,
        opacity: 0.8,
      });

      mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, -0.5);
      scene.add(mesh);

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
