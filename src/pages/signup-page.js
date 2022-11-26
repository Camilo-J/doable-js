import DOMHandler from "../dom-handler.js";
import STORE from "../store.js";
import LoginPage from "./login-page.js";
import Homepage from "./homepage.js";
import { input } from "../components/input.js";
import { createUser } from "../services/user-services.js";
import { renderHeader } from "../components/header.js";
import { getTasks } from "../services/task-services.js";

function render() {
  return `
  ${renderHeader()}
  <section class="section-sm">
    <div class="container flex flex-column gap-8 items-center">
      <h1 class="heading">Create Account</h1>
      <form action="" class="full-width container-sm flex flex-column gap-4 js-signup-form">
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
        <button type="submit" class="button button--secondary width-full">
          Create Account
        </button>
      </form>
      ${
        this.state.errors.form
          ? `<p class="error-300"> ${this.state.errors.form}</p>`
          : ""
      }
      <a class="js-login-link">Login</a>
    </div>
  </section>
`;
}

function listenSubmit() {
  // Buscar un punto de referencia para agregar el listener
  const form = document.querySelector(".js-signup-form");

  // Agregar un listener con su captura del evento.
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const { email, password } = event.target;
    const credentials = {
      email: email.value,
      password: password.value,
    };

    try {
      const token = await createUser(credentials);

      STORE.setCurrentPage("homepage");

      let tasks = await getTasks();
      STORE.setTasks(tasks);
      console.log(STORE.tasks);
      // Redirrecionar a la vista de las listas!
      DOMHandler.load(Homepage(), document.querySelector("#root"));
    } catch (error) {
      const formErrors = JSON.parse(error.message);
      this.state.errors = formErrors;
      DOMHandler.reload();
    }
  });
}

function listenLoginLink() {
  // Buscar un punto de referencia para agregar el listener
  const link = document.querySelector(".js-login-link");

  // Agregar un listener con su captura del evento.
  link.addEventListener("click", (event) => {
    event.preventDefault();

    STORE.setCurrentPage("login");
    DOMHandler.load(LoginPage(), document.querySelector("#root"));
  });
}

function SignupPage() {
  return {
    toString() {
      return render.call(this);
    },
    addListeners() {
      listenSubmit.call(this);
      listenLoginLink();
    },
    state: {
      errors: {},
      testPage: "SignupPage",
    },
  };
}

export default SignupPage;
