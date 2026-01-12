import { Authenticate } from './Authenticate';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock_token'),
}));

import bcrypt from 'bcryptjs';

describe('Authenticate Use Case', () => {
  let authenticate: Authenticate;
  let mockUserRepository: jest.Mocked<UserRepository>;
  const jwtSecret = 'test-secret';

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    authenticate = new Authenticate(mockUserRepository, jwtSecret);
    jest.clearAllMocks();
  });

  it('should authenticate user with valid credentials', async () => {
    const mockUser = new User({
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed_password',
    });

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authenticate.execute({
      email: 'john@example.com',
      password: 'password123',
    });

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(result.user.id).toBe('user-123');
    expect(result.user.email).toBe('john@example.com');
    expect(result.access_token).toBe('mock_token');
  });

  it('should throw error when user not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      authenticate.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw error when password is invalid', async () => {
    const mockUser = new User({
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'hashed_password',
    });

    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authenticate.execute({
        email: 'john@example.com',
        password: 'wrong_password',
      }),
    ).rejects.toThrow('Invalid credentials');
  });
});
