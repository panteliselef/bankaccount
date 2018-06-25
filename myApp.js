(function () {

  days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById("myBtn");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks the button, open the modal

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
          modal.style.display = "none";
      }
  }

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAAoGX-a6P_m3JsCdnq6lbsuhmI1GUC7qg",
    authDomain: "bank-account-cce8a.firebaseapp.com",
    databaseURL: "https://bank-account-cce8a.firebaseio.com",
    projectId: "bank-account-cce8a",
    storageBucket: "bank-account-cce8a.appspot.com",
    messagingSenderId: "184178091674"
  };
  firebase.initializeApp(config);

  const database = firebase.database();

  // Add realtime authentication listener
  // var currentUserEmail;
  var currentUserEmail = "panteliselef@outlook.com";
  // firebase.auth().onAuthStateChanged(function(firebaseUser){
  //   if(firebaseUser) {
  //      currentUserEmail = firebaseUser.email;
  //      $('#currentUser').text(currentUserEmail +firebaseUser.uid );
  //   }else {
  //     alert('not logged in');
  //   }
  // });


  // Get Elements
  const preObject = document.getElementById('object');
  const cardList = $('#cardList');
  const ulList = document.getElementById('list');

  var moneyLeft;
  var moneyLeft1;
  var moneyLeftCash;
  var operation;
  var flag = false;

  function getLogs() {
    return database.ref('logs').orderByKey();
  }

  function showAllLogs(l) { // Firebase Object as parameter
    
    l.once('value',function (snapshot) {
      let times = [];
      snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val().time;
        times.push(item);
      })
      times.reverse().forEach(function(item) {
        d =  new Date(item);
        console.log(d);
        $(".list-of-logs").append("<div>"+days[d.getDay()]+ " " +months[d.getMonth()]+" "+ d.getDate() +" "+ d.getFullYear() +"</div>");
        $(".list-of-logs").append("<div>"+d.getHours() +":"+d.getMinutes()+ " GMT +"+d.getTimezoneOffset()/-60+".00</div>");
        $(".list-of-logs").append("<div></div><div></div>");
      });

      console.log(times.reverse());
    })

  }

  function updateLogs() {
    database.ref('logs/').push({
      time : firebase.database.ServerValue.TIMESTAMP
    });
  }


  /* FUNCTIONS */
  function increaseMoney(cId,ammountOfMoney) {
    updateLogs();
    switch (cId) {
      case "001":
        database.ref('cards/' + cId +'/moneyLeft/').set(moneyLeft+ammountOfMoney);
        break;
      case "002":
        database.ref('cards/' + cId +'/moneyLeft/').set(moneyLeft1+ammountOfMoney);
        break;
      case "cash":
        database.ref(cId +'/moneyLeft/').set(moneyLeftCash+ammountOfMoney);
        break;
    }
    console.log('increaseMoney',ammountOfMoney);
  }
  function decreaseMoney(cId,ammountOfMoney) {
    updateLogs();
    switch (cId) {
      case "001":
        database.ref('cards/' + cId +'/moneyLeft/').set(moneyLeft-ammountOfMoney);
        break;
      case "002":
        database.ref('cards/' + cId +'/moneyLeft/').set(moneyLeft1-ammountOfMoney);
        break;
      case "cash":
        database.ref(cId +'/moneyLeft/').set(moneyLeftCash-ammountOfMoney);
        break;
    }

    console.log('decreaseMoney',ammountOfMoney);
  }


  function getListOfObjects(snapshot){ // Returs every object on its parent
    list = []
    snapshot.forEach(function(itemSnapshot) {
      name = itemSnapshot.key;
      const dbRefList = dbRefObject.child(name);
      list.push(name);
    });
    return list;
  }

  function transformCardNumberToX(tmp) {
    for(i = 0; i < tmp.length; i++){
      if(tmp[i] != " ") tmp = tmp.replace(tmp[i],"X");
    }
    return tmp;
  }


  var lastMod = database.ref('logs').limitToLast(1);

  lastMod.on('value',function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      console.log(childSnapshot.val().time);
      d = new Date(childSnapshot.val().time);
      $(".last-modified").text(d);
    })
  })




  // Sync object changes
  var card = database.ref('cards').child('001');
  // console.log(card);
  card.on('value',function(snapshot) {
    recordKey = snapshot.key;
    recordValue = snapshot.val();
    moneyLeft = recordValue.moneyLeft;
    console.log(snapshot.key,recordValue.brand);
    document.getElementById('cardBrand').innerText = recordValue.brand;
    if(currentUserEmail == "pantelisel") {
      document.getElementById('cardNumber').innerText = recordValue.cardNumber;
    }else{
      document.getElementById('cardNumber').innerText = transformCardNumberToX(recordValue.cardNumber);
    }
    document.getElementById('moneyLeft').innerHTML = recordValue.moneyLeft.toFixed(2)+ "&euro;";
    document.getElementById('innerListCard').innerHTML = '<li>' + recordValue.owner + '</li>'
                                                       + '<li> Expires on: ' + recordValue.expireDate.month+'/'+ recordValue.expireDate.year + '</li>'
  });
  var card1 = database.ref('cards').child('002');
  card1.on('value',function(snapshot) {
    recordKey = snapshot.key;
    recordValue = snapshot.val();
    moneyLeft1 = recordValue.moneyLeft;
    console.log(snapshot.key,recordValue.brand);
    document.getElementById('cardBrand1').innerText = recordValue.brand;
    if(currentUserEmail == "pantelis") {
      document.getElementById('cardNumber1').innerText = recordValue.cardNumber;
       document.getElementById('cardNumber1').innerText = transformCardNumberToX(recordValue.cardNumber);
    }else{
      document.getElementById('cardNumber1').innerText = transformCardNumberToX(recordValue.cardNumber);
    }
    tmp = recordValue.moneyLeft.toFixed(2);
    if (tmp[1] == "0") {
      tmp = tmp.replace("-"," ");
    }
    document.getElementById('moneyLeft1').innerHTML = tmp + "&euro;";
    document.getElementById('innerListCard1').innerHTML = '<li>' + recordValue.owner + '</li>'
                                                       + '<li> Expires on: ' + recordValue.expireDate.month+'/'+ recordValue.expireDate.year + '</li>'
  });

  var cash = database.ref('cash');
  cash.on('value',function(snapshot) {
    recordKey = snapshot.key;
    recordValue = snapshot.val();
    moneyLeftCash = recordValue.moneyLeft;
    console.log(recordKey,recordValue.moneyLeft);
    document.getElementById('cashHeading1').innerText = recordKey;
    document.getElementById('cashHeading2').innerText = recordKey;
    document.getElementById('moneyLeftCash').innerHTML = recordValue.moneyLeft.toFixed(2) + "&euro;";;
  });


  $('.cardTitle').on('click',function() {
    console.log(1);
    $(this).next().toggle();
  });

  $('.increaseMoney').on('click',function() {
    cardId = $(this).parent().parent().parent().attr('id');
    modal.style.display = "block";
    $("#moneyInput").val(null).focus();
    operation = 1;
  });
  $('.decreaseMoney').on('click',function() {
    cardId = $(this).parent().parent().parent().attr('id');
    modal.style.display = "block";
    $("#moneyInput").val(null).focus();
    operation = 0;
  });

  // When the user clicks on <span> (x), close the modal
  $('span.close').on('click',function() {
    modal.style.display = "none";
  });
  $('#moneyInput').keypress(function(e) {
    console.log('check');
    if(e.which == 13 && flag == false){
      if(Number(this.value) && operation == 1){
        increaseMoney(cardId,parseFloat(this.value));
      }
      else if(Number(this.value) && operation == 0){
        decreaseMoney(cardId,parseFloat(this.value));
      }
      f = true;
      console.log(Number(this.value));
      modal.style.display = "none";
    }
  });

  $("#btnLogs").on('click',function() {
    $(".list-of-logs").html("");
    $(".list-of-logs").html('<div class="">Date</div><div class="">Time</div><div class="">Store</div><div class="">Details</div>');
    let logs = getLogs();
    $(".list-of-logs").slideToggle();
    showAllLogs(logs); // logs is a Firebase Object
  })



}());
