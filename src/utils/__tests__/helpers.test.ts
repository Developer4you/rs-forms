import { describe, it, expect, vi } from 'vitest';
import { fileToBase64, checkPasswordStrength } from '../helpers';

describe('helpers', () => {
  describe('fileToBase64', () => {
    it('converts file to base64', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const result = await fileToBase64(file);
      expect(result).toContain('data:text/plain;base64');
    });

    it('handles file read error', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });

      const mockFileReader = {
        readAsDataURL: vi.fn(),
        onerror: vi.fn(),
        onload: vi.fn(),
      };

      vi.stubGlobal(
        'FileReader',
        vi.fn(() => mockFileReader)
      );

      const promise = fileToBase64(file);

      mockFileReader.onerror(new Error('Test error'));

      await expect(promise).rejects.toThrow('Test error');

      vi.unstubAllGlobals();
    });
  });

  describe('checkPasswordStrength', () => {
    it('returns correct strength for passwords', () => {
      expect(checkPasswordStrength('')).toBe(0);
      expect(checkPasswordStrength('short')).toBe(1);
      expect(checkPasswordStrength('password')).toBe(2);
      expect(checkPasswordStrength('Password')).toBe(3);
      expect(checkPasswordStrength('Password1')).toBe(4);
      expect(checkPasswordStrength('Password1!')).toBe(5);
    });
  });
});
