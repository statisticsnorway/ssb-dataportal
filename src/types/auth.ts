export interface Auth {
  isAuthenticated: boolean;
  user?: User;
}
export interface User {
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
  section_name?: string;
  section_code?: string;
  dapla?: {
    teams: string[];
    groups: string[];
  };
}
