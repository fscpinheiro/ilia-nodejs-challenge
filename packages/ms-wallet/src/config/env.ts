export const env = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'ILIACHALLENGE',
  jwtInternalSecret: process.env.JWT_INTERNAL_SECRET || 'ILIACHALLENGE_INTERNAL',
  usersServiceUrl: process.env.USERS_SERVICE_URL || 'localhost:50051',
};
