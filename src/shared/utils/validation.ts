export function validateEmail(email: string): boolean {
  if (!email || !email.trim()) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10;
}

export function validateName(name: string): boolean {
  return Boolean(name && name.trim().length >= 2);
}

export function validateOtp(otp: string): boolean {
  if (!otp) return false;
  const digits = otp.replace(/\D/g, '');
  return digits.length === 4 || digits.length === 6;
}
