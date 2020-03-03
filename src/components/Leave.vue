<template>
  <div>
  <b-alert id='alert' v-model="showDismissibleAlert" variant="success" dismissible>Reminder Saved!</b-alert>

  <br/>
  <div v-if="takeOffInt > 2 && !showDismissibleAlert" > relax you have plenty of time!</div>
  <div v-else-if="takeOffInt <= 2 && !showDismissibleAlert">You should leave in the next {{this.leaveTime}} minutes!</div>
  <br/>
  <br/>
  <button v-if="takeOffInt > 2 && !showDismissibleAlert" v-on:click="sms=true" v-b-modal.modal-1>Want to set a SMS reminder?</button>
  <b-modal id="modal-1" title="Info Please" @ok="handleOk()">
    <!-- <p class="my-4">Hello from modal!</p> -->
    <form>
        Name: 
        <input v-model="name" type='text'/>
        <br/>
        Phone: 
        <input v-model="phone" type='tel'/>
        <br/>
        Reminder: <b-form-select v-model="selected" :options="options"></b-form-select>
        
    </form>
    
  </b-modal>
  <!-- <div v-else>You need to leave in the next minutes!</div> -->
  </div>
</template>

<script>
const axios = require('axios')
const moment = require('moment');
export default {
  name: 'Leave',
  props: ['tsaWait', 'airportDuration', 'takeOffTime', 'currentTime'],
  data() {
    return {
        timeToTakeOff: Number,
        takeOffInt: Number,
        leaveTime: Number,
        sms: false,
        name: '',
        phone: '',
        selected: null,
        showDismissibleAlert: false,
        options: [
          { value: null, text: 'Please select an option' },
          { value: '30', text: "30min (living on the edge!)" },
          { value: '60', text: '1 hour' },
          { value: '90', text: '1 hour and 30 mins' },
          { value: '120', text: '2 hours'}
        ]
    }
  },
  methods: {
      timeLeft() {
        let a = this.takeOffTime;
        let b = this.currentTime;
        this.timeToTakeOff = moment.utc(moment(a,"HH:mm").diff(moment(b,"HH:mm"))).format("HH:mm");
        this.takeOffInt = parseInt(this.timeToTakeOff);
        let split = this.timeToTakeOff.split(':');
        this.leaveTime = ((+split[0])*60 + (+split[1])) - (parseInt(this.airportDuration.slice(0,2))) - (parseInt(this.tsaWait.slice(0,2))) - 30
      },
      handleOk() {
        // Prevent modal from closing
        // event.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
        this.showDismissibleAlert = true;
      },
      handleSubmit() {
        axios.post('http://localhost:3005/reminder', {
          name: this.name,
          phone: this.phone,
          reminder: moment.duration(parseInt(this.selected), 'minutes')
        })
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
          console.log(error)
        })
      }
  }
}
</script>

<style>
#modal-1 {
    font-family: Avenir, Helvetica, Arial, sans-serif;
}
#alert {
    width: 12em;
    margin-left: 27em; 
    margin-top: 2em;
    position: absolute;
}
</style>