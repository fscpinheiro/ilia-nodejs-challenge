import bcrypt from 'bcryptjs';
import { User } from '../../domain/entities';
import { UserRepository } from '../../domain/repositories';

export interface CreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface CreateUserOutput {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export class CreateUser {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new Error('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    const user = new User({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: hashedPassword,
    });

    const created = await this.userRepository.create(user);

    return {
      id: created.id!,
      first_name: created.firstName,
      last_name: created.lastName,
      email: created.email,
    };
  }
}
