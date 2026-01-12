import { GetUser } from './GetUser';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

describe('GetUser Use Case', () => {
  let getUser: GetUser;
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

    getUser = new GetUser(mockUserRepository);
  });

  it('should return user when found', async () => {
    const mockUser = new User({
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    mockUserRepository.findById.mockResolvedValue(mockUser);

    const result = await getUser.execute({ id: 'user-123' });

    expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
    expect(result.id).toBe('user-123');
    expect(result.first_name).toBe('John');
    expect(result.last_name).toBe('Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('should throw error when user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(getUser.execute({ id: 'nonexistent' })).rejects.toThrow('User not found');
  });
});
