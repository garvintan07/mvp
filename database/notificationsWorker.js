const Appointment = require('./sms.js');

const notificationWorkerFactory = function() {
  return {
    run: function() {
      Appointment.sendNotifications();
    },
  };
};

module.exports = notificationWorkerFactory();