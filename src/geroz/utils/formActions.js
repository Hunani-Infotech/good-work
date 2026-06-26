const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function newsLetterFormAction(_prevState, formData) {
  const email = (formData.get('email') || '').trim();

  if (!email) {
    return { success: false, message: 'Email is required.', field: 'email', _id: Date.now(), data: { email } };
  }
  if (!validateEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.', field: 'email', _id: Date.now(), data: { email } };
  }

  await delay(1200);
  return { success: true, message: 'You have been subscribed successfully!', _id: Date.now(), data: {} };
}
