const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const express = require('express')
const helmet = require('helmet')
const nodemailer = require('nodemailer')
const multer = require('multer')
const changeCase = require('change-case-commonjs')
const upload = multer()
const app = express()

const PORT = process.env.PORT
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

app.use((req, res, next)=>{
    res.locals.nonce = crypto.randomBytes(16).toString('base64')
    next()
})

app.use((req, res, next)=>{
    helmet({
        contentSecurityPolicy: {
            directives: {
                scriptSrc: [
                    "'strict-dynamic'",
                    (req, res) => `'nonce-${res.locals.nonce}'`,
                ],
                imgSrc: [
                    "'self'",
                    "https://www.googletagmanager.com",
                    "https://googletagmanager.com",
                    "https://googleads.g.doubleclick.net", 
                    "https://www.google.com",
                    "https://google.com",
                    "https://pagead2.googlesyndication.com",
                    "https://*.google-analytics.com", 
                    "https://*.analytics.google.com", 
                    "https://*.googletagmanager.com", 
                    "https://*.g.doubleclick.net", 
                    "https://*.google.com",
                    "https://ssl.gstatic.com",
                    "https://www.gstatic.com",
                    "https://script.googleusercontent.com",
                    "https://script.google.com",
                    "https://tag.simpli.fi",
                    "https://um.simpli.fi",
                    "https://cm.g.doubleclick.net",
                    "https://www.googleadservices.com"
                ],
                connectSrc: [
                    "'self'",
                    "https://api-gateway.umami.dev/api/send",
                    "challenges.cloudflare.com",
                    "https://pagead2.googlesyndication.com", 
                    "https://www.googleadservices.com",
                    "https://www.google.com", 
                    "https://google.com",
                    "https://*.google-analytics.com", 
                    "https://*.analytics.google.com", 
                    "https://*.googletagmanager.com", 
                    "https://*.g.doubleclick.net", 
                    "https://*.google.com",
                    "https://script.googleusercontent.com",
                    "https://script.google.com"
                ],
                frameSrc: [
                    "'self'",
                    "challenges.cloudflare.com",
                    "https://www.googletagmanager.com",
                    "https://td.doubleclick.net",
                    "https://insight.adsrvr.org"
                ],
                styleSrc: [
                    "'self'",
                    "https://googletagmanager.com",
                    "https://tagmanager.google.com",
                    "https://fonts.googleapis.com",
                    "https://js.adsrvr.org"
                ],
                styleSrcAttr: [
                    "'unsafe-inline'"
                ],
                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com",
                    "data:"
                ]
            }
        }
    })(req, res, next)}
)

app.get('/', (req, res)=>{
    let html = fs.readFileSync(path.join(__dirname, 'public/index.html'), 'utf-8')
    html = html.replaceAll('{{nonce}}', res.locals.nonce)
    res.send(html)
})
app.get('/about/', (req, res)=>{
    let html = fs.readFileSync(path.join(__dirname, 'public/about/index.html'), 'utf-8')
    html = html.replaceAll('{{nonce}}', res.locals.nonce)
    res.send(html)
})
app.get('/contact/', (req, res)=>{
    let html = fs.readFileSync(path.join(__dirname, 'public/contact/index.html'), 'utf-8')
    html = html.replaceAll('{{nonce}}', res.locals.nonce)
    res.send(html)
})
app.get('/book/', (req, res)=>{
    let html = fs.readFileSync(path.join(__dirname, 'public/book/index.html'), 'utf-8')
    html = html.replaceAll('{{nonce}}', res.locals.nonce)
    res.send(html)
})
app.get('/sitemap.xml', (req, res)=>{
    res.sendFile('/sitemap.xml')
})

app.use(express.static(path.join(__dirname, "public")))

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

function format24HourTime(time){
    let array = time.split(":")
    let hours = Number(array[0])
    let minutes = Number(array[1])
    let meridian = ""
    if (hours > 12 && hours !== 24){
        hours = hours % 12
        meridian = "PM"
    }
    else if (hours == 0 || hours == 24){
        hours = 12
        meridian = "AM"
    }
    else if (hours == 12){
        hours = 12
        meridian = "PM"
    }
    else {
        meridian = "AM"
    }
    if (minutes < 10){
        minutes = "0" + minutes
    }
    return `${hours}:${minutes} ${meridian}`
}

async function formatAndSendEmail(req, res){
    let formData = {...req.body}

    let cfData = new FormData()
    cfData.append("secret", CF_SECRET_KEY)
    cfData.append("response", formData['cf-turnstile-response'])

    const result = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        body: cfData,
        method: 'POST',
    })
    const outcome = await result.json()

    if (!outcome.success) {
        res.send({ success: false })
    }
    else{
        let text = ''
        let mailOptions = {
            from: 'automated@ondre.org',
            to: 'info@grandeurservice.com',
            subject: '',
            text: {}
        }
    
        delete formData['cf-turnstile-response']
        
        if (formData['pickup-date-time']){
            formData['pickup-date-time'] = new Date(formData['pickup-date-time']).toLocaleString()
        }
        
        if (formData['dropoff-time']){
            formData['dropoff-time'] = format24HourTime(formData['dropoff-time'])
        }
    
        for (let key in formData) {
            if (formData.hasOwnProperty(key)) {
                value = formData[key];
                text += `${changeCase.capitalCase(key)}: ${value}\n` 
            }
        }
    
        mailOptions.text = text
    
        if (text.includes("Pickup")){
            mailOptions.subject = "New Booking Request"
        }
        else {
            mailOptions.subject = "New Website Message"
        }

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



