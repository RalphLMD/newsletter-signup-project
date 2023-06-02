//jshint esversion: 6

const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'))

app.listen(3000, function(){
    console.log("Server is running!")
})

app.get("/", function(request, response){
    response.sendFile(__dirname + '/signup.html')
})

app.post("/", function(request, response){
    const firstName = request.body.firstName
    const lastName = request.body.lastName
    //var password = request.body.password
    const email = request.body.email
    const data = {
        members: [ 
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ] 
    };

    const jsonData = JSON.stringify(data)
    const url = process.env.MAIL_CHIMP_URL
    const options = {
        method: "POST",
        auth: process.env.MAIL_CHIMP_API
    }

    const req = https.request(url, options, function(res) {
        
        if (res.statusCode === 200) {
            response.sendFile(__dirname + '/success.html')
        } else {
            response.sendFile(__dirname + '/error.html')
        }

        res.on("data", function(data){
            console.log(JSON.parse(data))
        })
    })

    req.write(jsonData)
    req.end();
})

app.post("/error", function(request, response){
    response.redirect("/")
})

