import { execSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const portsFilePath = path.join(os.tmpdir(), 'ssb-dataportal-playwright-ports.json');

const randomPort = (min = 10000, max = 30000): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const resolvePort = (value: string | undefined, fallback: () => number): number => {
  const parsedValue = Number(value);
  if (Number.isInteger(parsedValue) && parsedValue > 0) {
    return parsedValue;
  }

  return fallback();
};

const isPortAvailable = (port: number): boolean => {
  try {
    execSync(`lsof -nP -iTCP:${port} -sTCP:LISTEN`, { stdio: 'ignore' });
    return false;
  } catch {
    return true;
  }
};

const isProcessAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
};

const readSharedPorts = (): { authPort: number; unauthPort: number } | null => {
  try {
    const content = fs.readFileSync(portsFilePath, 'utf8');
    const parsed = JSON.parse(content) as { authPort?: number; unauthPort?: number; ownerPid?: number };
    const authPort = parsed.authPort;
    const unauthPort = parsed.unauthPort;
    const ownerPid = parsed.ownerPid;

    if (
      typeof authPort === 'number' &&
      Number.isInteger(authPort) &&
      authPort > 0 &&
      typeof unauthPort === 'number' &&
      Number.isInteger(unauthPort) &&
      unauthPort > 0 &&
      typeof ownerPid === 'number' &&
      Number.isInteger(ownerPid) &&
      ownerPid > 0 &&
      isProcessAlive(ownerPid)
    ) {
      return {
        authPort,
        unauthPort,
      };
    }

    if (typeof ownerPid === 'number' && Number.isInteger(ownerPid) && ownerPid > 0 && !isProcessAlive(ownerPid)) {
      fs.unlinkSync(portsFilePath);
    }

    return null;
  } catch {
    return null;
  }
};

const writeSharedPorts = (authPort: number, unauthPort: number): boolean => {
  try {
    fs.writeFileSync(portsFilePath, JSON.stringify({ authPort, unauthPort, ownerPid: process.pid }), {
      encoding: 'utf8',
      flag: 'wx',
    });
    return true;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'EEXIST') {
      return false;
    }

    throw error;
  }
};

export const resolvePlaywrightPorts = (): { authPort: number; unauthPort: number; shouldLog: boolean } => {
  const envAuthPort = resolvePort(process.env.PW_AUTH_PORT, randomPort);
  const envUnauthPort = resolvePort(process.env.PW_UNAUTH_PORT, randomPort);

  if (process.env.PW_AUTH_PORT || process.env.PW_UNAUTH_PORT) {
    let resolvedUnauthPort = envUnauthPort;
    while (resolvedUnauthPort === envAuthPort) {
      resolvedUnauthPort = randomPort();
    }

    const sharedPorts = readSharedPorts();
    const isSharedResolution = sharedPorts?.authPort === envAuthPort && sharedPorts?.unauthPort === resolvedUnauthPort;

    return {
      authPort: envAuthPort,
      unauthPort: resolvedUnauthPort,
      shouldLog: !isSharedResolution,
    };
  }

  const sharedPorts = readSharedPorts();
  if (sharedPorts) {
    return {
      authPort: sharedPorts.authPort,
      unauthPort: sharedPorts.unauthPort,
      shouldLog: false,
    };
  }

  for (let index = 0; index < 50; index++) {
    const existingPorts = readSharedPorts();
    if (existingPorts) {
      return {
        authPort: existingPorts.authPort,
        unauthPort: existingPorts.unauthPort,
        shouldLog: false,
      };
    }

    const generatedAuthPort = randomPort();
    let generatedUnauthPort = randomPort();
    while (generatedUnauthPort === generatedAuthPort) {
      generatedUnauthPort = randomPort();
    }

    if (!isPortAvailable(generatedAuthPort) || !isPortAvailable(generatedUnauthPort)) {
      continue;
    }

    if (writeSharedPorts(generatedAuthPort, generatedUnauthPort)) {
      return {
        authPort: generatedAuthPort,
        unauthPort: generatedUnauthPort,
        shouldLog: true,
      };
    }
  }

  throw new Error('Failed to resolve shared Playwright ports.');
};
