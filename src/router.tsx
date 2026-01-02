import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Frontpage from './views/Frontpage/Frontpage';
import ErrorComponent from './components/ErrorComponent/Error';

const routes = createRoutesFromElements(
    <Route
        path="/"
        errorElement={<ErrorComponent />}
    >
        <Route
            index
            element={<Frontpage />}
        />{' '}
        <Route
            path="/library"
            lazy={() => import('./views/Library/Library').then((mod) => ({ element: <mod.default /> }))}
        />
        <Route
            path="/about"
            lazy={() => import('./views/About/About').then((mod) => ({ element: <mod.default /> }))}
        />
        <Route
            path="/teacher/"
            lazy={() => import('./views/Teacher/Teacher').then((mod) => ({ element: <mod.default /> }))}
        />
        <Route
            path="/student/:serverCode/main"
            lazy={() => import('./views/Student/StudentWrapper').then((mod) => ({ element: <mod.default /> }))}
        />
    </Route>
);

export const router = createBrowserRouter(routes);
