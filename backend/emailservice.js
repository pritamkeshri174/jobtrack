const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendWelcomeEmail = async (name, email) => {

    await transporter.sendMail({
        from: `"JobTrack" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to JobTrack 🎉",
        html: `
            <h2>Welcome to JobTrack, ${name}! 🎉</h2>

            <p>Your JobTrack account has been registered successfully.</p>

            <p>You can now login and start tracking your job applications.</p>

            <br>

            <p>Thank you for joining JobTrack!</p>

            <p><strong>— JobTrack Team</strong></p>
        `
    });
};

module.exports = sendWelcomeEmail;