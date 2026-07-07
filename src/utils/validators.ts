/**
 * Validate email input.
 * @param email - The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
export const validateEmailInput = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@.]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
