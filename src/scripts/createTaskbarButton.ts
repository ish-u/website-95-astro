import { toggleWindow } from "./toggleWindow";

export function createTaskBarButton(windowName: string, windowIcon: string, windowDataAttr: string) {
  const taskbar = document.getElementById("taskbar");
  console.log(windowIcon);

  if (taskbar) {
    // Button Style
    const style = `.taskbar-button {
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
    // button element
    const button = document.createElement("div");
    button.classList.add("taskbar-button");
    button.classList.add("active");
    button.setAttribute("data-window-taskbar", windowDataAttr);

    const name = document.createElement("div");
    name.innerText = windowName;

    const image = document.createElement("img");
    image.src = `/images/${windowIcon}`;
    button.appendChild(image);
    button.appendChild(name);
    button.appendChild(styleSheet);

    button.addEventListener("click", () => toggleWindow(windowDataAttr));

    taskbar.appendChild(button);
  }
}
