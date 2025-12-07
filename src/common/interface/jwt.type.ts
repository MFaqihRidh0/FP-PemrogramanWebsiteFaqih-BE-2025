export type IRole = 'ADMIN' | 'USER' | 'CREATOR';

export interface IJwtPayload {
  id: string;
  email: string;
  role: 'ADMIN' | 'USER' | 'CREATOR'; // sesuaikan dengan enum di schema prisma
  iat?: number;
  exp?: number;
}
