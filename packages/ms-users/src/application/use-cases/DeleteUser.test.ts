import { DeleteUser } from './DeleteUser';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

describe('DeleteUser Use Case', () => {
  let deleteUser: DeleteUser;
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

    deleteUser = new DeleteUser(mockUserRepository);
  });

  it('should delete user successfully', async () => {
    const existingUser = new User({
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
    });

    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.delete.mockResolvedValue();

    await deleteUser.execute({ id: 'user-123' });

    expect(mockUserRepository.findById).toHaveBeenCalledWith('user-123');
    expect(mockUserRepository.delete).toHaveBeenCalledWith('user-123');
  });

  it('should throw error when user not found', async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(deleteUser.execute({ id: 'nonexistent' })).rejects.toThrow('User not found');

    expect(mockUserRepository.delete).not.toHaveBeenCalled();
  });
});
