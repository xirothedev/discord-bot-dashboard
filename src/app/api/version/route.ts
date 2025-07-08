import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function GET(req: NextRequest) {
  function execPromise(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      exec(cmd, (error, stdout, stderr) => {
        if (error) return reject(stderr || error.message);
        resolve(stdout.trim());
      });
    });
  }

  try {
    const [pm2Version, nodeVersion] = await Promise.all([
      execPromise('pm2 -v'),
      execPromise('node -v'),
    ]);
    return NextResponse.json({
      pm2: pm2Version,
      node: nodeVersion,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
