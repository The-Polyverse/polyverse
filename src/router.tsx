import {
	Router,
	Route,
	RootRoute,
} from '@tanstack/react-router';

import Root from './components/root';
import Index from './components/index';

const rootRoute = new RootRoute({
	component: Root,
});

// Create an index route
const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Index,
});

// Create the route tree using your routes
const routeTree = rootRoute.addChildren([indexRoute]);

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: ReturnType<typeof createRouter>;
	}
}

export default function createRouter() {
	return new Router({ routeTree });
}
