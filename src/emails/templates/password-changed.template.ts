export const passwordChangedEmailTemplate = (
  name: string,
  changedAt: string
): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Changed</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#EF4444; padding:20px; text-align:center;">
              <h2 style="margin:0; color:#ffffff;">
                Password Changed
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
                This is a confirmation that your account password was changed on:
              </p>

              <p style="font-size:16px; font-weight:bold; margin:15px 0;">
                ${changedAt}
              </p>

              <p style="font-size:15px; line-height:1.6; color:#444;">
                If you made this change, no further action is required.
              </p>

              <p style="font-size:15px; line-height:1.6; color:#444;">
                <strong>If you did NOT change your password</strong>, please secure your account immediately.
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
