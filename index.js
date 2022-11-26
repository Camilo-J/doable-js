import DOMHandler from "./src/dom-handler.js";
import LoginPage from "./src/pages/login-page.js";
import STORE from "./src/store.js";
import Homepage from "./src/pages/homepage.js";
import { tokenKey, appKey } from "./src/config.js";
const root = document.querySelector("#root");
let modu;
async function init() {
  try {
    const token = sessionStorage.getItem(tokenKey);

    if (!token) throw new Error();
    // await STORE.fetchContacts();

    modu = Homepage;

    await STORE.listTasks();
  } catch (error) {
    sessionStorage.removeItem(tokenKey);
    localStorage.removeItem("Task");
    localStorage.removeItem(appKey);
    modu = LoginPage;
  }

  DOMHandler.load(modu(), root);
}

init();
