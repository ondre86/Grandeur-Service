const express = require('express')
const helmet = require('helmet')
const nodemailer = require('nodemailer')
const multer = require('multer')
const upload = multer()
const app = express()
const PORT = 3333

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: 'REDACTED',
        pass: 'REDACTED'
    }
})

// app.use(helmet({
//     contentSecurityPolicy: {
//         directives: {
//             scriptSrc: [
//                 "'self'", 
//                 "cloud.umami.is"
//             ],
//             connectSrc: [
//                 "'self'",
//                 "https://api-gateway.umami.dev/api/send"
//             ],
//         }
//     }
// }))
app.use(express.static('public')).use(express.json()).use(express.text())

app.get('/', (req, res)=>{
    res.status(200).send()
})
app.get('/about/', (req, res)=>{
    res.status(200).send()
})
app.get('/contact/', (req, res)=>{
    res.status(200).send()
})

app.post('/', upload.none(), (req, res)=>{
    formatAndSendEmail(req, res)
})
app.post('/contact', upload.none(), (req, res)=>{
    formatAndSendEmail(req, res)
})
app.post('/book', upload.none(), (req, res)=>{
    formatAndSendEmail(req, res)
})

app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
)

function formatAndSendEmail(req, res){
    console.log(req.body)
    let formData = {...req.body}
    console.log(formData)

    text = ''
    mailOptions = {
        from: 'REDACTED',
        to: 'ondre86@gmail.com',
        subject: 'New Website Message!',
        text: {}
    }

    for (let key in formData) {
        if (formData.hasOwnProperty(key)) {
            value = formData[key];
            text += `${key}: ${value}\n` 
        }
    }
    console.log(text)
    mailOptions.text = text

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.send({ success: false })
        } 
        else {
            res.send({ success: true })
        }
    })
}



