import DOMHandler from "../dom-handler.js";
import LoginPage from "../pages/login-page.js";
import STORE from "../store.js";
import { logout } from "../services/session-services.js";

function render() {
  return `
    <header class="header" style="${
      STORE.currentPage === "homepage" ? "" : "justify-content: center"
    }">
    <div></div>
      <img src="./assets/images/{ doable }.png" alt="logo-double" >
      <img class="logout" src="./assets/icons/logout.svg" style=" ${
        STORE.currentPage === "homepage" ? "" : "display: none"
      }">
    </header>
`;
}

function listenLogout() {
  const logoutIcon = document.querySelector(".logout");

  logoutIcon.addEventListener("click", async (event) => {
    event.preventDefault();
    console.log("holaaa");
    await logout();
    DOMHandler.load(LoginPage(), document.querySelector("#root"));
  });
}

const renderHeader = () => {
  return {
    toString() {
      return render();
    },
    addListeners() {
      listenLogout();
    },
  };
};
export { renderHeader };
