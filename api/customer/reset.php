<?php
require '../vendor/autoload.php'; // adjust path if needed

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.example.com'; // use your SMTP server (e.g., smtp.gmail.com)
    $mail->SMTPAuth   = true;
    $mail->Username   = 'your-email@example.com'; // your email
    $mail->Password   = 'your-email-password';    // your password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('your-email@example.com', 'Bookshop Admin');
    $mail->addAddress('recipient@example.com', 'Customer Name');

    $mail->isHTML(true);
    $mail->Subject = 'Reset your password';
    $mail->Body    = 'Click this link to reset your password: <a href="https://yourdomain.com/reset.php?token=xyz">Reset</a>';

    $mail->send();
    echo 'Message has been sent';
} catch (Exception $e) {
    echo "Mail Error: {$mail->ErrorInfo}";
}
