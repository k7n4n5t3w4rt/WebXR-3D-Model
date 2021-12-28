// @flow
import { h } from "../web_modules/preact.js";
import WebXR from "./WebXR.js";
import Counter from "./Counter.js";
import Router from "../web_modules/preact-router.js";
import { html } from "../web_modules/htm/preact.js";
import { AppProvider } from "./AppContext.js";

/*::
type Props = {
  url: string
};
*/
const App /*: function */ = (props /*: Props */) => {
  return html`
    <${AppProvider} >
      <${Router} url="${props.url}">
        <${Counter} count="1" path="/" />
        <${WebXR} path="/webxr" />
        <${Counter} count="6" path="/this/is/a/test/of/the/cache/script" />
      </${Router}>
    </${AppProvider} >
  `;
};

export default App;
