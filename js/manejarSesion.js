
/*Envía datos al servidor con POST en formato JSON de forma que pueden ser recuperados en php://input */
function loginJSON(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let pwd = document.querySelector("#pwd").value;
    let rol = document.querySelector("#rol").value;


    let login_url = "?controller=Usuario&action=loginJSON";

    const data = {'email': email, 'pwd': pwd, 'rol': rol};

    const request = new Request(BASE_URL + login_url, {
        method: "POST",
        body: JSON.stringify(data)
    });

    fetch(request)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    console.log('error 400');
                    return false;
                } else {
                    console.log("Something went wrong on API server!");
                    return false;
                }

            })
            .then((response) => {

                if (response.userId && response.email && response.rolId) {
                    showView(MAIN_VIEW_ID);
                    setEmail(response.email);
                    console.log(response.email);
                    //toggleLoginMain(response.email);

                    //2.b) punto 1
                    if (Number(response.rolId) === ADMIN_ROLE) {
                        cargarUsuarios();
                    }


                } else {
                    console.error('La autenticación ha fallado');
                    showMsg('La autenticación ha fallado', true, ERROR_MSG_TYPE);
                }
            }
            )
            .catch((error) => {
                console.error('Ha ocurrido un error en login' + error);
                showMsg('La autenticación ha fallado', true, ERROR_MSG_TYPE);
            });


}



function logout() {

    let logout_url = "?controller=Usuario&action=logout";

    const request = new Request(BASE_URL + logout_url, {
        method: "POST"

    });

    fetch(request)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log("Something went wrong on API server!");
                    return false;
                }
            }
            ).
            then((response) => {
                if ((response.error === true) || (response === false)) {
                    showMsg('Ha habido un error en el cierre de sesión', true, ERROR_MSG_TYPE);

                }
                showView(LOGIN_VIEW_ID);
                setEmail('');

                //   toggleLoginMain('');
            })
            .catch((error) => {
                console.error('Ha ocurrido un error en login' + error);
            });
}


//1. b)
function checkEmail() {
    let email = document.getElementById('emailRegister').value;
    const data = {'email': email};


    let checkEmail_url = "?controller=Usuario&action=checkEmail";

    const request = new Request(BASE_URL + checkEmail_url, {
        method: "POST",
        body: JSON.stringify(data)
    });

    fetch(request)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    console.log('error 400');
                    return false;
                } else {
                    console.log("Something went wrong on API server!");
                    return false;
                }

            })
            .then((response) => {
                if ((response !== false) && ((response.available === true) || (response.available === false))) {
                    //d) y e) 
                    showEmailFeedback(response.available);

                } else {
                    console.error("No se ha podido detectar la disponibilidad del email");
                    showMsg('No se ha podido detectar la disponibilidad del email', true, ERROR_MSG_TYPE);
                }

            }
            )
            .catch((error) => {
                console.error('Ha ocurrido un error en login' + error);
                showMsg('La autenticación ha fallado', true, ERROR_MSG_TYPE);
            });
}


//2.b
function doRegister() {

    let email = document.getElementById('emailRegister').value;
    let pwd1 = document.querySelector("#pwd1Register").value;
    let pwd2 = document.querySelector("#pwd2Register").value;



    let register_url = "?controller=Usuario&action=register";


    const data = new FormData();
    data.append('email', email);
    data.append('pwd1', pwd1);
    data.append('pwd2', pwd2);


    const request = new Request(BASE_URL + register_url, {
        method: "POST",
        body: data
    });

    fetch(request)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else if (response.status === 400) {
                    console.log('error 400');
                    return false;
                } else {
                    console.log("Something went wrong on API server!");
                    return false;
                }

            })
            .then((response) => {
                //console.log(response);
                if ((response!==false) && (response.error === false)) {
                    //2.d)
                    showView(LOGIN_VIEW_ID);
                    setPageTitle(LOGIN_TITLE);
                    setEmail('');
                    showMsg('El registro se ha completado con éxito', true, SUCCESS_MSG_TYPE);
                } else {
                    //2.e)
                    let msg = 'No se ha podido completar el registro';
                    if (response.errors.length > 0) {
                        response.errors.forEach(element => {
                            msg += '<br/>' + element;
                        });
                    }
                    showMsg(msg, true, ERROR_MSG_TYPE);
                }

            }
            )
            .catch((error) => {
                //2.e)
                console.error('Ha ocurrido un error en el registro' + error);
                showMsg('Ha ocurrido un error en el registro', true, ERROR_MSG_TYPE);
            });

}




