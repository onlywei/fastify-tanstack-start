import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/second-route')({
	component: SecondRoute,
});

function SecondRoute() {
	return (
		<div>
			<h1>Second Route</h1>
			<Link to="/">Home</Link>
		</div>
	);
}
