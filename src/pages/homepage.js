import STORE from "../store.js";

function renderTask(task) {
  return `<div class="task flex gap-4" id="${task.id}">
  <input type="checkbox" name="task" id="${task.id}" class="check--self">
  <div class="task__content">
      <div class="flex gap-4">
          <p>${task.title}</p>
          <img src="/assets/icons/info.svg" alt="info">
      </div>
      <p>${task.due_date}</p>
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
            ${tasks.map((task) => renderTask(task)).join("")}
            <!-- </label> -->
        </section>
    </main>
`;
}

function Homepage() {
  return {
    toString() {
      return render();
    },
    addListeners() {},
  };
}

export default Homepage;
