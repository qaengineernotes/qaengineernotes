<?php
// Set error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers for CORS and security
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Function to sanitize input data
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Check if the form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get and sanitize form data
    $name = sanitize_input($_POST['name'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $subject = sanitize_input($_POST['subject'] ?? '');
    $message = sanitize_input($_POST['message'] ?? '');
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($subject) || empty($message)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required']);
        exit;
    }
    
    // Validate email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid email format']);
        exit;
    }
    
    // Set email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: QA Blogs <qaengineernotes@gmail.com>" . "\r\n";
    
    // Prepare thank you email to user
    $user_subject = "Thank you for contacting QA Blogs";
    $user_message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3565f2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Thank You for Contacting Us</h2>
            </div>
            <div class='content'>
                <p>Dear {$name},</p>
                <p>Thank you for reaching out to QA Blogs. We have received your message and will get back to you as soon as possible.</p>
                <p>Here's a copy of your message:</p>
                <p><strong>Subject:</strong> {$subject}</p>
                <p><strong>Message:</strong><br>{$message}</p>
                <p>Best regards,<br>QA Blogs Team</p>
            </div>
            <div class='footer'>
                <p>This is an automated response. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>";
    
    // Prepare notification email to admin
    $admin_subject = "New Contact Form Submission - QA Blogs";
    $admin_message = "
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #3565f2; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Submission</h2>
            </div>
            <div class='content'>
                <div class='field'>
                    <span class='label'>Name:</span><br>
                    {$name}
                </div>
                <div class='field'>
                    <span class='label'>Email:</span><br>
                    {$email}
                </div>
                <div class='field'>
                    <span class='label'>Subject:</span><br>
                    {$subject}
                </div>
                <div class='field'>
                    <span class='label'>Message:</span><br>
                    {$message}
                </div>
                <div class='field'>
                    <span class='label'>Submission Time:</span><br>
                    " . date('Y-m-d H:i:s') . "
                </div>
            </div>
        </div>
    </body>
    </html>";
    
    // Send emails
    $user_mail_sent = mail($email, $user_subject, $user_message, $headers);
    $admin_mail_sent = mail('qaengineernotes@gmail.com', $admin_subject, $admin_message, $headers);
    
    // Check if emails were sent successfully
    if ($user_mail_sent && $admin_mail_sent) {
        echo json_encode(['status' => 'success', 'message' => 'Thank you for your message. We will get back to you soon!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to send email. Please try again later.']);
    }
} else {
    // If not a POST request
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?> 