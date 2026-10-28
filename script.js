// Görevleri, kalıcı ilerlemeyi ve sayfa gezinmesini yönetir.
const STORAGE_KEY = "yildiz-patisi-tasks";
const PROGRESS_KEY = "yildiz-patisi-progress";
const form = document.querySelector("#task-form");
const input = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");
const filterButtons = document.querySelectorAll(".filter-button");
const pageLinks = document.querySelectorAll("[data-page-link]");
const pageTitle = document.querySelector("#page-title");
const pageSubtitle = document.querySelector("#page-subtitle");
const pages = { tasks: document.querySelector("#page-tasks"), garden: document.querySelector("#page-garden"), profile: document.querySelector("#page-profile") };
const pageContent = {
  tasks: ["Görevler", "Bugünkü görevlerini seç ve bahçene bir yıldız daha ekle."],
  garden: ["Yıldız Bahçem", "Görevlerin tamamlandıkça kendi küçük dünyan büyüsün."],
  profile: ["Profilim", "Yıldızlarını, başarılarını ve bahçe yolculuğunu gör."]
};
let tasks = loadTasks();
let progress = loadProgress();
let currentFilter = "all";

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(savedTasks)) return [];
    return savedTasks.filter(task => task && typeof task.id === "string" && typeof task.text === "string" && typeof task.completed === "boolean");
  } catch { return []; }
}
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return { completedTotal: Number.isFinite(saved.completedTotal) ? Math.max(0, saved.completedTotal) : 0 };
  } catch { return { completedTotal: 0 }; }
}
function saveTasks() { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); }
function saveProgress() { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); }
function getVisibleTasks() {
  if (currentFilter === "active") return tasks.filter(task => !task.completed);
  if (currentFilter === "completed") return tasks.filter(task => task.completed);
  return tasks;
}
function renderTasks() {
  taskList.replaceChildren();
  const visibleTasks = getVisibleTasks();
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCount.textContent = `${activeCount} aktif görev`;
  emptyState.hidden = visibleTasks.length > 0;
  if (tasks.length && !visibleTasks.length) {
    emptyState.querySelector("p").textContent = currentFilter === "active" ? "Aktif görev kalmadı!" : "Burada henüz görev yok.";
    emptyState.querySelector("span:last-child").textContent = currentFilter === "active" ? "Harika iş çıkardın, yıldız avcısı!" : "Başka bir filtre seçebilir veya yeni görev ekleyebilirsin.";
  } else {
    emptyState.querySelector("p").textContent = "Macera henüz başlamadı.";
    emptyState.querySelector("span:last-child").textContent = "İlk görevini ekle, pati izlerini takip et!";
  }
  visibleTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;
    const checkbox = document.createElement("input");
    checkbox.className = "task-toggle"; checkbox.type = "checkbox"; checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", task.completed ? `Görevi yeniden etkinleştir: ${task.text}` : `Görevi tamamla: ${task.text}`);
    checkbox.addEventListener("change", () => toggleTask(task.id));
    const text = document.createElement("span"); text.className = "task-text"; text.textContent = task.text;
    item.append(checkbox, text);
    if (task.completed) { const mark = document.createElement("span"); mark.className = "completion-mark"; mark.textContent = "✓ Tamamlandı"; item.append(mark); }
    const deleteButton = document.createElement("button"); deleteButton.className = "task-action"; deleteButton.type = "button"; deleteButton.textContent = "Sil";
    deleteButton.setAttribute("aria-label", `Görevi sil: ${task.text}`); deleteButton.addEventListener("click", () => deleteTask(task.id));
    item.append(deleteButton); taskList.append(item);
  });
}
function addTask(text) {
  tasks.unshift({ id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`, text, completed: false });
  saveTasks(); currentFilter = "all"; updateFilterButtons(); renderTasks();
}
function toggleTask(id) {
  const oldTask = tasks.find(task => task.id === id);
  if (!oldTask) return;
  const completing = !oldTask.completed;
  tasks = tasks.map(task => task.id === id ? { ...task, completed: completing } : task);
  // Yıldız yalnızca yeni bir tamamlamada kazanılır; geri alma kazanılmış ilerlemeyi silmez.
  if (completing) { progress.completedTotal += 1; saveProgress(); }
  saveTasks(); renderTasks(); renderProgress();
}
function deleteTask(id) { tasks = tasks.filter(task => task.id !== id); saveTasks(); renderTasks(); }
function updateFilterButtons() {
  filterButtons.forEach(button => {
    const selected = button.dataset.filter === currentFilter;
    button.classList.toggle("is-selected", selected); button.setAttribute("aria-pressed", String(selected));
  });
}
function showPage(pageName) {
  if (!pages[pageName]) pageName = "tasks";
  Object.entries(pages).forEach(([name, page]) => { page.hidden = name !== pageName; });
  pageLinks.forEach(link => {
    const selected = link.dataset.pageLink === pageName;
    link.classList.toggle("is-current", selected);
    if (selected) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current");
  });
  pageTitle.textContent = pageContent[pageName][0]; pageSubtitle.textContent = pageContent[pageName][1];
  if (location.hash !== `#${pageName}`) history.replaceState(null, "", `#${pageName}`);
}
function renderProgress() {
  const total = progress.completedTotal;
  const stage = total >= 10 ? 4 : total >= 6 ? 3 : total >= 3 ? 2 : total >= 1 ? 1 : 0;
  const stageNames = ["Tohum zamanı", "İlk filiz", "Tomurcuk vakti", "Çiçek açtı!", "Yıldız bahçesi"];
  const stageMessages = ["İlk görevini tamamla ve toprağa bir tohum ek.", "İlk filiz toprağı delip çıktı. Devam et!", "Bahçende tomurcuklar beliriyor.", "Renkli çiçekler açtı. Harika gidiyorsun!", "Bahçen yıldızlarla dolu, ne şahane bir dünya!"];
  const thresholds = [1, 3, 6, 10, 10];
  const previous = [0, 1, 3, 6, 10][stage];
  const percent = stage === 4 ? 100 : Math.min(100, ((total - previous) / (thresholds[stage] - previous)) * 100);
  document.querySelector("#header-progress").textContent = `${total} yıldız`;
  document.querySelector("#garden-stage").textContent = stageNames[stage];
  document.querySelector("#garden-message").textContent = stageMessages[stage];
  document.querySelector("#garden-level").textContent = `AŞAMA ${stage}`;
  document.querySelector("#growth-fill").style.width = `${percent}%`;
  document.querySelector("#next-growth").textContent = stage === 4 ? "Bahçen tüm aşamaları tamamladı!" : `Bir sonraki aşamaya ${thresholds[stage] - total} görev kaldı`;
  document.querySelector("#profile-stars").textContent = total;
  document.querySelector("#profile-done").textContent = total;
  document.querySelector("#profile-plants").textContent = stage;
  const scene = document.querySelector("#garden-scene");
  scene.className = `garden-scene stage-${stage}`;
  document.querySelector("#garden-plant").setAttribute("class", `garden-plant plant-stage-${stage}`);
  scene.setAttribute("aria-label", `${stageNames[stage]}. ${total} görev tamamlandı. ${stageMessages[stage]}`);
}
form.addEventListener("submit", event => {
  event.preventDefault(); const text = input.value.trim();
  if (!text) { input.value = ""; input.focus(); return; }
  addTask(text); input.value = ""; input.focus();
});
filterButtons.forEach(button => button.addEventListener("click", () => { currentFilter = button.dataset.filter; updateFilterButtons(); renderTasks(); }));
clearCompletedButton.addEventListener("click", () => { tasks = tasks.filter(task => !task.completed); saveTasks(); renderTasks(); });
pageLinks.forEach(link => link.addEventListener("click", () => showPage(link.dataset.pageLink)));
window.addEventListener("hashchange", () => showPage(location.hash.slice(1)));
renderTasks(); renderProgress(); showPage(location.hash.slice(1) || "tasks");

