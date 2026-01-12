import { UserRepository } from '../../domain/repositories';
import { UserNotFoundError } from '../../domain/errors';

export interface GetUserInput {
  id: string;
}

export interface GetUserOutput {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export class GetUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: GetUserInput): Promise<GetUserOutput> {
    const user = await this.userRepository.findById(input.id);

    if (!user) {
      throw new UserNotFoundError();
    }

    return {
      id: user.id!,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
    };
  }
}
