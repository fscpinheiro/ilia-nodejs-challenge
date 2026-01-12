import bcrypt from 'bcryptjs';
import { UserRepository } from '../../domain/repositories';
import { UserNotFoundError } from '../../domain/errors';

export interface UpdateUserInput {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export interface UpdateUserOutput {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export class UpdateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<UpdateUserOutput> {
    const existingUser = await this.userRepository.findById(input.id);

    if (!existingUser) {
      throw new UserNotFoundError();
    }

    const updateData: Record<string, string> = {};

    if (input.firstName) updateData.firstName = input.firstName;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.email) updateData.email = input.email;
    if (input.password) {
      updateData.password = await bcrypt.hash(input.password, 10);
    }

    const updated = await this.userRepository.update(input.id, updateData);

    return {
      id: updated.id!,
      first_name: updated.firstName,
      last_name: updated.lastName,
      email: updated.email,
    };
  }
}
