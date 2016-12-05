document.addEventListener('deviceready', () => {
  let roadtripId = window.location.search.substring(1).split('=')[1];
  const addLocButton = document.getElementById('add-location')
  addLocButton.href=`add-location.html?roadtrip=${roadtripId}`
  firebase.database().ref(`${teamDir}/roadtrips/${roadtripId}`).on('value', snapshot => {
    document.getElementById('roadtrip-name').innerHTML = snapshot.val().name
    const locations = document.getElementById('locations')
    if(snapshot.val().locations) {
      snapshot.locations.forEach(location => {
        firebase.database().ref(`${teamDir}/locations/${location}`).once('value', loc => {
          locations.innerHTML += `
          <div class="location">
          <div class="name">${loc.val().name}</div>
          <div class="desc">${loc.val().desc}</div>
          </div>
          `
        })
      })
    } else {
      locations.innerHTML = `<div class="">You have no locations in this roadtrip, click the button below to get started!</div>`
    }

  })
}, false)
