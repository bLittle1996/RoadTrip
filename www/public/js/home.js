'use strict';

document.addEventListener('deviceready', function () {
  firebase.database().ref(teamDir + '/users/' + device.uuid).once('value', function (snapshot) {
    var user = snapshot.val();
    var roadtripsDiv = document.getElementById('roadtrips');
    if (user.roadtrips) {
      //note that since this is async we'll have to do some extra work to get it in order later on. Probably add each roadtrip to an array and filter based on created timestamps.
      user.roadtrips.forEach(function (roadtrip) {
        firebase.database().ref(teamDir + '/roadtrips/' + roadtrip).once('value', function (trip) {
          roadtripsDiv.innerHTML += '\n            <div id=\'' + roadtrip + '\' class=\'roadtrip\'>\n              <div class=\'roadtrip-title\'>' + trip.val().name + '</div>\n              <div class=\'roadtrip-desc\'>' + trip.val().desc + '</div>\n              Then a button or some icon to indicate you can click it to view the locations and stuff\n            </div>\n          ';
        });
      });
    } else {
      roadtripsDiv.innerHTML = '<div class=\'no-trips\'>You don\'t have any RoadTrips yet, click the button below to get started!</div>';
    }
  });
}, false);