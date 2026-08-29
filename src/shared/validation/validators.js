/**
 * Insightify — Frontend Input Validators
 *
 * Client-side validation for form inputs.
 *
 * docs/RULES.md section 10
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;

export function validateEmail(email) {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!EMAIL_REGEX.test(email.trim())) {
    return 'Please enter a valid email address';
  }
  return null;
}

export function validatePassword(password) {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters';
  }
  return null;
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
}

export function validateRequired(value, fieldName = 'This field') {
  if (!value || !value.toString().trim()) {
    return `${fieldName} is required`;
  }
  return null;
}

export function validateUrl(url) {
  if (!url || !url.trim()) {
    return 'URL is required';
  }
  if (!URL_REGEX.test(url.trim())) {
    return 'Please enter a valid URL';
  }
  return null;
}
