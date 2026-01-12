function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3002,
  grpcPort: Number(process.env.GRPC_PORT) || 50051,
  databaseUrl: requireEnv('DATABASE_URL'),
  jwtSecret: requireEnv('JWT_SECRET'),
  jwtInternalSecret: requireEnv('JWT_INTERNAL_SECRET'),
  // Admin seeder credentials (optional - seed skips if not configured)
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminFirstName: process.env.ADMIN_FIRST_NAME || '',
  adminLastName: process.env.ADMIN_LAST_NAME || '',
};
