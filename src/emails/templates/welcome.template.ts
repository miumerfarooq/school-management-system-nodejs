export const welcomeEmailTemplate = (name: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#4F46E5; padding:20px; text-align:center;">
              <h2 style="margin:0; color:#ffffff;">
                Welcome to Our Platform 🎉
              </h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px; margin:0 0 10px;">
                Hi ${name},
              </p>

              <p style="font-size:16px; line-height:1.6;">
                We’re excited to have you on board! Your account has been successfully created.
              </p>

              <p style="font-size:16px; line-height:1.6;">
                You can now explore the platform, manage your profile, and get started right away.
              </p>

              <div style="margin:30px 0; text-align:center;">
                <p style="font-size:14px; color:#666;">
                  If you have any questions, feel free to reach out to our support team.
                </p>
              </div>

              <p style="font-size:14px; color:#999; margin-top:30px;">
                We’re glad you’re here 🚀
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f6f8; padding:15px; text-align:center; font-size:12px; color:#999;">
              © ${new Date().getFullYear()} Your Company. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};
