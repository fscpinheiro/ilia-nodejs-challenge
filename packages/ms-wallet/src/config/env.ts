export const env = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'ILIACHALLENGE',
};
