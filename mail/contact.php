<?php

require_once 'PHPMailer/PHPMailer.php';
require_once 'PHPMailer/SMTP.php';
require_once 'PHPMailer/Exception.php';

// Configure PHPMailer with your Gmail credentials and settings
$mail = new PHPMailer\PHPMailer\PHPMailer();
$mail->isSMTP();
$mail->Host = 'smtp.gmail.com';
$mail->SMTPAuth = true;
$mail->Username = 'nour.eldin06@gmail.com';
$mail->Password = 'ryoc yrbk xiqq zfij';
$mail->SMTPSecure = 'tls';
$mail->Port = 587;

// Get posted data from AJAX request
$name = $_POST['name'];
$email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

// Set sender and recipient
$mail->setFrom('nour.eldin06@gmail.com', 'Your Name');
$mail->addAddress('nour.eldin06@gmail.com', 'Nour Eldin');

// Subject and message body
$subject = "New Contact Form Submission: $subject";
$body = "Name: $name\nEmail: $email\nSubject: $subject\nMessage:\n$message";

// Set email content
$mail->IsHTML(false);
$mail->Subject = $subject;
$mail->Body = $body;

// Send email
if (!$mail->send()) {
  echo json_encode([
    'success' => false,
    'message' => 'Error sending message: ' . $mail->ErrorInfo,
  ]);
} else {
  echo json_encode([
    'success' => true,
    'message' => 'Message sent successfully!',
  ]);
}

?>
