import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';
import { prisma } from './prisma';

export class PrismaUserRepository implements UserRepository {
  async create(user: User): Promise<User> {
    const created = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      },
    });

    return new User({
      id: created.id,
      firstName: created.firstName,
      lastName: created.lastName,
      email: created.email,
      password: created.password,
      createdAt: created.createdAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) return null;

    return new User({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return null;

    return new User({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
    });
  }

  async findAll(): Promise<User[]> {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map(
      (user) =>
        new User({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          createdAt: user.createdAt,
        }),
    );
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      },
    });

    return new User({
      id: updated.id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      password: updated.password,
      createdAt: updated.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
