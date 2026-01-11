import { UserRepository } from '../../domain/repositories';

export interface DeleteUserInput {
  id: string;
}

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const existingUser = await this.userRepository.findById(input.id);

    if (!existingUser) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(input.id);
  }
}
