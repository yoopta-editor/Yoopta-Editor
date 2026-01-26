import { useRef } from 'react';
import { YooptaEditor } from './editor/editor';

function App() {
  const containerRef = useRef(null);
  return (
    <div className="editor-container" ref={containerRef}>
      <YooptaEditor containerRef={containerRef} />
    </div>
  );
}
export default App;
