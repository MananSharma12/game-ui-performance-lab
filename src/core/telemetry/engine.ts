/**
 * TelemetryEngine
 * 
 * This is a "vanilla" TypeScript class, meaning it doesn't depend on React.
 * We do this to ensure "zero-overhead": measuring performance shouldn't 
 * trigger React re-renders, which would themselves consume CPU/Memory.
 */
export interface TelemetryData {
  fps: number;
  deltaTime: number; // Time between frames in ms
  usedHeap: number;  // JS Heap used in MB
}

class TelemetryEngine {
  private listeners: Set<(data: TelemetryData) => void> = new Set();
  
  // High-resolution timestamps
  private lastTime = performance.now();
  private frames = 0;
  private lastFpsUpdate = performance.now();

  constructor() {
    this.startLoop();
  }

  private startLoop = () => {
    const now = performance.now();
    
    // 1. Calculate Delta Time (dt)
    // This is the time elapsed since the last frame. 
    // If dt is high (e.g. > 16.6ms for 60fps), it indicates "jank".
    const deltaTime = now - this.lastTime;
    this.lastTime = now;

    // 2. Calculate FPS (averaged over 1 second)
    this.frames++;
    let currentFps = 0;
    if (now - this.lastFpsUpdate >= 1000) {
      currentFps = Math.round((this.frames * 1000) / (now - this.lastFpsUpdate));
      this.frames = 0;
      this.lastFpsUpdate = now;
    }

    // 3. Get Memory Usage (Chrome/Edge only)
    // performance.memory is not standard but extremely useful for detecting 
    // Memory Leaks and Garbage Collection (GC) spikes.
    const memory = (performance as any).memory;
    const usedHeap = memory ? Math.round(memory.usedJSHeapSize / (1024 * 1024)) : 0;

    // Notify listeners with the latest metrics
    // We only notify if a full second has passed for FPS, 
    // OR we could notify every frame for real-time Delta Time.
    // For now, let's notify every frame to keep the HUD smooth.
    if (this.listeners.size > 0) {
      const data: TelemetryData = {
        fps: currentFps || 60, // Default to 60 if not yet calculated
        deltaTime,
        usedHeap
      };
      this.listeners.forEach(l => l(data));
    }

    // requestAnimationFrame ensures this runs at the display refresh rate
    requestAnimationFrame(this.startLoop);
  };

  /**
   * Components or utilities can subscribe to updates.
   * Returns an unsubscribe function.
   */
  subscribe(callback: (data: TelemetryData) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }
}

// Export a singleton instance
export const engine = new TelemetryEngine();
