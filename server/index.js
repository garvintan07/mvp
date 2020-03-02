const express = require('express')
const app = express()
const port = 3005
const keys = require('../config.js')
const axios = require('axios')
const cors = require('cors')

app.use(express.json())
app.use(cors())

app.get('/WaitTimes', (req, res) => {
    let code = req.query.airport
    axios({
        method: 'get',
        url: 'https://www.tsawaittimes.com/api/airport/' +`${keys.tsa_api_key}` +`/${code}`
    })
    .then((response) => {
        res.send(response.data.rightnow_description)
    })
    .catch((error) => {
        console.log(error)
    })
})

app.get('/FlightInfo', (req, res) => {    
    let flight = req.query.flight
    axios({
        method: 'get',
        url: 'http://flightxml.flightaware.com/json/FlightXML2/FlightInfo?ident='+`${flight}`,
        auth: {
            username : keys.flight_time_username,
            password: keys.flight_time_api_key
        }
    })
    .then((response)=> {
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(response.data.FlightInfoResult.flights[0].filed_departuretime * 1000);
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = "0" + date.getMinutes();
        // Seconds part from the timestamp
        // var seconds = "0" + date.getSeconds();
        // Will display time in 10:30:23 format
        var formattedTime = hours + ':' + minutes.substr(-2)

        let flightData = {
            airportCode: response.data.FlightInfoResult.flights[0].origin,
            airportName: response.data.FlightInfoResult.flights[0].originName,
            takeOffTime: formattedTime
        }
        res.send(flightData)
    })
    .catch((error)=> {
        console.log(error)
        res.sendStatus(404)
    })
    
})

app.get('/AirportTime', (req, res) => {
    axios({
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/directions/json?',
        params: {
            origin: req.query.origin,
            destination: req.query.destination,
            key: keys.google_api_key
        }
    })
    .then((response) => {
        res.send(response.data.routes[0].legs[0].duration.text)
    })
    .catch((error) => {
        console.log(error)
    })
})

app.get('/', (req, res) => res.send('Hello '))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))