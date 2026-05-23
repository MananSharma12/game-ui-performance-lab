import { useEffect } from 'react';
import { engine, type TelemetryData } from './engine';

/**
 * useTelemetry Hook
 * 
 * This hook connects a DOM element to the TelemetryEngine.
 * 
 * @param ref - A React ref pointing to the element where we want to display data.
 * @param format - A custom function to format how the data is displayed.
 */
export function useTelemetry(
  ref: React.RefObject<HTMLElement | null>,
  format?: (data: TelemetryData) => string
) {
  useEffect(() => {
    // 1. Subscribe to the engine
    const unsubscribe = engine.subscribe((data) => {
      // 2. Check if the DOM element exists
      if (ref.current) {
        // 3. Update the text directly (Zero-overhead)
        // This skips React's virtual DOM and "Diffing" process.
        if (format) {
          ref.current.textContent = format(data);
        } else {
          // Default formatting
          ref.current.textContent = 
            `FPS: ${data.fps} | Δt: ${data.deltaTime.toFixed(2)}ms | Heap: ${data.usedHeap}MB`;
        }
      }
    });

    // 4. Cleanup: Unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [ref, format]);
}
