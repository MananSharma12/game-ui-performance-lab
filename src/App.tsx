import { useRef, useState, useEffect } from 'react';
import { useTelemetry } from './telemetry';

function App() {
  const fpsRef = useRef<HTMLDivElement>(null);
  useTelemetry(fpsRef);

  return (
    <div className="layout">
      <div className="hud" ref={fpsRef}>FPS: --</div>
      <main className="content">
        <h1>LAB: Performance</h1>
        <p>Hardcoded Intensity: 50%</p>
        <div style={{ marginTop: '20px' }}>
          {/* Bare minimum stressor */}
          <Stressor />
        </div>
      </main>
    </div>
  );
}

function Stressor() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 16);
    return () => clearInterval(id);
  }, []);
  return <div>Render Count: {count}</div>;
}

export default App;
