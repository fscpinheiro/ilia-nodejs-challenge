import { User } from './User';

describe('User Entity', () => {
  const validUserProps = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  it('should create a valid user', () => {
    const user = new User(validUserProps);

    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.password).toBe('password123');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error when firstName is empty', () => {
    expect(() => {
      new User({ ...validUserProps, firstName: '' });
    }).toThrow('First name is required');
  });

  it('should throw error when firstName is whitespace', () => {
    expect(() => {
      new User({ ...validUserProps, firstName: '   ' });
    }).toThrow('First name is required');
  });

  it('should throw error when lastName is empty', () => {
    expect(() => {
      new User({ ...validUserProps, lastName: '' });
    }).toThrow('Last name is required');
  });

  it('should throw error when lastName is whitespace', () => {
    expect(() => {
      new User({ ...validUserProps, lastName: '   ' });
    }).toThrow('Last name is required');
  });

  it('should throw error when email is invalid', () => {
    expect(() => {
      new User({ ...validUserProps, email: 'invalid-email' });
    }).toThrow('Valid email is required');
  });

  it('should throw error when email is empty', () => {
    expect(() => {
      new User({ ...validUserProps, email: '' });
    }).toThrow('Valid email is required');
  });

  it('should throw error when password is too short', () => {
    expect(() => {
      new User({ ...validUserProps, password: '12345' });
    }).toThrow('Password must be at least 6 characters');
  });

  it('should throw error when password is empty', () => {
    expect(() => {
      new User({ ...validUserProps, password: '' });
    }).toThrow('Password must be at least 6 characters');
  });

  it('should return correct JSON format', () => {
    const user = new User({
      id: 'user-123',
      ...validUserProps,
    });

    const json = user.toJSON();

    expect(json.id).toBe('user-123');
    expect(json.first_name).toBe('John');
    expect(json.last_name).toBe('Doe');
    expect(json.email).toBe('john@example.com');
    expect(json).not.toHaveProperty('password');
  });
});
