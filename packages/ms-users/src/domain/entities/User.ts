export interface UserProps {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt?: Date;
}

export class User {
  private readonly props: UserProps;

  constructor(props: UserProps) {
    this.validate(props);
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
    };
  }

  private validate(props: UserProps): void {
    if (!props.firstName || props.firstName.trim() === '') {
      throw new Error('First name is required');
    }

    if (!props.lastName || props.lastName.trim() === '') {
      throw new Error('Last name is required');
    }

    if (!props.email || !this.isValidEmail(props.email)) {
      throw new Error('Valid email is required');
    }

    if (!props.password || props.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get lastName(): string {
    return this.props.lastName;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt!;
  }

  toJSON() {
    return {
      id: this.id,
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
    };
  }
}
