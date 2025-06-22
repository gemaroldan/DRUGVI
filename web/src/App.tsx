import React from 'react';
import { atom, useRecoilState } from 'recoil';

// Ejemplo simple de atom recoil
const countState = atom({
  key: 'countState',
  default: 0,
});

function App() {
  const [count, setCount] = useRecoilState(countState);

  return (
    <div style={{ padding: 20 }}>
      <h1>DrugVi Web App</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}

export default App;
