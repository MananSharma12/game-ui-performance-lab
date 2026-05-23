import { useEffect } from 'react';

class Telemetry {
  private listeners: Set<(fps: number) => void> = new Set();
  private frames = 0;
  private lastTime = performance.now();

  constructor() {
    this.loop();
  }

  private loop = () => {
    this.frames++;
    const now = performance.now();
    if (now - this.lastTime >= 1000) {
      const fps = Math.round((this.frames * 1000) / (now - this.lastTime));
      this.listeners.forEach(l => l(fps));
      this.frames = 0;
      this.lastTime = now;
    }
    requestAnimationFrame(this.loop);
  };

  subscribe(l: (fps: number) => void) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
}

const engine = new Telemetry();

// Zero-overhead Hook
export function useTelemetry(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    return engine.subscribe(fps => {
      if (ref.current) ref.current.textContent = `FPS: ${fps}`;
    });
  }, [ref]);
}
