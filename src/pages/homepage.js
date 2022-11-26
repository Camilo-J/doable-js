import STORE from "../store.js";
import DOMHandler from "../dom-handler.js";
import { input } from "../components/input.js";
import { createTask, editTask, getTasks } from "../services/task-services.js";
import { renderHeader } from "../components/header.js";

function renderTask(task) {
  return `<div class="js-task flex gap-4 ${
    task.completed ? "checked" : ""
  }" id="task-${task.id}">
  <input type="checkbox" name="task" id="${
    task.id
  }" class="checkbox checkbox__input check check--self" ${
    task.completed ? "checked" : ""
  } style="margin-top: 0.25rem">
  <div class="task__content full-width">
      <div class="flex gap-4 task__header justify-between">
          <p class="w-600">${task.title}</p>
          <i class="ri-error-warning-fill ri-lg" style="line-height: 1.3rem;"hidden></i>
          
          <i class="import ri-error-warning-fill ri-lg" style="line-height: 1.3rem; color: ${
            task.important
              ? task.completed
                ? "#F9A8D4"
                : "#EC4899"
              : "#D1D5DB"
          }" id="${task.id}"></i>
      </div>
      <p class="task__date content-sm w-400">${new Date(
        task.due_date
      ).toLocaleString("en-US", {
        weekday: "long", // long, short, narrow
        month: "long", // numeric, 2-digit, long, short, narrow
        day: "numeric", // numeric, 2-digit
      })}</p>
  </div>
</div>`;
}

function render() {
  let tasks = STORE.tasks;
  return `
    ${renderHeader()}
    <main class="section-sm flex flex-column gap-16-06 ">
    <div class="flex flex-column gap-4 ">
        <section class="main__header flex flex-column gap-4">
            <div class=" flex gap-4">
                <p class="content-sm w-500">Sort</p>
                <select name="sort" id="sort" class="select select__input ">
                <option value="Option">Select Option</option>
                    <option value="Alphabetical">Alphabetical(a-z)</option>
                    <option value="Date">Due date</option>
                    <option value="Importance">Importance</option>
                </select>
            </div>
            <div class="flex gap-4">
                <p class="content-sm w-500">Show </p>
                <div class="flex gap-2 ">
                <input class="checkbox checkbox__input checkbox--optionList" type="checkbox" name="Ncompleted" id="Ncompleted" ${
                  STORE.currentPage === "Ncompleted" ||
                  STORE.currentPage === "Important&Ncompleted"
                    ? "checked"
                    : ""
                } >
                <label class="content-sm w-500" for="Ncompleted">Only pending</label>
                </div>  
                <div class="flex gap-2 w-500">
                <input class="checkbox checkbox__input checkbox--optionList" type="checkbox" name="important" id="important" ${
                  STORE.currentPage === "important" ||
                  STORE.currentPage === "Important&Ncompleted"
                    ? "checked"
                    : ""
                } >
                <label class="content-sm w-500" for="important">Only Important</label>
                </div>      
            </div>
        </section>
        <section class="main__list">
            <!-- <label for="aea"> -->
            ${tasks.map(renderTask).join("")}
            <!-- </label> -->
        </section>
    </div>
        <form class="full-width container-sm flex flex-column gap-4 task-form form-self">
        ${input({
          id: "title",
          required: true,
          type: "text",
          placeholder: "Do the dishes...",
        })}
        ${input({
          id: "due_date",
          required: true,
          type: "date",
          placeholder: "mm/dd/yy",
        })}
        <button class="button button--primary width-full">Add  task</button>
      </form>
    </main>
`;
}

function listenCheck() {
  const listDivs = document.querySelectorAll(".check");

  listDivs.forEach((task) => {
    task.addEventListener("change", async (event) => {
      const taskGotten = event.target.closest(`#task-${task.id}`);
      if (!taskGotten) return;
      if (task.checked) {
        taskGotten.classList.add("checked");
        editTask({ completed: true }, task.id);
      } else {
        taskGotten.classList.remove("checked");
        editTask({ completed: false }, task.id);
      }
    });
  });
}

function listenCheckList() {
  const listcheck = document.querySelectorAll(".checkbox--optionList");

  listcheck.forEach((task) => {
    task.addEventListener("change", async (event) => {
      event.target.setAttribute("checked", "");
      const option = event.target.id;
      let currentpa, newT;
      if (task.checked) {
        switch (option) {
          case "important":
            newT = STORE.tasks.filter((task) => task.important === true);
            STORE.setTasks(newT);
            currentpa =
              STORE.currentPage === "Ncompleted"
                ? "Important&Ncompleted"
                : "important";
            break;

          case "Ncompleted":
            newT = STORE.tasks.filter((task) => task.completed === false);
            STORE.setTasks(newT);
            currentpa =
              STORE.currentPage === "important"
                ? "Important&Ncompleted"
                : "Ncompleted";
            break;

          default:
            break;
        }
        STORE.setCurrentPage(currentpa);
        DOMHandler.reload();
      } else {
        switch (option) {
          case "important":
            currentpa =
              STORE.currentPage === "Important&Ncompleted"
                ? "Ncompleted"
                : "homepage";
            break;

          case "Ncompleted":
            currentpa =
              STORE.currentPage === "Important&Ncompleted"
                ? "important"
                : "homepage";
            break;

          default:
            break;
        }
        STORE.setCurrentPage(currentpa);
        await STORE.listTasks();
        DOMHandler.reload();
      }
    });
  });
}

function listenSelectSort() {
  const select = document.querySelector(".select");
  select.addEventListener("change", function (e) {
    const option = e.target.value;
    // console.log(e.target.value);
    let data = STORE.tasks;
    let sorta;
    switch (option) {
      case "Alphabetical":
        sorta = data.sort(function (a, b) {
          if (a.title < b.title) return -1;

          if (a.title > b.title) return 1;

          return 0;
        });
        STORE.setTasks(sorta);
        DOMHandler.reload();
        break;

      case "Date":
        sorta = data.sort(function (a, b) {
          if (a.due_date < b.due_date) return 1;

          if (a.due_date > b.due_date) return -1;

          return 0;
        });
        STORE.setTasks(sorta);
        DOMHandler.reload();
        break;

      case "Importance":
        sorta = data.sort(function (a, b) {
          if (a.important > b.important) return -1;

          if (a.important < b.important) return 1;

          return 0;
        });
        STORE.setTasks(sorta);
        DOMHandler.reload();
        break;

      default:
        break;
    }
  });
}

function listenSubmit() {
  const form = document.querySelector(".task-form ");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const { title, due_date } = e.target;
    const dataTask = {
      title: title.value,
      due_date: due_date.value,
    };
    const newTask = await createTask(dataTask);
    STORE.addTask(newTask);
    DOMHandler.reload();
  });
}

function listenImportant() {
  const iconsI = document.querySelectorAll(".import");

  iconsI.forEach((icon) => {
    icon.addEventListener("click", () => {
      const task = STORE.tasks.find((task) => task.id == icon.id);
      if (!task) return;

      if (task.important) {
        task.important = false;
        editTask({ important: false }, task.id);
      } else {
        task.important = true;
        editTask({ important: true }, task.id);
      }
      STORE.deleteTask(task.id);
      STORE.addTask(task);
      DOMHandler.reload();
    });
  });
}

function Homepage() {
  return {
    toString() {
      return render();
    },
    addListeners() {
      listenCheck();
      listenSubmit();
      listenCheckList();
      listenSelectSort();
      renderHeader().addListeners();
      listenImportant();
    },
  };
}

export default Homepage;
