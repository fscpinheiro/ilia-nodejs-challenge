export const env = {
  port: Number(process.env.PORT) || 3002,
  grpcPort: Number(process.env.GRPC_PORT) || 50051,
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || 'ILIACHALLENGE',
  jwtInternalSecret: process.env.JWT_INTERNAL_SECRET || 'ILIACHALLENGE_INTERNAL',
  // Admin seeder credentials
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  adminFirstName: process.env.ADMIN_FIRST_NAME || '',
  adminLastName: process.env.ADMIN_LAST_NAME || '',
};
