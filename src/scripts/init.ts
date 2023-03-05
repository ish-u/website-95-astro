import { createButtons } from "./createButtons";
import { dragWindowHandler } from "./dragWindowHandler";
import { initCanvas } from "./initCanvas";
import { moveWindowToFront } from "./moveWidnowToFrontHandler";
import { windowEventHandler } from "./windowEventHandler";

export function init() {
  const windows = document.querySelectorAll(".window");
  windows.forEach((windowDiv) => {
    const windowDataAttr = windowDiv.getAttribute("data-window") ?? "";
    const windowName = windowDiv.getAttribute("data-title") ?? "";
    const windowIcon = windowDiv.getAttribute("data-icon") ?? "";
    // Making Windows Dragable
    dragWindowHandler(windowDataAttr);
    // Move Window to Front on Click
    windowDiv.addEventListener("click", () => moveWindowToFront(windowDataAttr));
    // Adding Toggle to Close Button
    const closeButton = windowDiv.querySelector(".close-button");
    if (closeButton) {
      closeButton.addEventListener("click", () => windowEventHandler(windowDataAttr, "CLOSE"));
    }
    // Adding Toggle to Minimize Button
    const minimizeButton = windowDiv.querySelector(".minimize-button");
    if (minimizeButton) {
      minimizeButton.addEventListener("click", () => windowEventHandler(windowDataAttr, "TOGGLE"));
    }
    // Creating Buttons for Taskbar and Start Menu
    createButtons(windowName, windowIcon, windowDataAttr);
  });
  initCanvas();
  // Initlal Setting
  windowEventHandler("about_me", "SHOW");
}
