// type Listener = (x: number, y: number) => void;

export class TrackedCursor {
  #x: number = 0;
  #y: number = 0;

  constructor() {
    document.addEventListener('mousemove', e => {
      this.#x = e.clientX;
      this.#y = e.clientY;
    });

    document.addEventListener('touchstart', e => {
      this.updateFromTouchEvent(e);
    })

    document.addEventListener('touchmove', e => {
      this.updateFromTouchEvent(e);
    })
  }

  updateFromTouchEvent({ touches }: TouchEvent) {
      const n = touches.length;
      let x = 0, y = 0;
      for (const touch of touches) {
        x += touch.clientX;
        y += touch.clientY
      }
      this.#x = x / n;
      this.#y = y / n;
  }

  get x(): number {
    return this.#x;
  }

  get y(): number {
    return this.#y;
  }
}