'use strict';

//This file is to be run on the first screen the user sees when they start-up
//It checks to see if a user exists in the database, if it does not - it shows a
//'registration page' to get started and then moves on to the real homepage.
document.addEventListener('deviceready', function () {
  var db = firebase.database().ref('Teams/BestDevelopersNA');
  var deviceId = device.uuid;

  db.child('users').on('value', function (snapshot) {
    var users = snapshot.val();
    console.log(deviceId);
    if (users && Object.keys(users).includes(deviceId)) {
      //already exist in database, has run app before.
      console.log('is in users', users[deviceId].name);
    } else {
      //let's take them to a registration page
      console.log('Not in users');
      window.location.href = 'registration.html';
    }
  });
}, false);