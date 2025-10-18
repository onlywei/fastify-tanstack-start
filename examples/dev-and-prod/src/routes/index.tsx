import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

const logSomethingOnServer = createServerFn().handler(() => {
	console.log('Something was logged');
});

export const Route = createFileRoute('/')({
	component: App,
});

function App() {
	return (
		<div>
			<h1>Hello World</h1>
			<button type="button" onClick={() => logSomethingOnServer()}>
				Log Something
			</button>
		</div>
	);
}
