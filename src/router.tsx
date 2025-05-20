import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Frontpage from './views/Frontpage/Frontpage';
import About from './views/About/About';
import ReadyGame from './views/Game/Ready/ReadyGame';
import OwnGame from './views/Game/Own/OwnGame';

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
            element={<About />}
        />
        <Route
            path="/game/ready"
            element={<ReadyGame />}
        />
        <Route
            path="/game/own"
            element={<OwnGame />}
        />
        {/*etusivu*/}
        {/* lisää muut reitit */}
    </Route>
);

export const router = createBrowserRouter(routes);
