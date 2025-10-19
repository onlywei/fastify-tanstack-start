import { createFileRoute, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { useState } from 'react';

const getServerTimestamp = createServerFn().handler(() => {
	return { timestamp: Date.now(), message: 'Server function executed!' };
});

export const Route = createFileRoute('/')({
	component: App,
});

function App() {
	const [serverResponse, setServerResponse] = useState<string | null>(null);

	const handleClick = async () => {
		const result = await getServerTimestamp();
		setServerResponse(`${result.message} (${result.timestamp})`);
	};

	return (
		<div>
			<h1>Hello World</h1>
			<button type="button" onClick={handleClick}>
				Call Server Function
			</button>
			{serverResponse && <p data-testid="server-response">{serverResponse}</p>}
			<p>
				<Link to="/second-route">Go to Second Route</Link>
			</p>
		</div>
	);
}
