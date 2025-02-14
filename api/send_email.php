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
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;  // Ubah level debug
        $mail->Debugoutput = function ($str, $level) {
            error_log("PHPMailer [$level] : $str");
        };

        // Konfigurasi SMTP yang diperbaiki
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'pertanianmobile@gmail.com';
        $mail->Password = 'txtk xnwk hxfe hryn';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; 
        $mail->Port = 465;  
        $mail->CharSet = 'UTF-8';

        // Timeout settings
        $mail->Timeout = 60;  // Timeout dalam detik
        $mail->SMTPKeepAlive = true;  // Keep connection alive

        // Sender settings
        $mail->setFrom('pertanianmobile@gmail.com', 'Pertanian Mobile');
        $mail->addAddress($email);

        // Content settings
        $mail->isHTML(true);
        $mail->Subject = 'Informasi Akun Pertanian Mobile';

        $emailContent = "
            <html>
            <head>
                <meta name='x-apple-disable-message-reformatting'>
                <meta name='format-detection' content='telephone=no'>
                <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
                <style>
                    body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                    .header { background: linear-gradient(135deg, #6fb98f 0%, #324851 100%); padding: 15px 0; text-align: center; }
                    .header img { max-width: 200px; height: auto; }
                    .header h1 { color: white; margin: 5px 0 0; font-size: 28px; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .content { background: #ffffff; border-radius: 8px; padding: 30px; margin-top: -40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 20px 0; }
                    .button { display: inline-block; background: #6fb98f; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
                    .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class='header'>
                    <img src='https://i.ibb.co.com/RG3yC3v0/permo.png' alt='Pertanian Mobile Logo'>
                    <h1>Pertanian Mobile</h1>
                </div>
                <div class='container'>
                    <div class='content'>
                        <h2 style='color: #6fb98f; margin-top: 0;'>Informasi Akun Anda</h2>
                        <p>Halo,</p>
                        <p>Berikut adalah detail akun Pertanian Mobile Anda:</p>
                        
                        <div class='info-box'>
                            <p><strong>Username:</strong> {$userData['username']}</p>
                            <p><strong>Password:</strong> {$userData['konfirmasi']}</p>
                        </div>
                        
                        <p style='color: #ef4444;'><strong>Penting:</strong> Untuk keamanan akun Anda, ubah password Anda secara berkala.</p>
                        
                        <a style='color: #ffffff;' href='tabs/tab1' class='button'>Login ke Aplikasi</a>
                        
                        <p style='margin-top: 30px;'>Jika Anda tidak merasa meminta informasi ini, silakan abaikan email ini atau hubungi tim support kami.</p>
                    </div>
                    
                    <div class='footer'>
                        <p>Email ini dikirim secara otomatis, mohon tidak membalas email ini.</p>
                        <p>© 2025 Pertanian Mobile. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        ";

        $mail->Body = $emailContent;
        $mail->AltBody = strip_tags($emailContent);

        // Error handling yang lebih baik
        if (!$mail->send()) {
            error_log("Detailed error info: " . $mail->ErrorInfo);
            throw new Exception($mail->ErrorInfo);
        }

        error_log("Email sent successfully to: " . $email);
        return true;

    } catch (Exception $e) {
        error_log("Detailed error in sending email: " . $e->getMessage());
        return "Gagal mengirim email: " . $e->getMessage();
    } finally {
        // Close SMTP connection
        if ($mail->SMTPKeepAlive) {
            $mail->smtpClose();
        }
    }
}