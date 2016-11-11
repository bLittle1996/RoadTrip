document.addEventListener('deviceready', () => {
  firebase.database().ref(`${teamDir}/users/${device.uuid}`).once('value', snapshot => {
    const user = snapshot.val()
    const roadtripsDiv = document.getElementById('roadtrips')
    if(user.roadtrips) {
      //note that since this is async we'll have to do some extra work to get it in order later on. Probably add each roadtrip to an array and filter based on created timestamps.
      user.roadtrips.forEach(roadtrip => {
        firebase.database().ref(`${teamDir}/roadtrips/${roadtrip}`).once('value', trip => {
          roadtripsDiv.innerHTML += `
            <div id='${roadtrip}' class='roadtrip'>
              <div class='roadtrip-title'>${trip.val().name}</div>
              <div class='roadtrip-desc'>${trip.val().desc}</div>
              Then a button or some icon to indicate you can click it to view the locations and stuff
            </div>
          `
        })
      })
    } else {
      roadtripsDiv.innerHTML = `<div class='no-trips'>You don't have any RoadTrips yet, click the button below to get started!</div>`
    }
  })
}, false)
