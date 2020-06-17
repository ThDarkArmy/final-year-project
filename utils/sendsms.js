const Nexmo = require('nexmo')

const from = 'Vonage SMS API';

const nexmo = new Nexmo({
    apiKey: '6fd90703',
    apiSecret: '0EmQlZp6Loq800AT',
  });
  

class SendSMS{
        
    constructor(to, text){
        this.to = to
        this.text = text
    }

   
    sendSMS(){
        nexmo.message.sendSms(from, this.to, this.text, {type: 'unicode'}, (err, responseData)=>{
            if(err){
                console.log(err)
                return "Error occured while sending sms"
            }else{
                console.log(responseData)
                return responseData
            }
        });
    }
}

module.exports = SendSMS
