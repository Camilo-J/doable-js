import DOMHandler from "./src/dom-handler.js";
import LoginPage from "./src/pages/login-page.js";
import STORE from "./src/store.js";
import Homepage from "./src/pages/homepage.js";
import { tokenKey, appKey } from "./src/config.js";
import { getTasks } from "./src/services/task-services.js";
// import { login } from "./src/services/session-services.js"
// import { getUser } from "./src /services/user-services";
const root = document.querySelector("#root");
let modu;
async function init() {
  try {
    const token = sessionStorage.getItem(tokenKey);
    console.log(token);
    if (!token) throw new Error();
    // await STORE.fetchContacts();

    // console.log(STORE.contacts);
    modu = Homepage;

    let tasks = await getTasks();
    STORE.setTasks(tasks);
  } catch (error) {
    sessionStorage.removeItem(tokenKey);
    modu = LoginPage;
  }

  DOMHandler.load(modu(), root);
}

init();
