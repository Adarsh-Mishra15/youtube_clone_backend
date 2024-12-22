// emailService.js
// emailService.js
import nodemailer from 'nodemailer';
import pug from "pug"
import path from 'path';

const transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like Yahoo, Outlook, etc.
    auth: {
        user: process.env.EMAIL_USER,  // Your email address (use environment variables for sensitive data)
        pass: process.env.EMAIL_PASS,  // Your email password
    }
});

const sendPasswordChangeNotification = async (email, username) => {

const templatePath = path.resolve('src', './view/emailtemplate.pug');
const html = pug.renderFile(templatePath,{username});


    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender's email
        to: email,  // Receiver's email (user's email)
        subject: 'Password Changed Successfully',  // Subject of the email
        //text: `Hello ${username},\n\nYour password has been changed successfully.\n\nIf you didn't make this change, please contact support immediately.\n\nThank you.`  // Body of the email
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password change notification sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export { sendPasswordChangeNotification };
