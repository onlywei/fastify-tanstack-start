import { type ChildProcess, spawn } from 'node:child_process';
import { resolve } from 'node:path';

export interface ServerInstance {
	process: ChildProcess;
	logs: string[];
	kill: () => void;
}

/**
 * Start a server process and capture its output
 */
export function startServer(command: string, args: string[], cwd: string): ServerInstance {
	const logs: string[] = [];

	const serverProcess = spawn(command, args, {
		cwd: resolve(process.cwd(), cwd),
		env: { ...process.env },
	});

	serverProcess.stdout?.on('data', (data) => {
		const output = data.toString();
		logs.push(output);
		// Optional: uncomment to see server output during tests
		// console.log('[SERVER]', output);
	});

	serverProcess.stderr?.on('data', (data) => {
		const output = data.toString();
		logs.push(output);
		// Optional: uncomment to see server errors during tests
		// console.error('[SERVER ERROR]', output);
	});

	serverProcess.on('error', (error) => {
		console.error('Failed to start server:', error);
	});

	const kill = () => {
		if (!serverProcess.killed) {
			serverProcess.kill('SIGTERM');
			// Force kill after 5 seconds if still running
			setTimeout(() => {
				if (!serverProcess.killed) {
					serverProcess.kill('SIGKILL');
				}
			}, 5000);
		}
	};

	return {
		process: serverProcess,
		logs,
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
			const response = await fetch(url, { method: 'HEAD' });
			if (response.ok || response.status === 404) {
				// Server is responding (404 is fine, means server is up)
				return;
			}
		} catch {
			// Server not ready yet, continue polling
		}

		// Wait 100ms before trying again
		await new Promise((resolve) => setTimeout(resolve, 100));
	}

	throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

/**
 * Check if a log message appears in the server logs
 */
export function hasLogMessage(logs: string[], message: string): boolean {
	return logs.some((log) => log.includes(message));
}

/**
 * Wait for a log message to appear (with timeout)
 */
export async function waitForLogMessage(
	logs: string[],
	message: string,
	timeoutMs = 5000,
): Promise<boolean> {
	const startTime = Date.now();

	while (Date.now() - startTime < timeoutMs) {
		if (hasLogMessage(logs, message)) {
			return true;
		}
		// Wait 50ms before checking again
		await new Promise((resolve) => setTimeout(resolve, 50));
	}

	return false;
}
