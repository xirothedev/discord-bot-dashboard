import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

/**
 * POST body: { action: "start" | "stop" | "restart", pm_id: number }
 */
export async function POST(req: Request) {
	const ip = req.headers.get("x-forwarded-for");
	if (ip !== "127.0.0.1" && ip !== "::1") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { action, pm_id } = await req.json();
		if (!action || typeof pm_id === "undefined") {
			return NextResponse.json({ error: "Missing action or id" }, { status: 400 });
		}
		if (!["start", "stop", "restart"].includes(action)) {
			return NextResponse.json({ error: "Invalid action" }, { status: 400 });
		}
		// Build the pm2 command
		const cmd = `pm2 ${action} ${pm_id}`;
		const { stdout, stderr } = await execAsync(cmd);
		if (stderr) {
			// pm2 sometimes writes to stderr even on success, so only treat as error if stdout is empty
			if (!stdout.trim()) {
				return NextResponse.json({ error: stderr.trim() }, { status: 500 });
			}
		}
		return NextResponse.json({ result: stdout.trim() });
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
