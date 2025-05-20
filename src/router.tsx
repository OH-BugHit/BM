import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Frontpage from './views/Frontpage/Frontpage';
import About from './views/About/About';

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
        {/*etusivu*/}
        {/* lisää muut reitit */}
    </Route>
);

export const router = createBrowserRouter(routes);
