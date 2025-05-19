import { useState } from 'react';
import './App.css';
import ButtonTest from './components/testComponent';

function App() {
    const [count, setCount] = useState(0);
    return (
        <>
            <div className="test">
                <ButtonTest />
            </div>
            <h1>BiasGame</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
        </>
    );
}

export default App;
