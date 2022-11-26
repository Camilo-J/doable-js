import { fromLocalStorage, saveToLocalStorage } from "./utils.js";
import { getTasks } from "./services/task-services.js";

async function listTasks(option = null) {
  let currentpage = option || STORE.currentPage;
  let tasks = await getTasks();
  let newT;

  // console.log(currentpage);
  switch (currentpage) {
    case "important":
      newT = tasks.filter((task) => task.important === true);
      STORE.setTasks(newT);
      break;

    case "Ncompleted":
      newT = tasks.filter((task) => task.completed === false);
      STORE.setTasks(newT);
      break;

    case "Important&Ncompleted":
      newT = tasks.filter((task) => task.completed === false);
      let newT2 = newT.filter((task) => task.important === true);
      STORE.setTasks(newT2);
      break;

    case "homepage":
      STORE.setTasks(tasks);
      break;

    default:
      console.log("hola2");
      break;
  }
}

const STORE = {
  currentPage: fromLocalStorage("current-page") || "login",
  user: null,
  tasks: [],
  setUser(user) {
    this.user = user;
  },
  setCurrentPage(page) {
    saveToLocalStorage("current-page", page);
    this.currentPage = page;
  },
  setTasks(tasks) {
    this.tasks = tasks;
    saveToLocalStorage("Tasks", tasks);
  },
  addTask(task) {
    this.tasks.push(task);
  },
  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  },
  listTasks,
};

export default STORE;
