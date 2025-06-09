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
            path="/about"
            lazy={() => import('./views/About/About').then((mod) => ({ element: <mod.default /> }))}
        />
        <Route
            path="/game/ready"
            lazy={() => import('./views/Game/Ready/ReadyGame').then((mod) => ({ element: <mod.default /> }))}
        />
        <Route
            path="/game/own"
            lazy={() =>
                import('./views/Game/ExploitBiasGame/ExploitBiasGame').then((mod) => ({ element: <mod.default /> }))
            }
        />
        <Route
            path="/game/own/scores"
            lazy={() =>
                import('./views/Scores/ExploitBiasGameScores/ExploitBiasGameScores').then((mod) => ({
                    element: <mod.default />,
                }))
            }
        />
        <Route
            path="/teacher/main"
            lazy={() => import('./views/Teacher/Teacher').then((mod) => ({ element: <mod.default /> }))}
        />
        <Route
            path="/student/main"
            lazy={() => import('./views/Student/StudentWrapper').then((mod) => ({ element: <mod.default /> }))}
        />
    </Route>
);

export const router = createBrowserRouter(routes);
