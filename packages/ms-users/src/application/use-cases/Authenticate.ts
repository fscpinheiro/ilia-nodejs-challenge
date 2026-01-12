import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../../domain/repositories';
import { InvalidCredentialsError } from '../../domain/errors';

export interface AuthenticateInput {
  email: string;
  password: string;
}

export interface AuthenticateOutput {
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  access_token: string;
}

export class Authenticate {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtSecret: string,
  ) {}

  async execute(input: AuthenticateInput): Promise<AuthenticateOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign({ userId: user.id }, this.jwtSecret, {
      expiresIn: '1d',
    });

    return {
      user: {
        id: user.id!,
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
      },
      access_token: token,
    };
  }
}
