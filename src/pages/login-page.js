import DOMHandler from "../dom-handler.js";
import SignupPage from "./signup-page.js";
import STORE from "../store.js";
import Homepage from "./homepage.js";
import { input } from "../components/input.js";
import { login } from "../services/session-services.js";
import { getTasks } from "../services/task-services.js";
import { renderHeader } from "../components/header.js";

function render() {
  return `
  ${renderHeader()}
  <section class="section-sm">
    <div class="container flex flex-column gap-8 items-center">
      <h1 class="heading">Login</h1>
      <form action="" class="full-width container-sm flex flex-column gap-4 js-login-form">
        ${input({
          label: "Email",
          id: "email",
          required: true,
          error: this.state.errors.username,
        })}
        ${input({
          label: "Password",
          id: "password",
          required: true,
          error: this.state.errors.password,
          type: "password",
          placeholder: "******",
        })}
        <button type="submit" class="button button--primary width-full">
          Login
        </button>
      </form>
      ${
        this.state.errors.form
          ? `<p class="error-300"> ${this.state.errors.form}</p>`
          : ""
      }
      <a class="js-create-account">Create Account</a>
    </div>
  </section>
`;
}

function listenSubmit() {
  // Buscar un punto de referencia para agregar el listener
  const form = document.querySelector(".js-login-form");

  // Agregar un listener con su captura del evento.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { email, password } = event.target;
    const credentials = {
      email: email.value,
      password: password.value,
    };
    try {
      await login(credentials);

      // Guardo en el STORE
      STORE.setCurrentPage("homepage");
      let tasks = await getTasks();
      STORE.setTasks(tasks);
      DOMHandler.load(Homepage(), document.querySelector("#root"));
    } catch (error) {
      this.state.errors.form = error.message;
      DOMHandler.reload();
    }
  });
}

function listenCreateAccount() {
  // Buscar un punto de referencia para agregar el listener
  const link = document.querySelector(".js-create-account");

  // Agregar un listener con su captura del evento.
  link.addEventListener("click", (event) => {
    event.preventDefault();

    STORE.setCurrentPage("signup");
    DOMHandler.load(SignupPage(), document.querySelector("#root"));
  });
}

function LoginPage() {
  return {
    toString() {
      return render.call(this);
    },
    addListeners() {
      listenSubmit.call(this);
      listenCreateAccount();
    },
    state: {
      errors: {},
      testPage: "LoginPage",
    },
  };
}

export default LoginPage;
