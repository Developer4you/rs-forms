import { describe, it, expect } from 'vitest';
import { formSchema } from '../validation';

describe('validation', () => {
  it('should validate email format', () => {
    const result = formSchema.safeParse({
      name: 'Test',
      age: 30,
      email: 'invalid-email',
      password: 'Password1!',
      confirmPassword: 'Password1!',
      gender: 'male',
      country: 'United States',
      acceptTerms: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === 'Invalid email format'
        )
      ).toBe(true);
    }
  });

  it('should validate password strength', () => {
    const result = formSchema.safeParse({
      name: 'Test',
      age: 30,
      email: 'test@test.com',
      password: 'weak',
      confirmPassword: 'weak',
      gender: 'male',
      country: 'United States',
      acceptTerms: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) =>
            issue.message === 'Password must be at least 8 characters' ||
            issue.message ===
              'Password must contain at least one uppercase letter' ||
            issue.message === 'Password must contain at least one number' ||
            issue.message ===
              'Password must contain at least one special character'
        )
      ).toBe(true);
    }
  });

  it('should validate password match', () => {
    const result = formSchema.safeParse({
      name: 'Test',
      age: 30,
      email: 'test@test.com',
      password: 'Password1!',
      confirmPassword: 'Password2!',
      gender: 'male',
      country: 'United States',
      acceptTerms: true,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(
        result.error.issues.some(
          (issue) => issue.message === 'Passwords must match'
        )
      ).toBe(true);
    }
  });

  it('should validate required fields', () => {
    const result = formSchema.safeParse({
      name: '',
      age: 0,
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      country: '',
      acceptTerms: false,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(5);
    }
  });
});
