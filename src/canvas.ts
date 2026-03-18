import type { Animation } from "./animation";

export class Canvas {
  readonly id: string;
  #element: HTMLCanvasElement;
  #context: CanvasRenderingContext2D;
  #width: number;
  #height: number;
  animation?: Animation;
  
  constructor(id: string) {
    const element = document.querySelector('canvas#' + id) as HTMLCanvasElement | null;
    if (element == null) throw new Error('cannot get canvas#' + id);
    const context = element.getContext('2d');
    if (context == null) throw new Error('cannot get 2d context of canvas#' + id);

    this.id = id;
    this.#element = element;
    this.#context = context;
    this.#width = element.width;
    this.#height = element.height;

    const observer = new ResizeObserver(([entry]) => {
      if (entry != null) {
        const box = entry.contentBoxSize[0];
        element.width = this.#width = box.inlineSize;
        element.height = this.#height = box.blockSize;
        this.animation?.render();
      }
    });
    observer.observe(element);
  }

  get context(): CanvasRenderingContext2D {
    return this.#context;
  }

  get width(): number {
    return this.#width;
  }

  get height(): number {
    return this.#height;
  }

  getBounding(): DOMRect {
    return this.#element.getBoundingClientRect();
  }
}