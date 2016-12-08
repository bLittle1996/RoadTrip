document.addEventListener('deviceready', () => {

  document.getElementById('save').addEventListener('click', saveRoadTrip)

  function saveRoadTrip() {
    const nameText = document.getElementById('name')
    const descText = document.getElementById('desc')
    const errors = document.getElementById('errors')
    errors.innerHTML = ''
    if(!nameText.value.replace(' ', '')) {
      errors.innerHTML += `<div class='error'>You must provide a name for the RoadTrip!</div>`
    }

    if(!descText.value.replace(' ', '')) {
      errors.innerHTML += `<div class='error'>You must provide a description for the RoadTrip!</div>`
    }
    //if we put stuff in the errors field, then somethings wrong and we shouldn't execute the code below.
    if(!errors.innerHTML) {
      firebase.database().ref(`${teamDir}/users/${device.uuid}`).once('value', snapshot => {
        const user = snapshot.val()
        const newKey = firebase.database().ref(`${teamDir}/roadtrips`).push().key
        //create the new roadtrip object to be created
        const newTrip = {
          name: nameText.value,
          desc: descText.value,
          locations: [],
          publicity: 'private',
          user: device.uuid
        }
        //if the user already has some roadtrips, add it to the array, otherwise make it fresh
        if(user.roadtrips) {
          user.roadtrips.push(newKey)
        } else {
          user.roadtrips = [newKey]
        }
        //update the user in the database, effectively tellig us that hey, this user owns these roadtrips. Also add the roadtrip with the associated key to /roadtrips
        firebase.database().ref(`${teamDir}/users/${device.uuid}`).update(user).then(success => {
          firebase.database().ref(`${teamDir}/roadtrips/${newKey}`).update(newTrip).then(success => {
            window.location.href = 'home.html'
          }, error => {
            console.error(error)
          })
        }, error => {
          console.error(error)
        })
      })
    }

  }
}, false)
