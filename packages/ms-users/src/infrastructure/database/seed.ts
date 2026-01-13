import bcrypt from 'bcryptjs';
import { prisma } from './prisma';
import { env, logger } from '../../config';

export async function seedAdminUser(): Promise<void> {
  // Check if database is empty
  const userCount = await prisma.user.count();

  if (userCount > 0) {
    logger.info('Database already has users, skipping seed');
    return;
  }

  // Validate admin credentials are configured
  if (!env.adminEmail || !env.adminPassword || !env.adminFirstName || !env.adminLastName) {
    logger.warn('Admin credentials not configured in environment variables, skipping seed');
    return;
  }

  // Create admin user
  const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

  await prisma.user.create({
    data: {
      firstName: env.adminFirstName,
      lastName: env.adminLastName,
      email: env.adminEmail,
      password: hashedPassword,
    },
  });

  logger.info(`Admin user created: ${env.adminEmail}`);
}
