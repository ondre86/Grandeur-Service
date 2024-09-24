const express = require('express')
const helmet = require('helmet')
const nodemailer = require('nodemailer')
const app = express()
const PORT = 3333

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'REDACTED',
        pass: 'REDACTED'
    }
})

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: ["'self'", 
                "https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js", 
            ],
        },
      },
}))
app.use(express.static('public')).use(express.json()).use(express.text())

app.get('/', (req, res)=>{
    res.status(200).send()
})
app.get('/about', (req, res)=>{
    res.status(200).send()
})
app.get('/contact', (req, res)=>{
    res.status(200).send()
})

app.post('/', (req, res)=>{
    formatAndSendEmail(req, res)
})
app.post('/contact', (req, res)=>{
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
    senderData = req.body
    
    text = ''

    mailOptions = {
        from: 'REDACTED',
        to: 'ondre86@gmail.com',
        subject: 'New Website Message!',
        text: {}
    }

    for (let key in senderData.data) {
        if (senderData.data.hasOwnProperty(key)) {
            value = senderData.data[key];
            text += `${key}: ${value}\n` 
        }
    }
    console.log(text)

    mailOptions.text = text


    // transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //         res.send({ success: false })
    //     } 
    //     else {
    //         res.send({ success: true })
    //     }
    // })
}



