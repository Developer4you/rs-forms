export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const checkPasswordStrength = (password: string): number => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return strength;
};
