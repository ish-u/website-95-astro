import { moveWindowToFront } from "./moveWidnowToFrontHandler";

// Ref :- https://www.w3schools.com/howto/howto_js_draggable.asp
export function dragWindowHandler(windowDataAttr: string) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const windowDiv: HTMLDivElement | null = document.querySelector(
    `[data-window=${windowDataAttr}]`
  );
  const resizeButton = document.querySelector(
    `.resize-button[data-window=${windowDataAttr}]`
  );
  console.log(resizeButton);
  const windowTitleBar: HTMLDivElement | null = windowDiv
    ? windowDiv.querySelector(`[data-title=${windowDataAttr}]`)
    : null;
  if (windowDiv && windowTitleBar) {
    windowTitleBar.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;

    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e: MouseEvent) {
    e = e || window.event;
    e.preventDefault();
    // Move Window To Front on start dragging
    moveWindowToFront(windowDataAttr);
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    if (
      windowDiv &&
      resizeButton &&
      resizeButton?.classList.contains("maximize")
    ) {
      windowDiv.style.width = "50rem";
      windowDiv.style.height = "35rem";
      resizeButton?.classList.remove("maximize");
      windowDiv.style.top = e.clientY + "px";
      windowDiv.style.left = e.clientX / 2 + "px";
    }
    // set the element's new position:
    if (windowDiv !== null) {
      let offsetLeft =
        windowDiv.offsetLeft - pos1 > e.clientX
          ? windowDiv.offsetLeft - e.clientY
          : windowDiv.offsetLeft - pos1;
      windowDiv.style.top = windowDiv.offsetTop - pos2 + "px";
      windowDiv.style.left = offsetLeft + "px";
    }
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
