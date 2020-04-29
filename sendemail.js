const nodemailer = require('nodemailer')

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rajputanjali442@gmail.com',
        pass: 'ramanujam'
    }
})

class SendMail{
    constructor(to, subject, text){
        this.to = to
        this.subject = subject
        this.text = text
    }

    sendMail(){
        var mailOptions = {
            from : "rajputanjali442@gmail.com",
            to: this.to,
            subject: this.subject,
            text: this.text
        }
        transporter.sendMail(mailOptions, (err, info)=>{
            if(err){
                console.log(err)
                return err
            }
            else{
                console.log("email sent: ", info.response)
                return info.response
            }
        })
    }
}

// const mail = new SendMail('rajputanjali@gmail.com', 'jaccobrths@gmail.com', 'subject', 'message from nodemailer');
// mail.sendMail();

module.exports = SendMail;

