import 'server-only'

import { Auth } from "@/types/auth";
import { createLogger } from "../logger/server-logger";
const logger = createLogger('user-auth');

export function authenticateUser(): Auth {
  if (process.env.DANGEROUSLY_DISABLE_USER_AUTH === 'true') {
    logger.warn("Danger! User auth is disabled. This may allow unauthenticated users access. This message should only be visible in local dev environments.")
    return {isAuthenticated: process.env.IS_AUTHENTICATED === 'true'}
  }
  return {isAuthenticated: true}
}
