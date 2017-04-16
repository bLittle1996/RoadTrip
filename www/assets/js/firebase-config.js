const config = {
  apiKey: "ACHOOOO",
  authDomain: "roadtrip-1d5b1.firebaseapp.com",
  databaseURL: "https://roadtrip-1d5b1.firebaseio.com",
  storageBucket: "roadtrip-1d5b1.appspot.com",
  messagingSenderId: "461431680534"
}

firebase.initializeApp(config)
firebase.auth().signInWithEmailAndPassword("b_littleton2@fanshaweonline.ca", "password").catch(error => console.error(error) )

const teamDir = 'Teams/BestDevelopersNA'
