
import React from 'react';
import {
	Outlet,
	Router,
	Route,
	RootRoute,
} from '@tanstack/react-router';
import App from './App';

function Root() {
	return <Outlet />;
}

function Index() {
	return <App />;
}

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

// Create the router using your route tree
const router = new Router({ routeTree })

// Register your router for maximum type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export default router;

