function validate() {


    email = document.getElementById("emailRegister");
    pwd1 = document.querySelector("#pwd1Register");
    pwd2 = document.querySelector("#pwd2Register");
    //https://www.w3schools.com/cssref/sel_gen_sibling.php
    errorPwd = document.querySelector("#pwd2Register ~ span.error");

    clearErrors();
    let valid = true;

    if (pwd1.value !== pwd2.value) {
        valid = false;
        showErrorPwdError('Las contraseñas no coinciden');
    } else {
        if (pwdRegExp.test(pwd1.value) === false) {
            valid = false;
            showErrorPwdError('La contraseña debe tener un número, una letra mayúscula, una letra minúscula y un símbolo: $@.? ');
        } 
    }

  return valid;
}

function clearErrors() {
    errorPwd = document.querySelector("#pwd2Register ~ span.error");
    errorPwd.textContent = "";
    //https://getbootstrap.com/docs/5.0/utilities/display/
    //display:none
    errorPwd.classList.add('d-none');
}


function showErrorPwdError(msg) {
    errorPwd = document.querySelector("#pwd2Register ~ span.error");
    errorPwd.textContent = msg;
    //display:inline-block;
    errorPwd.classList.remove('d-none');
}