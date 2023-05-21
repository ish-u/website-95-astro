export function initCanvasSize() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext("2d");
    if (ctx && canvas.parentElement && !ctx.canvas.width) {
      ctx.canvas.width = 1024;
      ctx.canvas.height = 768;
    }
  }
}
