import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Frontpage from './views/Frontpage/Frontpage';

const routes = createRoutesFromElements(
    <Route
        path="/"
        errorElement={<div>Jotain meni pieleen</div>}
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
