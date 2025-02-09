<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

function sendPasswordRecoveryEmail($email, $userData) {
    if (empty($userData)) {
        return "Data pengguna tidak ditemukan";
    }
    
    if (!isset($userData['username']) || !isset($userData['konfirmasi'])) {
        return "Data pengguna tidak lengkap";
    }

    try {
        $mail = new PHPMailer(true);

        // Kurangi level debug
        $mail->SMTPDebug = 0;

        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'pertanianmobile@gmail.com';
        $mail->Password = 'txtk xnwk hxfe hryn';
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
                    <h2 style='color: #333;'>Informasi Akun Pertanian Mobile</h2>
                    <div style='background-color: #fff; padding: 20px; border-radius: 5px;'>
                        <p>Berikut adalah informasi akun Anda:</p>
                        <p><strong>Username:</strong> {$userData['username']}</p>
                        <p><strong>Password:</strong> {$userData['konfirmasi']}</p>
                        <p style='margin-top: 20px;'>Harap simpan informasi ini dengan aman.</p>
                    </div>
                    <p style='margin-top: 20px;'>Salam,<br>Tim Pertanian Mobile</p>
                </div>
            </body>
            </html>
        ";

        $mail->Body = $emailContent;
        $mail->AltBody = strip_tags($emailContent);

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Email error: " . $e->getMessage());
        return "Gagal mengirim email: " . $e->getMessage();
    }
}