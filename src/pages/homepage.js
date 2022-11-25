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
  }" class="check check--self" ${task.completed ? "checked" : ""}>
  <div class="task__content">
      <div class="flex gap-4 task__header">
          <p>${task.title}</p>
          <i class="ri-error-warning-fill ri-lg" style="line-height: 1.3rem; color: ${
            task.important
              ? task.completed
                ? "#F9A8D4"
                : "#EC4899"
              : "#D1D5DB"
          }"></i>
      </div>
      <p class="task__date">${task.due_date}</p>
  </div>
</div>`;
}

function render() {
  let tasks = STORE.tasks;
  return `
    ${renderHeader()}
    <main class="section-sm flex flex-column gap-4">
    <div>
        <section class="main__header flex flex-column gap-4">
            <div class=" flex gap-4">
                <p>Sort</p>
                <select name="sort" id="sort" class="select select__input ">
                    <option value="Alphabetical">Alphabetical(a-z)</option>
                    <option value="Date">Due date</option>
                    <option value="Importance">Importance</option>
                </select>
            </div>
            <div class="flex gap-4">
                <p>Show </p>
                <label for="">
                    <input class="checkbox checkbox__input checkbox--optionList" type="checkbox" name="Ncompleted" id="Ncompleted" ${
                      STORE.currentPage === "Ncompleted" ||
                      STORE.currentPage === "Important&Ncompleted"
                        ? "checked"
                        : ""
                    } >
                    Only pending
                </label>
                <label for="">
                    <input class="checkbox checkbox__input checkbox--optionList" type="checkbox" name="important" id="important" ${
                      STORE.currentPage === "important" ||
                      STORE.currentPage === "Important&Ncompleted"
                        ? "checked"
                        : ""
                    } >
                    Only Important
                </label>
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
        <button class="button button--secondary width-full">Add  task</button>
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
    console.log(e.target.value);
    switch (option) {
      case "Alphabetical":
        let jk = STORE.tasks;
        const sorta = jk.sort(function (a, b) {
          if (a.title < b.title) return -1;

          if (a.title > b.title) return 1;

          return 0;
        });
        console.log(sorta);
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
    },
  };
}

export default Homepage;
