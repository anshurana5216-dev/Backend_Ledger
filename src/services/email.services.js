const nodemailer = require("nodemailer");

// Create transporter
const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});



// Verify email server connection             *-This checks whether your email configuration is working.
transport.verify((error, success) => {

    // Server uses transporter to communicate with SMTP
    if (error) {
        console.error("Error connecting to email server:", error);
    } else {
        console.log("Email server is ready to send messages");
    }

});


// Function to send email
const sendEmail = async (to, subject, text, html) => {

    try {

        const info = await transport.sendMail({
            from: `"Backend-Ledger" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text,
            html: html
        });

        console.log("Message sent:", info.messageId);

    } catch (error) {

        console.error("Error sending email:", error);

    }
};


// Registration email
async function sendRegistrationEmail(userEmail, name) {

    const subject = "Welcome to Backend Ledger!";

    const text = `Hello ${name},

Thank you for registering at Backend Ledger.
We are happy to have you with us!`;

    const html = `
        <p>Hello ${name},</p>

        <p>
            Thank you for registering at Backend Ledger.
            We are happy to have you with us!
        </p>
    `;

    await sendEmail( userEmail, subject, text, html);}

async function sendTransactionEmail(userEmail , name , amount , toAccount){
    const subject  = 'Transaction Successful';
    const text = 'hello ${name}, \n\n Your tranaction of $${amount} to account'
    const html = '<p> hello ${name} , </p> <p> your transaction of $${amount} to account'

      await sendEmail( userEmail, subject, text, html
    );
}


async function sendTransactionFailedEmail(userEmail , name , amount , toAccount) {
      const subject  = 'Transaction Failed';
    const text = 'hello ${name}, \n\n   we regret to inform you that Your tranaction of $${amount} to account'
    const html = '<p> hello ${name} , </p> <p> we regret to inform you that your transaction of $${amount} to account'

      await sendEmail( userEmail, subject, text, html);
    
}




module.exports = {
    sendRegistrationEmail, 
    sendTransactionEmail,
    sendTransactionFailedEmail
};





