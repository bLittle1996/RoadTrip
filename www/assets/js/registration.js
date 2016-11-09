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
      users.update(update)
      window.location.href = 'index.html' //REMEMBER TO REPLACE - this shouldn't result in redirect loop hopefully
    } else {
      document.getElementsByClassName('error-message')[0].innerHTML = 'Please enter your name!'
      nameEl.className += ' error'
    }
  }
}, false)
