export function moveWindowToFront(windowName: string) {
  const windows = document.querySelectorAll<HTMLElement>(".window");
  if (windows) {
    windows.forEach(
      (windowDiv) =>
        (windowDiv.style.zIndex =
          windowDiv.getAttribute("data-window") === windowName ? "1000" : "999")
    );
  }
}
