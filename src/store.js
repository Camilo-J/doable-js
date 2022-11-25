import { fromLocalStorage, saveToLocalStorage } from "./utils.js";

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
  },
  addTask(task) {
    this.tasks.push(task);
  },
  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  },
};

export default STORE;
