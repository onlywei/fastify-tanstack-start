import { type ChildProcess, spawn } from 'node:child_process';
import { resolve } from 'node:path';

export interface ServerInstance {
	process: ChildProcess;
	kill: () => Promise<void>;
}

/**
 * Start a server process
 */
export function startServer(command: string, args: string[], cwd: string): ServerInstance {
	const serverProcess = spawn(command, args, {
		cwd: resolve(process.cwd(), cwd),
		env: { ...process.env },
		detached: true, // Create a new process group so we can kill all child processes
	});

	serverProcess.on('error', (error) => {
		console.error('Failed to start server:', error);
	});

	const kill = () => {
		return new Promise<void>((resolve) => {
			if (serverProcess.killed || serverProcess.exitCode !== null) {
				resolve();
				return;
			}

			// Set up exit handler
			const onExit = () => {
				clearTimeout(forceKillTimeout);

				// Kill the entire process group to ensure child processes (like Vite) are cleaned up
				// This is critical for dev servers that spawn additional processes
				if (serverProcess.pid) {
					try {
						// On Unix, kill negative PID to kill the entire process group
						process.kill(-serverProcess.pid, 'SIGKILL');
					} catch (e) {
						// Process group might already be gone, that's okay
					}
				}

				resolve();
			};

			serverProcess.once('exit', onExit);

			// Try graceful shutdown first
			serverProcess.kill('SIGTERM');

			// Force kill after 3 seconds if still running
			const forceKillTimeout = setTimeout(() => {
				if (!serverProcess.killed && serverProcess.exitCode === null) {
					serverProcess.kill('SIGKILL');
				}
			}, 3000);
		});
	};

	return {
		process: serverProcess,
		kill,
	};
}

/**
 * Wait for server to be ready by polling the URL
 */
export async function waitForServer(url: string, timeoutMs = 30000): Promise<void> {
	const startTime = Date.now();

	while (Date.now() - startTime < timeoutMs) {
		try {
			const response = await fetch(url);
			if (response.ok || response.status === 404) {
				// Server is responding
				return;
			}
		} catch {
			// Server not ready yet, continue polling
		}

		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}
