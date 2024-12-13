export const EmailTemplate = ({ fullName, email, notes, selectedImageUrl }) => {
  return `New Sock Design Submission

Name: ${fullName}
Email: ${email}
Notes: ${notes}
Selected Design: ${selectedImageUrl}`;
};
