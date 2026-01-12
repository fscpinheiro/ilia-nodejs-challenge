import { UpdateUser } from './UpdateUser';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('new_hashed_password'),
}));

describe('UpdateUser Use Case', () => {
  let updateUser: UpdateUser;
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

    updateUser = new UpdateUser(mockUserRepository);
  });

  it('should update user successfully', async () => {
    const existingUser = new User({
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    const updatedUser = new User({
      id: 'user-123',
      firstName: 'Johnny',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await updateUser.execute({
      id: 'user-123',
      firstName: 'Johnny',
    });

    expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
    expect(mockUserRepository.update).toHaveBeenCalled();
    expect(result.first_name).toBe('Johnny');
  });

  it('should throw error when user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(
      updateUser.execute({
        id: 'nonexistent',
        firstName: 'Johnny',
      }),
    ).rejects.toThrow('User not found');

    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });
});
