(function () {

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


  //Get Element from login.html

  const txtEmail = $('#txtEmail');
  const txtPassword = $('#txtPassword');
  const txtUsername = $('#txtUsername');
  const btnLogin = $('#btnLogin');
  const btnSignUp = $('#btnSignUp');
  const btnLogout = $('#btnLogout');
  const btnSetUsername = $('#btnSetUsername');


  //Add login event

  btnLogin.on('click',function() {
    //Get email and password

    const email = "panteliselef@outlook.com";//txtEmail.val();
    const pass = "123456" ;//txtPassword.val();
    const auth = firebase.auth();
    //Sign in
    const promise = auth.signInWithEmailAndPassword(email,pass);

    promise.catch(function(e) {
       console.log(e.message)
    });
  });

  // Add sign up event

  btnSignUp.on('click',function() {
    //Get email and password
    //TODO: Check for valid email
    const email = txtEmail.val();
    const pass = txtPassword.val();
    const auth = firebase.auth();
    //Sign in
    const promise = auth.createUserWithEmailAndPassword(email,pass);

    promise.catch(function(e) {
       console.log(e.message)
    });
  });


  btnLogout.on('click',function() {
    firebase.auth().signOut();
  });

  btnSetUsername.on('click', function() {
    const userName = txtUsername.val();
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: userName
    }).then(function() {
      // Update successful.
      alert(user.displayName);
    }).catch(function(error) {
      // An error happened.
    });
  });


  //Add realtime authentication listener

  firebase.auth().onAuthStateChanged(function(firebaseUser){
    if(firebaseUser) {
      alert(firebaseUser.displayName);
      btnLogout.removeClass('hide');
      btnSetUsername.removeClass('hide');
      txtEmail.css('display','none');
      txtPassword.css('display','none');
      txtUsername.removeClass('hide');
      btnLogin.addClass('hide');
      btnSignUp.addClass('hide');

      // window.location.assign('../index.html');
    }else {
      console.log('not logged in');
      btnLogout.addClass('hide');
    }
  });


}());
