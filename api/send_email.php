<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendPasswordRecoveryEmail($email, $userData)
{
    if (empty($userData)) {
        error_log("Empty user data for email: " . $email);
        return "Data pengguna tidak ditemukan";
    }

    if (!isset($userData['username']) || !isset($userData['konfirmasi'])) {
        error_log("Incomplete user data for email: " . $email);
        return "Data pengguna tidak lengkap";
    }

    try {
        $mail = new PHPMailer(true);

        // Server settings
        $mail->SMTPDebug = 2;  // Enable verbose debug output
        $mail->Debugoutput = function ($str, $level) {
            error_log("PHPMailer [$level] : $str");
        };

        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'pertanianmobile@gmail.com';
        $mail->Password = 'txtk xnwk hxfe hryn';  // Ganti dengan App Password yang baru
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';

        // Recipients
        $mail->setFrom('pertanianmobile@gmail.com', 'Pertanian Mobile');
        $mail->addAddress($email);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Informasi Akun Pertanian Mobile';

        $emailContent = "
            <html>
            <body style='font-family: Arial, sans-serif;'>
                <div style='padding: 20px; background-color: #f5f5f5;'>
                    <h2 style='color: #333;'>Akun Pertanian Mobile</h2>
                    <div style='background-color: #fff; padding: 20px; border-radius: 5px;'>
                        <p>Halo,</p>
                        <p>Anda telah meminta informasi akun Anda. Berikut adalah detail akun:</p>
                        <p><strong>Username:</strong> {$userData['username']}</p>
                        <p><strong>Password:</strong> {$userData['konfirmasi']}</p>
                        <p style='margin-top: 20px; color: #666;'>Harap simpan informasi ini dengan aman dan segera ubah password Anda setelah login.</p>
                    </div>
                    <p style='margin-top: 20px; color: #ffffff;'>Salam hangat,<br>Tim IT Pertanian Mobile</p>
                </div>
            </body>
            </html>
        ";

        $mail->Body = $emailContent;
        $mail->AltBody = strip_tags($emailContent);

        if (!$mail->send()) {
            error_log("Email send error: " . $mail->ErrorInfo);
            return "Gagal mengirim email: " . $mail->ErrorInfo;
        }

        error_log("Email sent successfully to: " . $email);
        return true;

    } catch (Exception $e) {
        error_log("Email error: " . $e->getMessage());
        return "Gagal mengirim email: " . $e->getMessage();
    }
}