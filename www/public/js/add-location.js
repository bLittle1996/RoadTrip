'use strict';

document.addEventListener('deviceready', function () {
  //init swiper plugin - makes gallery swipey goodness
  var swiper = new Swiper('.swiper-container', {
    spaceBetween: 10,
    centeredSlides: true,
    pagination: '.swiper-pagination',
    paginationClickable: true
  });
  var roadtripId = window.location.search.substring(1).split('=')[1];
  var camButton = document.getElementById('openCamera');
  var submitButton = document.getElementById('submit');
  var latEl = document.getElementById('lat');
  var lngEl = document.getElementById('lng');
  //get a potential key for our new location
  var locationKey = firebase.database().ref(teamDir + '/locations').push().key;
  //create object to be used for our location
  var newLocation = {
    description: '',
    images: [],
    lat: '',
    lng: ''
  };
  //declare variables for lat and lng from Geolocation
  var lat = void 0,
      lng = void 0;
  //add latitude and longitude
  navigator.geolocation.getCurrentPosition(function (position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    latEl.innerHTML = lat;
    lngEl.innerHTML = lng;
  }, function (error) {
    document.getElementById('errors').innerHTML = 'We were unable to figure out your location, do you have a connection?';
  });
  //add ability to do picture stuff
  camButton.addEventListener('click', openCamera);
  submitButton.addEventListener('click', submitLocation);

  function openCamera() {
    navigator.device.capture.captureImage(function (mediaFiles) {
      mediaFiles.forEach(function (file) {
        //if you know a better way to create files with PhoneGap let me know in feedback, it works but I dislike so much callback nesting
        window.resolveLocalFileSystemURL(file.localURL, function (fileEntry) {
          fileEntry.filesystem.root.getDirectory('/RoadTrip/', { create: true }, function (baseDir) {
            baseDir.getDirectory('/RoadTrip/' + roadtripId + '/', { create: true }, function (rtDir) {
              baseDir.getDirectory('/RoadTrip/' + roadtripId + '/' + locationKey + '/', { create: true }, function (finalDir) {
                fileEntry.moveTo(finalDir, fileEntry.name, function (success) {
                  newLocation.images.push('/RoadTrip/' + roadtripId + '/' + locationKey + '/' + success.name);
                  swiper.appendSlide('<div class=\'swiper-slide\'><img src="' + success.toURL() + '"></div>');
                }, function (error) {
                  console.error(error);
                  document.getElementById('errors').innerHTML = 'Failed to save the image, try again later.';
                });
              }, function (error) {
                console.error(error);
                document.getElementById('errors').innerHTML = 'Failed save the picture, try again later.';
              });
            }, function (error) {
              console.error(error);
              document.getElementById('errors').innerHTML = 'Failed save the picture, try again later.';
            });
          }, function (error) {
            console.error(error);
            document.getElementById('errors').innerHTML = 'Failed save the picture, try again later.';
          });
        }, function (error) {
          console.error(error);
          document.getElementById('errors').innerHTML = 'Failed to open the camera app, try again later.';
          //And so the glorious error chain ends.
        }); /* get filesystem end */
      });
    }, { limit: 1 });
  }
  function submitLocation() {
    newLocation.lat = lat;
    newLocation.lng = lng;
    newLocation.desc = document.getElementById('desc').value;
    newLocation.roadtrip = roadtripId;

    if (!newLocation.desc) {
      document.getElementById('errors').innerHTML = 'You must include at least a description for a location.';
    } else {
      firebase.database().ref(teamDir + '/roadtrips/' + roadtripId).once('value', function (snapshot) {
        var roadtrip = snapshot.val();
        if (roadtrip.locations) {
          roadtrip.locations.push(locationKey);
        } else {
          roadtrip.locations = [locationKey];
        }

        firebase.database().ref(teamDir + '/roadtrips/' + roadtripId).set(roadtrip).then(function (success) {
          firebase.database().ref(teamDir + '/locations/' + locationKey).update(newLocation).then(function (success) {
            window.location.href = 'edit-roadtrip.html?roadtrip=' + roadtripId;
          });
        });
      });
    }
  }
}, false);