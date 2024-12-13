import { Resend } from "resend";
import { EmailTemplate } from "../../components/EmailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  console.log("API received request body:", req.body);
  const { fullName, email, notes, selectedImageUrl } = req.body;

  try {
    console.log("Attempting to send email with data:", {
      fullName,
      email,
      notes,
      selectedImageUrl,
    });

    const { data, error } = await resend.emails.send({
      from: "hey@joshmmay.com",
      to: "hey@joshmmay.com",
      subject: "New Sock Design Submission",
      react: EmailTemplate({ fullName, email, notes, selectedImageUrl }),
    });

    if (error) {
      console.error("Resend API error:", error);
      return res.status(400).json({ error });
    }

    console.log("Email sent successfully:", data);
    return res.status(200).json({ data });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Error sending email" });
  }
}
