import { NextResponse } from "next/server";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

// Helper to read last N lines from a file, with offset for pagination
async function getLines(filePath: string, limit: number, offset: number = 0): Promise<string[]> {
	try {
		// tail -n +{start} | head -n {limit}
		const start =
			offset > 0 ? `tail -n +${offset + 1} ${filePath} | head -n ${limit}` : `tail -n ${limit} ${filePath}`;
		const { stdout } = await execAsync(start);
		return stdout.split("\n").filter(Boolean);
	} catch {
		return [];
	}
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const limit = parseInt(searchParams.get("limit") || "200");
	const page = parseInt(searchParams.get("page") || "1");

	try {
		// Lấy danh sách process từ pm2
		const { stdout } = await execAsync("pm2 jlist");
		const pm2List = JSON.parse(stdout) as Pm2Process[];
		const offset = (page - 1) * limit;

		const results = await Promise.all(
			pm2List.map(async (pm2) => {
				const stdoutLogs = await getLines(pm2.pm2_env.pm_out_log_path, limit, offset);
				const stderrLogs = await getLines(pm2.pm2_env.pm_err_log_path, limit, offset);

				return {
					pm_id: pm2.pm_id,
					name: pm2.name,
					pid: pm2.pid,
					logs: [
						...stdoutLogs.map((content) => ({ content, type: "stdout" })),
						...stderrLogs.map((content) => ({ content, type: "stderr" })),
					],
				};
			}),
		);

		return NextResponse.json(results);
	} catch (error) {
		return NextResponse.json({ error: (error as Error).message }, { status: 500 });
	}
}
