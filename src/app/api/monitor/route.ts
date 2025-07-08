import { formatUptime } from '@/lib/format-uptime';
import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import os from 'node:os';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const uptime = formatUptime(os.uptime() * 1000);
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const cpus = os.cpus();
    const loadAvg = os.loadavg();
    const platform = os.platform();
    const arch = os.arch();

    const { stdout } = await execAsync('pm2 jlist');
    const pm2List = JSON.parse(stdout);

    // Helper to read last N lines from a file
    async function getLastLines(filePath: string, lines: number = 1000): Promise<string[]> {
      try {
        const { stdout } = await execAsync(`tail -n ${lines} ${filePath}`);
        return stdout.split('\n').filter(Boolean);
      } catch {
        return [];
      }
    }

    // Server memory in MB
    const totalMemMB = Number((totalMem / 1024 / 1024).toFixed(2));
    const freeMemMB = Number((freeMem / 1024 / 1024).toFixed(2));
    const usedMemMB = Number(((totalMem - freeMem) / 1024 / 1024).toFixed(2));

    const { stdout: processCountStdout } = await execAsync('ps -e --no-headers | wc -l');
    const processCount = Number(processCountStdout.trim());

    // Gather PM2 process info with logs
    const pm2WithLogs = await Promise.all(
      pm2List.map(async (app: Pm2Process) => {
        const memoryMB = Number((app.monit.memory / 1024 / 1024).toFixed(2));
        const outLog = await getLastLines(app.pm2_env.pm_out_log_path, 1000);
        const errLog = await getLastLines(app.pm2_env.pm_err_log_path, 1000);
        return {
          name: app.name,
          pid: app.pid,
          status: app.pm2_env.status,
          memory: memoryMB,
          cpu: app.monit.cpu,
          uptime: formatUptime(Date.now() - app.pm2_env.pm_uptime),
          restarts: app.pm2_env.restart_time,
          logs: {
            stdout: outLog,
            stderr: errLog,
          },
        };
      })
    );

    return NextResponse.json({
      uptime,
      memory: {
        total: totalMemMB,
        free: freeMemMB,
        used: usedMemMB,
      },
      loadAverage: loadAvg,
      platform,
      architecture: arch,
      cpu: {
        count: cpus.length,
        model: cpus[0].model,
        speed: cpus[0].speed,
      },
      processCount,
      pm2: pm2WithLogs,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
