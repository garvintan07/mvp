<template>
  <div id="app">
    <h1>FlightProcrastinator</h1> 
    <br/>
    <Form v-on:handle-submit='handleSubmit'/>
    <br/>
    <br/>
    <!-- render page or component showing wait times and when you should leave if tsawait and airportduration !== '' -->
    <Times v-if="tsaWait !== '' && airportDuration !== ''" ref="times" v-bind:tsaWait="this.tsaWait"
    v-bind:airportDuration="this.airportDuration" v-bind:takeOffTime="this.takeOffTime"
    v-bind:currentTime="this.currentTime" v-bind:airportName="this.airportName"
    />
    <br/>
    <div v-if="tsaWait !== '' && airportDuration !== ''">Want to know when you should leave?</div>
    <b-button v-on:click="leave=true" v-if="tsaWait !== '' && airportDuration !== ''">Yep!</b-button>
    <br/>
    <Leave v-if="leave===true" ref='leave' v-bind:tsaWait="this.tsaWait"
    v-bind:airportDuration="this.airportDuration" v-bind:takeOffTime="this.takeOffTime"
    v-bind:currentTime="this.currentTime"/>
  </div>
</template>

<script>
import Form from './components/Form.vue'
import Times from './components/Times.vue'
import Leave from './components/Leave.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
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
      airportName: '',
      leave: false
    }
  },
  methods: {
    handleSubmit(flightInfo) {
      this.flightNumber = flightInfo.flightNumber;
      let location = `${flightInfo.streetAddress.split(" ").join('+')}+${flightInfo.city.split(" ").join("+")}+${flightInfo.state}`;
      this.location = location;
      this.getFlightInfo(this.flightNumber);
      this.leave = false;
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
        this.airportName = airportName;
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
    },
    timeToTakeOff() {
      this.$refs.leave.timeLeft()
    }
  },
  mounted () {
    let d = new Date();
    let n = d.getHours() + ":" + d.getMinutes();
      this.currentTime = n
  },
  created() {
    setInterval(() => {
      let d = new Date();
    let n = d.getHours() + ":" + d.getMinutes();
      this.currentTime = n}, 1000*60);
  },
  updated() {
    this.calculate();
    this.timeToTakeOff();
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
  /* position:absolute; */
}
</style>
