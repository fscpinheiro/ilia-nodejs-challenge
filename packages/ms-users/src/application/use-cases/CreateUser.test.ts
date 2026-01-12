import { CreateUser } from './CreateUser';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

describe('CreateUser Use Case', () => {
  let createUser: CreateUser;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    createUser = new CreateUser(mockUserRepository);
  });

  it('should create a user successfully', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.create.mockImplementation(async (user) => {
      return new User({
        id: 'user-123',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
      });
    });

    const result = await createUser.execute({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(result.id).toBe('user-123');
    expect(result.first_name).toBe('John');
    expect(result.last_name).toBe('Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('should throw error when email is already in use', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(
      new User({
        id: 'existing-user',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    );

    await expect(
      createUser.execute({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Email already in use');

    expect(mockUserRepository.create).not.toHaveBeenCalled();
  });
});
