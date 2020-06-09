const nexmo = require('nexmo')

const from = 'Vonage SMS API';
class SendSMS{
        
        constructor(to, text){
                this.to = to
                this.text = text
            }

        sendSMS(){
                nexmo.message.sendSms(from, To, text, {type: 'unicode'}, (err, responseData)=>{
                        if(err){
                            return "Error occured while sending sms"
                        }else{
                            return responseData
                        }
                    });
        }
}

module.exports = SendSMS
