module.exports = {
  
  // 寄認證信
  sendActive: function(user, activeCode){
    
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport();

    // NB! No need to recreate the transporter object. You can use
    // the same transporter object for all e-mails

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Tango Service <service@tango.tw>', // sender address
        to: user.email, // list of receivers
        subject: 'Tango 単語帳会員認證信', // Subject line
        text: '請在瀏覽器貼上網址 http://localhost:1337/active/' + activeCode, // plaintext body
        html: '請 <a href="http://localhost:1337/active/' + activeCode + '">點此</a> 啟動您的 Tango 単語帳帳號' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('會員認證信已寄出！\r\n info.response: ' + info.response);
        }
    });
    
  },
  
  // 寄重設密碼信
  
  sendResetPWD: function(user, resetPasswordCode){
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport();

    var mailOptions = {
        from: 'Tango Service <service@tango.tw>', // sender address
        to: user.email, // list of receivers
        subject: 'Tango 単語帳会員重設密碼信', // Subject line
        text: '請在瀏覽器貼上網址 http://localhost:1337/reset_password/' + resetPasswordCode + ' 重設你的密碼', // plaintext body
        html: '請 <a href="http://localhost:1337/reset_password/' + resetPasswordCode + '">點此</a> 重設你的密碼' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('會員認證信已寄出！\r\n info.response: ' + info.response);
        }
    });
  }
}