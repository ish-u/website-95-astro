export function toggleWindow(windowName: string, close?: boolean) {
  const windowDiv: HTMLDivElement | null = document.querySelector(`[data-window=${windowName}]`);
  if (windowDiv) {
    if (windowDiv.style.display === "none") {
      windowDiv.style.display = "flex";
    } else {
      windowDiv.style.display = "none";
    }
  }
  const button = document.querySelector(`[data-window-taskbar=${windowName}]`);
  if (button) {
    if (button.className === "taskbar-button") {
      button.className = "taskbar-button active";
    } else {
      button.className = "taskbar-button";
    }
    if (close) {
      button.classList.add("close");
    }
  }
}
