const nodemailer = require('nodemailer');
// Додавання данних з env змінні оточення process.env
require("dotenv").config();

const{META_PASSWORD}=process.env;

const nodemailerConfig ={
    host:"smtp.meta.ua",
    port:465,
    secure:true,
    auth:{
        user:"dencov83@meta.ua",
        pass:META_PASSWORD
    }
};
const transport = nodemailer.createTransport(nodemailerConfig);



// // Створюємо email
// const email = {
//     // Кому відправляємо пошту
//     to:"",
//     // Від кого відправляємо пошту
//     from:"dencov83@meta.ua",
//     // Тема листа
//     subject:"Test email",
//     // Зміст листа
//     html:"<p>Send test email</p>"
// };

// transport.sendMail(email).then(()=>console.log('test email success')
// ).catch(error=>console.log(error.message))

const sendEmail = async(data)=>{
    const email ={...data, from:"dencov83@meta.ua"};
    await transport.sendMail(email)
    return true
}

module.exports=sendEmail;