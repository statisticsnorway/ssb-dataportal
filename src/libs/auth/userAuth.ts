import { Auth } from "@/types/auth";

export function authenticateUser(): Auth {
  return {isAuthenticated: true}
}
