import { UserRepository } from '../../domain/repositories';

export interface ListUsersOutput {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export class ListUsers {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<ListUsersOutput[]> {
    const users = await this.userRepository.findAll();

    return users.map((user) => ({
      id: user.id!,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    }));
  }
}
