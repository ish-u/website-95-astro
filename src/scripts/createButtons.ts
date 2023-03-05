import { windowEventHandler } from "./windowEventHandler";

export function createButtons(windowName: string, windowIcon: string, windowDataAttr: string) {
  const taskbar = document.getElementById("taskbar");
  const startMenu = document.getElementById("start-menu");

  // Creating Button for Taskbar
  if (taskbar) {
    const style = `
    .taskbar-button {
      display: flex;
      align-items: center;
      align-content: center;
      padding: 5px 10px;
      margin: 2.5px 3px;
      min-width: 10vw;
      box-shadow: 2px 2px black, inset 1px 1px white;
      background-color: rgba(255, 255, 255, 0.4);
    }

    .taskbar-button img {
      height: 22px;
      width: 22px;
      margin-right: 5px;
    }

    .active {
      background-color: rgba(255, 255, 255, 0.5);
      box-shadow: inset 2px 2px black, 1px 1px white !important;
    }

    .close{
      display:none;
    }
  `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = style;

    const button = document.createElement("div");
    button.classList.add("taskbar-button");
    button.classList.add("close");
    button.setAttribute("data-window-taskbar", windowDataAttr);

    const name = document.createElement("div");
    name.innerText = windowName;

    const image = document.createElement("img");
    image.src = `/images/${windowIcon}`;
    image.alt = windowName + " icon";

    button.appendChild(image);
    button.appendChild(name);
    button.appendChild(styleSheet);

    // adding windowEventHandler
    button.addEventListener("click", () => windowEventHandler(windowDataAttr, "TOGGLE"));

    taskbar.appendChild(button);
  }

  // Creating Button for Start Menu
  if (startMenu) {
    const style = `
    .menu-button {
      display: flex;
      flex-direction: row;
      justify-content: start;
      padding: 0.5em;
      margin-left: 15%;
      align-items: center;
    }

    .menu-button:hover {
      background: #0000aa;
      color: white;
      z-index: 10;
    }

  `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = style;

    const button = document.createElement("div");
    button.classList.add("menu-button");
    button.setAttribute("data-window-menu", windowDataAttr);

    const name = document.createElement("span");
    name.innerText = windowName;

    const image = document.createElement("img");
    image.src = `/images/${windowIcon}`;
    image.alt = windowName + " icon";
    image.style.marginRight = "10px";

    button.appendChild(image);
    button.appendChild(name);
    button.appendChild(styleSheet);

    // adding windowEventHandler
    button.addEventListener("click", () => windowEventHandler(windowDataAttr, "SHOW"));

    startMenu.appendChild(button);
  }
}
