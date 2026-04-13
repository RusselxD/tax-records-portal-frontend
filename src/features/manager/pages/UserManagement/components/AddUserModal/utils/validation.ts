export interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: string;
  positionId?: string;
}

export const validate = (
  firstName: string,
  lastName: string,
  email: string,
  roleId: string,
  positionId: string,
  positionRequired: boolean = true,
): FormErrors => {
  const errors: FormErrors = {};
  if (!firstName.trim()) errors.firstName = "First name is required.";
  if (!lastName.trim()) errors.lastName = "Last name is required.";
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!roleId) errors.roleId = "Please select a role.";
  if (positionRequired && !positionId) errors.positionId = "Please select a position.";
  return errors;
};
