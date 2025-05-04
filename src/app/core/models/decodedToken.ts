export interface DecodedToken {
  permissions: string[];
  id: string;
  email: string;
  isPatient: boolean;
  sub: string;
  iat: number;
  exp: number;
}
