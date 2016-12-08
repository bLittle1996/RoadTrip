'use strict';

document.addEventListener('deviceready', function () {
  var roadtripId = window.location.search.substring(1).split('=')[1];
  var addLocButton = document.getElementById('add-location');
  addLocButton.href = 'add-location.html?roadtrip=' + roadtripId;
  firebase.database().ref(teamDir + '/roadtrips/' + roadtripId).on('value', function (snapshot) {
    document.getElementById('roadtrip-name').innerHTML = snapshot.val().name;
    var locations = document.getElementById('locations');
    if (snapshot.val().locations) {
      snapshot.val().locations.forEach(function (location) {
        firebase.database().ref(teamDir + '/locations/' + location).once('value', function (loc) {
          locations.innerHTML += '\n          <div class="location">\n          <div class="desc">' + loc.val().desc + '</div>\n          <div class="image-count">' + (loc.val().images ? loc.val().images.length : 0) + ' Images</div>\n          <a href="#view-location.html?location=' + location + '">View (Not in)</a>\n          </div>\n          ';
        });
      });
    } else {
      locations.innerHTML = '<div class="">You have no locations in this roadtrip, click the button below to get started!</div>';
    }
  });
}, false);