export function moveWindow(windowName: string) {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const windowDiv: HTMLDivElement | null = document.querySelector(`[data-window=${windowName}]`);
  const windowTitleBar: HTMLDivElement | null = windowDiv ? windowDiv.querySelector(`[data-title=${windowName}]`) : null;
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
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if (windowDiv !== null) {
      let offsetLeft = windowDiv.offsetLeft - pos1 > e.clientX ? windowDiv.offsetLeft - e.clientY : windowDiv.offsetLeft - pos1;
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
