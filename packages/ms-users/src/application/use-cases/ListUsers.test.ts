import { ListUsers } from './ListUsers';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

describe('ListUsers Use Case', () => {
  let listUsers: ListUsers;
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

    listUsers = new ListUsers(mockUserRepository);
  });

  it('should return all users', async () => {
    const mockUsers = [
      new User({
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
      }),
      new User({
        id: 'user-2',
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@example.com',
        password: 'password123',
      }),
    ];

    mockUserRepository.findAll.mockResolvedValue(mockUsers);

    const result = await listUsers.execute();

    expect(mockUserRepository.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('user-1');
    expect(result[1].id).toBe('user-2');
  });

  it('should return empty array when no users', async () => {
    mockUserRepository.findAll.mockResolvedValue([]);

    const result = await listUsers.execute();

    expect(result).toHaveLength(0);
  });
});
