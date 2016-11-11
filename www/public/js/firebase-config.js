"use strict";

var config = {
  apiKey: "AIzaSyD6uonrdf1rL8nC3aiRfUa14zUqYra2es8",
  authDomain: "roadtrip-1d5b1.firebaseapp.com",
  databaseURL: "https://roadtrip-1d5b1.firebaseio.com",
  storageBucket: "roadtrip-1d5b1.appspot.com",
  messagingSenderId: "461431680534"
};

firebase.initializeApp(config);
firebase.auth().signInWithEmailAndPassword("b_littleton2@fanshaweonline.ca", "password").catch(function (error) {
  return console.error(error);
});

var teamDir = 'Teams/BestDevelopersNA';