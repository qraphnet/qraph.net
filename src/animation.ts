import type { Canvas } from "./canvas";

export class Animation {
  readonly canvas: Canvas;
  
  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  render() {}
}