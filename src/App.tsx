import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Suspense } from 'react';
import { Spinner } from '@genai-fi/base';

function App() {
    return (
        <Suspense
            fallback={
                <div>
                    loading...
                    <Spinner />
                </div>
            }
        >
            <RouterProvider router={router} />
        </Suspense>
    );
}

export default App;
