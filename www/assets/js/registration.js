//add user to the db
document.addEventListener('deviceready', () => {
  const submitBtn = document.getElementById('submit')
  //add event listener to do stuff on submit
  submitBtn.addEventListener('click', onSubmit)

  function onSubmit() {
    
    const name = document.getElementById('name').value
    const userId = device.uuid
    const users = firebase.database().ref('Teams/BestDevelopersNA/users')

    if(name.replace(' ', '')) {
      const update = {}
      update[userId] = {
        name: name
      }
      users.update(update).then((success) => {
        window.location.href = 'home.html'
      }, (error) => {
        document.getElementsByClassName('error-message')[0].innerHTML = 'Unable to update name!'
      })
    } else {
      document.getElementsByClassName('error-message')[0].innerHTML = 'Please enter your name!'
      nameEl.className += ' error'
    }
  }
}, false)
