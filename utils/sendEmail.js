import nodemailer from "nodemailer";
const sendEmail = async (email, subject, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    html: `
     <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #333; text-align: center;">Your One-Time Password (OTP)</h2>
          <p style="text-align: center; font-size: 16px;">Dear User,</p>
          <p style="text-align: center; font-size: 16px;">Thank you for choosing our service. To proceed with your action, please use the following OTP:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #007BFF; padding: 10px 20px; border: 1px solid #007BFF; border-radius: 5px; display: inline-block;">${otp}</span>
          </div>
          <p style="text-align: center; font-size: 16px;">This OTP is valid for the next 10 minutes. Please do not share this OTP with anyone.</p>
          <p style="text-align: center; font-size: 16px;">If you did not request this OTP, please ignore this email or contact our support team.</p>
          <p style="text-align: center; font-size: 16px;">Thank you,</p>
          <p style="text-align: center; font-size: 16px;">The Dev-Farhan Team</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #777; text-align: center;">If you have any questions, feel free to reach out to our support team at support@example.com.</p>
        </div>
      </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};

export { sendEmail };
