import { useRef, useState, useEffect } from 'react';
import { useTelemetry } from './core/telemetry/hooks';

function App() {
  const fpsRef = useRef<HTMLDivElement>(null);
  useTelemetry(fpsRef);

  return (
    <div className="layout">
      {/* The HUD uses a ref to allow Zero-Overhead direct DOM updates */}
      <div className="hud" ref={fpsRef}>Telemetry Loading...</div>
      <main className="content">
        <h1>LAB: Performance</h1>
        <p>Hardcoded Intensity: 50%</p>
        <div style={{ marginTop: '20px' }}>
          {/* A simple component that forces re-renders to test UI responsiveness */}
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
  return <div>Global State Iteration: {count}</div>;
}

export default App;
