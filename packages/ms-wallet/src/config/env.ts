function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3001,
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtInternalSecret: requireEnv('JWT_INTERNAL_SECRET'),
  usersServiceUrl: process.env.USERS_SERVICE_URL || 'localhost:50051',
};
