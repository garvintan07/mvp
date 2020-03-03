<template>
  <div>
      Your Flight takes off at {{this.time}}
      <br/>
      You are {{this.airportDuration}} away from the {{this.airportName}} airport
      <br/>
      Current TSA wait time at your airport is {{this.tsaWait}}
      
  </div>
</template>

<script>
export default {
  name: 'Times',
  props: ['tsaWait', 'airportDuration', 'takeOffTime', 'currentTime', 'airportName'],
  data() {
    return {
      time: ''
    }
  },
  methods: {
    calculateTime(takeoffTime) {
      let hour = parseInt(takeoffTime.slice(0,2)) 
      let ampm = hour > 12 ? 'PM' : 'AM'
      let time = hour > 12 ? hour - 12 : hour;
      this.time = `${time}:${takeoffTime.slice(-2)} ${ampm}`;
  }
}
}
</script>

<style>

</style>