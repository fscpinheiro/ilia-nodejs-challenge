import { UserRepository } from '../../domain/repositories';
import { UserNotFoundError } from '../../domain/errors';

export interface DeleteUserInput {
  id: string;
}

export class DeleteUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: DeleteUserInput): Promise<void> {
    const existingUser = await this.userRepository.findById(input.id);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    await this.userRepository.delete(input.id);
  }
}
