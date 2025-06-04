var loginModal;
function modalLoad() {
    loginModal = new bootstrap.Modal(document.getElementById('modalLogin'), {})
    loginModal.toggle()
}

document.addEventListener('DOMContentLoaded', function() {
    var logInButton = document.getElementById("loginButton");
    var signInButton = document.getElementById("signinButton");

    // Preventing the form from being submitted before checking
    logInButton.addEventListener("click", function(event) {
        event.preventDefault();
    });

    signInButton.addEventListener("click", function(event) {
        event.preventDefault();
    });
});

function login(){
    var logInForm = document.getElementById("logInForm");

    var emailInput = document.getElementById("floatingInput1").value;
    var passwordInput = document.getElementById("floatingPassword1").value;
    const user = {
        username : emailInput,
        password : passwordInput,
    };
    userJson = JSON.stringify(user);
    //Debug
    //console.log(userJson);

    post("authenticate", userJson)
    .then(responseText => {
        if (responseText.message == "User authenticated successfully") {
            logInForm.submit();
            window.location.href = url
        }
        else if(responseText.message == "Invalid login credentials"){
            document.getElementById("floatingPassword1").classList.add("is-invalid");
            document.getElementById("floatingInput1").classList.add("is-invalid");
        }
    });
}

//Create new user in database
function addUser(){
    var signInForm = document.getElementById("signInForm");

    var username = document.getElementById("floatingInput2");
    var password = document.getElementById("floatingPassword2");
    var repeatedPassword = document.getElementById("floatingPassword3");

    var emailFeedback = document.getElementById("emailFeedback");
    emailFeedback.innerHTML = "The E-Mail adress is not correct.";

    let formData = new FormData();
    formData.append('username', username.value);
    formData.append('password', password.value);
    formData.append('repeatedPassword', repeatedPassword.value);

    post("User", formData).then(response => {
       
        // Checking for wrong input
        if(response.message == "Illegal E-mail and Password"){
            username.classList.add("is-invalid");
            password.classList.add("is-invalid");
            repeatedPassword.classList.add("is-invalid");
        }
        else if(response.message == "Illegal E-mail"){
            username.classList.add("is-invalid");
            password.classList.remove("is-invalid");
            repeatedPassword.classList.remove("is-invalid");
        }
        else if(response.message == "Not identical Passwords"){
            username.classList.remove("is-invalid");
            password.classList.add("is-invalid");
            repeatedPassword.classList.add("is-invalid");
        }
        else if (response.message == "E-Mail already in use") {
            username.classList.add("is-invalid");
            password.classList.remove("is-invalid");
            repeatedPassword.classList.remove("is-invalid");
            emailFeedback.innerHTML = "This E-Mail is already in use";
        }
        else{
            username.classList.remove("is-invalid");
            password.classList.remove("is-invalid");
            repeatedPassword.classList.remove("is-invalid");
            alert("Account successfully created!");
            signInForm.submit()
        }
          
    });
}