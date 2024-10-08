const { Vonage } = require('@vonage/server-sdk');

const vonage = new Vonage({
  apiKey: process.env.NEXMO_API_KEY,  
  apiSecret: process.env.NEXMO_API_SECRET,  
});

const sendOtp = (phoneNumber) => {
  return new Promise((resolve, reject) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const from = 'AlloMedia'; 
    const text = `Your OTP code is: ${otp}`;

    console.log('Vonage instance:', vonage);
    console.log('Sending OTP to:', phoneNumber);

    vonage.message.sendSms(from, phoneNumber, text, (err, responseData) => {
      if (err) {
        console.error('Error sending SMS:', err);
        reject(err);
      } else {
        if (responseData.messages[0].status === '0') {
          console.log('Message sent successfully.');
          resolve('Message sent successfully.');
        } else {
          console.log(`Message failed with error: ${responseData.messages[0].error-text}`);
          reject(new Error(responseData.messages[0].error-text));
        }
      }
    });
  });
};

module.exports = { sendOtp };
