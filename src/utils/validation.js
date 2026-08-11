export function validateCheckout(data) {
  const errors = {};

  if (!data.fullName?.trim()) {
    errors.fullName = 'Full name is required.';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'Name must be at least 2 characters.';
  }

  const phone = data.phone?.replace(/\s/g, '') || '';
  if (!phone) {
    errors.phone = 'Phone number is required.';
  } else if (!/^01[0-9]{9}$/.test(phone) && !/^\+?20?1[0-9]{9}$/.test(phone)) {
    errors.phone = 'Enter a valid Egyptian phone number (e.g. 01XXXXXXXXX).';
  }

  if (!data.governorate?.trim()) {
    errors.governorate = 'Governorate is required.';
  }

  if (!data.city?.trim()) {
    errors.city = 'City is required.';
  }

  if (!data.address?.trim()) {
    errors.address = 'Address is required.';
  } else if (data.address.trim().length < 5) {
    errors.address = 'Please enter a complete address.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function sanitizePhone(phone) {
  return phone.replace(/\D/g, '').replace(/^20/, '0');
}
