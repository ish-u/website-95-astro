import { initCanvasSize } from "./initCanvasSize";
import { moveWindowToFront } from "./moveWidnowToFrontHandler";
import { resizeWindows } from "./resizeWindow";

export function windowEventHandler(
  windowDataAttr: string,
  event: "SHOW" | "TOGGLE" | "CLOSE" | "RESIZE"
) {
  const windowDiv: HTMLDivElement | null = document.querySelector(
    `[data-window=${windowDataAttr}]`
  );
  const taskbarButton = document.querySelector(
    `[data-window-taskbar=${windowDataAttr}]`
  );
  const startmenuButton = document.querySelector(
    `[data-window-menu=${windowDataAttr}]`
  );
  if (!windowDiv || !taskbarButton || !startmenuButton) {
    return;
  }
  switch (event) {
    case "SHOW":
      windowDiv.style.display = "flex";
      taskbarButton.className = "taskbar-button active";
      moveWindowToFront(windowDataAttr);
      initCanvasSize();
      return;
    case "TOGGLE":
      if (windowDiv.style.display === "none") {
        windowDiv.style.display = "flex";
      } else {
        windowDiv.style.display = "none";
      }
      if (taskbarButton.className === "taskbar-button") {
        taskbarButton.className = "taskbar-button active";
      } else {
        taskbarButton.className = "taskbar-button";
      }
      return;
    case "CLOSE":
      windowDiv.style.display = "none";
      windowDiv.style.top = "5rem";
      windowDiv.style.left = "20rem";
      windowDiv.style.width = "50rem";
      windowDiv.style.height = "35rem";
      taskbarButton.classList.add("close");
      return;
    case "RESIZE":
      resizeWindows(windowDataAttr);
      return;
  }
}
