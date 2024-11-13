const express = require('express')
const helmet = require('helmet')
const nodemailer = require('nodemailer')
const multer = require('multer')
const changeCase = require('change-case-commonjs')
const upload = multer()
const app = express()
const PORT = 3333
const CF_SECRET_KEY = process.env.CF_SECRET

const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
})

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            scriptSrc: [
                "'self'", 
                "cloud.umami.is",
                "challenges.cloudflare.com"
            ],
            connectSrc: [
                "'self'",
                "https://api-gateway.umami.dev/api/send",
                "challenges.cloudflare.com"
            ],
            frameSrc: [
                "'self'",
                "challenges.cloudflare.com"
            ]
        }
    }
}))
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

async function formatAndSendEmail(req, res){
    let formData = {...req.body}

    let cfData = new FormData()
    cfData.append("secret", CF_SECRET_KEY)
    cfData.append("response", formData['cf-turnstile-response'])

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: cfData,
        method: 'POST',
    })

    let text = ''
    let mailOptions = {
        from: 'REDACTED',
        to: 'ondre86@gmail.com',
        subject: '',
        text: {}
    }

    delete formData['cf-turnstile-response']
    formData['pickup-date-time'] = formData['pickup-date-time'].toLocaleString()

    for (let key in formData) {
        if (formData.hasOwnProperty(key)) {
            value = formData[key];
            text += `${changeCase.capitalCase(key)}: ${value}\n` 
        }
    }

    mailOptions.text = text

    if (text.includes("pickup")){
        mailOptions.subject = "New Booking Request"
    }
    else {
        mailOptions.subject = "New Website Message"
    }

    const outcome = await result.json()
    if (!outcome.success) {
        res.send({success:false})
    }
    else{
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                res.send({ success: false })
            } 
            else {
                res.send({ success: true })
            }
        })
    }
}



