export const verifyEmailTemplate = (verificationUrl: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#4F46E5; padding:20px; text-align:center;">
              <h2 style="margin:0; color:#ffffff;">Verify Your Email</h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:30px; color:#333333;">
              <p style="font-size:16px; line-height:1.6;">
                Thank you for registering! Please confirm your email address by clicking the button below.
              </p>

              <div style="text-align:center; margin:30px 0;">
                <a
                  href="${verificationUrl}"
                  style="
                    display:inline-block;
                    padding:14px 26px;
                    background-color:#4F46E5;
                    color:#ffffff;
                    text-decoration:none;
                    border-radius:6px;
                    font-size:16px;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px; color:#666;">
                Or copy and paste this link into your browser:
              </p>

              <p style="font-size:14px; word-break:break-all;">
                <a href="${verificationUrl}" style="color:#4F46E5;">
                  ${verificationUrl}
                </a>
              </p>

              <p style="font-size:12px; color:#999; margin-top:30px;">
                This verification link will expire in 24 hours.
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
