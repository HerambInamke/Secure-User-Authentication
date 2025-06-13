// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (international format)
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Password validation
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/;
  return passwordRegex.test(password);
};

// Address validation
export const validateAddress = (address) => {
  const { street, city, state, zipCode, country } = address;
  
  if (!street || !city || !state || !zipCode || !country) {
    return false;
  }

  // ZIP code validation (basic format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!zipRegex.test(zipCode)) {
    return false;
  }

  return true;
};

// Form validation messages
export const validationMessages = {
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  passwordMatch: 'Passwords do not match',
  required: 'This field is required',
  address: 'Please fill in all address fields',
  zipCode: 'Please enter a valid ZIP code'
}; 