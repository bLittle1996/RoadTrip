

document.addEventListener('deviceready', () => {
  //init swiper plugin - makes gallery swipey goodness
  const swiper = new Swiper('.swiper-container', {
    spaceBetween: 10,
    centeredSlides: true,
    pagination: '.swiper-pagination',
    slidesPerView: 'auto',
    paginationClickable: true,
    loop: true
  })
  const roadtripId = window.location.search.substring(1).split('=')[1]
  const camButton = document.getElementById('openCamera')
  const submitButton = document.getElementById('submit')
  const latEl = document.getElementById('lat')
  const lngEl = document.getElementById('lng')
  //get a potential key for our new location
  const locationKey = firebase.database().ref(`${teamDir}/locations`).push().key
  //create object to be used for our location
  const newLocation = {
    description: '',
    images: [],
    lat: '',
    lng: ''
  }
  //declare variables for lat and lng from Geolocation
  let lat, lng
  //add latitude and longitude
  navigator.geolocation.getCurrentPosition(
    (position) => {
      lat = position.coords.latitude
      lng = position.coords.longitude
      latEl.innerHTML = lat
      lngEl.innerHTML = lng
    },
    (error) => {
      document.getElementById('errors').innerHTML = `We were unable to figure out your location, do you have a connection?`
    }
  )
  //add ability to do picture stuff
  camButton.addEventListener('click', openCamera)
  submitButton.addEventListener('click', submitLocation)

  function openCamera() {
    navigator.device.capture.captureImage((mediaFiles) => {
      mediaFiles.forEach(file => {
        //if you know a better way to create files with PhoneGap let me know in feedback, it works but I dislike so much callback nesting
        window.resolveLocalFileSystemURL(file.localURL, fileEntry => {
          fileEntry.filesystem.root.getDirectory('/RoadTrip/', { create: true }, baseDir => {
            baseDir.getDirectory(`/RoadTrip/${roadtripId}/`, { create: true }, rtDir => {
              baseDir.getDirectory(`/RoadTrip/${roadtripId}/${locationKey}/`, { create: true }, finalDir => {
                fileEntry.moveTo(finalDir, fileEntry.name, success => {
                  newLocation.images.push(`/RoadTrip/${roadtripId}/${locationKey}/${success.name}`)
                  swiper.appendSlide(`<div class='swiper-slide'><img src="${success.toURL()}"></div>`)
                },
                error => {
                  console.error(error)
                  document.getElementById('errors').innerHTML = 'Failed to save the image, try again later.'
                })
              },
              error => {
                console.error(error)
                document.getElementById('errors').innerHTML = 'Failed save the picture, try again later.'
              })
            },
            error => {
              console.error(error)
              document.getElementById('errors').innerHTML = 'Failed save the picture, try again later.'
            })
          },
          error => {
            console.error(error)
            document.getElementById('errors').innerHTML = 'Failed save the picture, try again later.'
          })
        },
        error => {
          console.error(error)
          document.getElementById('errors').innerHTML = 'Failed to open the camera app, try again later.'
          //And so the glorious error chain ends.
        }) /* get filesystem end */
      })
    }, {limit: 1});
  }
  function submitLocation() {
    newLocation.lat = lat
    newLocation.lng = lng
    newLocation.desc = document.getElementById('desc').value
    newLocation.roadtrip = roadtripId

    if(!newLocation.desc) {
      document.getElementById('errors').innerHTML = 'You must include at least a description for a location.'
    } else {
      firebase.database().ref(`${teamDir}/roadtrips/${roadtripId}`).once('value', snapshot => {
        const roadtrip = snapshot.val()
        if(roadtrip.locations) {
          roadtrip.locations.push(locationKey)
        } else {
          roadtrip.locations = [locationKey]
        }

        firebase.database().ref(`${teamDir}/roadtrips/${roadtripId}`).set(roadtrip).then(success => {
          firebase.database().ref(`${teamDir}/locations/${locationKey}`).update(newLocation).then(success => {
            window.location.href = `edit-roadtrip.html?roadtrip=${roadtripId}`
          })
        })
      })
    }
  }
}, false)
