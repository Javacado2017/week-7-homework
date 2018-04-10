$(function(){

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCnxpwVJDiOuwPw_zkk1-m9RUAVjVFzqIg",
    authDomain: "week-7-homework-467f0.firebaseapp.com",
    databaseURL: "https://week-7-homework-467f0.firebaseio.com",
    projectId: "week-7-homework-467f0",
    storageBucket: "week-7-homework-467f0.appspot.com",
    messagingSenderId: "941383049743"
  };
  firebase.initializeApp(config);

  //Variable for the database
  var database = firebase.database();

  //On-click event to capture information and push it to database
  $(document).on('click', '#submit', function(event) {
    
    //Sets method so that default action of the event will not be triggered
    event.preventDefault();
    
    //Captures information in form fields
    var name = $('#trainName').val().trim();
    var destination = $('#trainDestination').val().trim();
    var time = $('#trainIntialTime').val().trim();
    var frequency = $('#trainFrequency').val().trim();
    
    //Gets current date
    var currentHour = new Date().getHours();
    var currentMinute = new Date().getMinutes();


    //Clears information after on-click event
    $('#trainName').val('');
    $('#trainDestination').val('');
    $('#trainIntialTime').val('');
    $('#trainFrequency').val('');

    //If input values are all true, pushes the information to database
    var isInputTimeValid = moment(time,"HH:mm").isValid();
    
    if(isInputTimeValid === true && frequency > 0 && frequency <= 60 ) {      
      database.ref().push({
        name: name,
        destination: destination,
        time: time,
        frequency: frequency,
        currentTime: moment(),
      });          
    } else {
      alert('Data input is not is invalid.');
      return;
    }

  });

  //Pulls information from databse and displays it in train table with caculations
  database.ref().on('child_added', function(childSnapshot) {
    
    var train = childSnapshot.val();
    
    var name = train.name;
    var destination = train.destination;
    var time = train.time;
    var frequency = train.frequency;

    var timeConverted = moment(time, "HH:mm").subtract(1, "years");
    var currentTime = moment();
    var diffTime = moment().diff(moment(timeConverted), "minutes");
    var remainder = diffTime % frequency;
      
    var minutesAway = frequency - remainder;
    var nextArrival = moment(moment().add(minutesAway, "minutes")).format("LT");

    var html = `
      <tr>
          <td>${name}</td>
          <td>${destination}</td> 
          <td>${frequency}</td>
          <td>${nextArrival}</td>
          <td>${minutesAway}</td>
      </tr>`;
    
    $('#trainTable tbody').append(html);
    
   });


});   
