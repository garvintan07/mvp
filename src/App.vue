<template>
  <div id="app">
    <h1>FlightPal</h1> 
    <Form v-on:handle-submit='handleSubmit'/>
    <br/>
    <br/>
    <!-- render page or component showing wait times and when you should leave if tsawait and airportduration !== '' -->
    <Times v-if="tsaWait !== '' && airportDuration !== ''" ref="times" v-bind:tsaWait="this.tsaWait"
    v-bind:airportDuration="this.airportDuration" v-bind:takeOffTime="this.takeOffTime"
    v-bind:currentTime="this.currentTime"
    />
    <br/>
    <div v-if="tsaWait !== '' && airportDuration !== ''">Want to know when you should leave?</div>
    <button v-on:click="leave=true" v-if="tsaWait !== '' && airportDuration !== ''">Yep!</button>
    <br/>
    <Leave v-if="leave===true"/>
  </div>
</template>

<script>
import Form from './components/Form.vue'
import Times from './components/Times.vue'
import Leave from './components/Leave.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Form,
    Times,
    Leave
  },
  data() {
    return {
      tsaWait: '',
      airportDuration: '',
      flightNumber: '',
      location: '',
      takeOffTime: '',
      currentTime: '',
      leave: false
    }
  },
  methods: {
    handleSubmit(flightInfo) {
      this.flightNumber = flightInfo.flightNumber;
      let location = `${flightInfo.streetAddress.split(" ").join('+')}+${flightInfo.city.split(" ").join("+")}+${flightInfo.state}`;
      this.location = location;
      this.getFlightInfo(this.flightNumber)
    },
    getWaitTime (airport) {
      axios.get('http://localhost:3005/WaitTimes',{params:{airport: airport}})
      .then((response) => {
        this.tsaWait = response.data
      })
      .catch((error) => {
        console.log(error)
      })
    },
    getFlightInfo (flightNumber) {
      axios.get('http://localhost:3005/FlightInfo',{params:{flight: flightNumber}})
      .then((response) => {
        this.takeOffTime = response.data.takeOffTime;
        let airportCode = response.data.airportCode.slice(1);
        let airportName = response.data.airportName;
        this.getWaitTime(airportCode);
        this.getDuration(airportName)
      })
      .catch((error) => {
        console.log(error)
        alert('flight doesnt exist!')
      })
    },
    getDuration(airport) {
      axios.get('http://localhost:3005/AirportTime', {params:{origin: this.location, destination: airport}})
      .then((response) => {
        this.airportDuration = response.data
      })
      .catch((error) => {
        console.log(error)
      })
    },
    calculate() {
      this.$refs.times.calculateTime(this.takeOffTime)
    }
  },
  mounted () {
    let d = new Date();
    let n = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      this.currentTime = n
  },
  created() {
    setInterval(() => {
      let d = new Date();
    let n = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
      this.currentTime = n}, 1000*60);
  },
  updated() {
    this.calculate()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
