import STORE from "../store.js";
import { createTask, editTask } from "../services/task-services.js";
import { input } from "../components/input.js";
import DOMHandler from "../dom-handler.js";
function renderTask(task) {
  console.log(task.completed);
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
  const tasks = STORE.tasks;
  console.log(STORE.tasks);
  return `
    <main class="section-sm flex flex-column gap-4">
        <section class="main__header">
            <div class=" flex gap-4">
                <p>Sort</p>
                <select name="sort" id="sort">
                    <option value="Alphabetical">Alphabetical(a-z)</option>
                    <option value="Date">Due date</option>
                    <option value="Importance">Importance</option>
                </select>
            </div>
            <div class="flex gap-4">
                <p>Show </p>
                <label for="">
                    <input type="checkbox" name="" id="">
                    Only pending
                </label>
                <label for="">
                    <input type="checkbox" name="" id="">
                    Only Important
                </label>
            </div>
        </section>
        <section class="main__list">
            <!-- <label for="aea"> -->
            ${tasks.map(renderTask).join("")}
            <!-- </label> -->
        </section>
        <form class="task-form form-self">
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
        <button>Add  task</button>
      </form>
    </main>
`;
}

function listenCheck() {
  const listDivs = document.querySelectorAll(".check");

  listDivs.forEach((task) => {
    task.addEventListener("change", async (event) => {
      const taskGotten = event.target.closest(`#task-${task.id}`);
      //   const taskGotten = event.target.closest("");
      console.log(taskGotten);
      if (!taskGotten) return;
      console.log(task.checked);
      if (task.checked) {
        taskGotten.classList.add("checked");
        editTask({ completed: true }, task.id);
      } else {
        taskGotten.classList.remove("checked");
        // div.classList.remove("foo");
        editTask({ completed: false }, task.id);
      }
    });
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
    },
  };
}

export default Homepage;
