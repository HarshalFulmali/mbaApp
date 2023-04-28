const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    port:465,
    host: "smtp.gmail.com",
    auth:{
        user:"temporaryharshal@gmail.com",
        pass: "pimxlhbpkwjowmsg"
    },
    secure:true
})

async function sendMail(subject,body,to) {
    const mailData = {
        from:"temporaryharshal@gmail.com",
        to:to,
        subject:subject,
        text:body
    }

    try{
        const info = transporter.sendMail(mailData);
        console.log("mail send successfully",info);
    }
    catch(error) {
        console.log("mail send successfully",info);
        throw error;
    }
}

module.exports = sendMail;