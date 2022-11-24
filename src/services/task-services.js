import apiFetch from "./api-fetch.js";

export async function getTasks() {
  return await apiFetch("tasks");
}

export async function createTask(newTask = { title, due_date }) {
  return await apiFetch("tasks", { body: newTask });
}

export async function deleteTask(id) {
  return await apiFetch(`tasks/${id}`, { method: "DELETE" });
}

export async function editTask(
  data = { title, due_date, important, completed },
  id
) {
  return await apiFetch(`tasks/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export async function getTask(id) {
  return await apiFetch(`tasks/${id}`);
}
