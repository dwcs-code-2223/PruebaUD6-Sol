/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */
/*Envía datos al servidor con POST en FormData de forma que pueden ser recuperados en $_POST*/
function login(event) {
    event.preventDefault();

    let email = document.getElementById('email').value;
    let pwd = document.querySelector("#pwd").value;
    let rol = document.querySelector("#rol").value;


    let login_url = "?controller=Usuario&action=login";

    const data = new FormData();
    data.append('email', email);
    data.append('pwd', pwd);
    data.append('rol', rol);

    const request = new Request(BASE_URL + login_url, {
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
                console.log(response);
                if (response.userId && response.email && response.rolId) {
                    toggleLoginMain(response.email);
                    
                     //2.b) punto 1
                     if(Number(response.rolId)===ADMIN_ROLE){
                        cargarUsuarios();
                    }

                } else {
                    console.error('La autenticación ha fallado');
                    showError('La autenticación ha fallado', true);
                }
            }
            )
            .catch((error) => {
                console.error('Ha ocurrido un error en login' + error);
                showError('La autenticación ha fallado', true);
            });


}

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
                    toggleLoginMain(response.email);
                    
                    //2.b) punto 1
                     if(Number(response.rolId)===ADMIN_ROLE){
                        cargarUsuarios();
                    }


                } else {
                    console.error('La autenticación ha fallado');
                    showError('La autenticación ha fallado', true);
                }
            }
            )
            .catch((error) => {
                console.error('Ha ocurrido un error en login' + error);
                showError('La autenticación ha fallado', true);
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
                    showError('Ha habido un error en el cierre de sesión', true);
            
                }
                toggleLoginMain('');
            })
            .catch((error) => {
                console.error('Ha ocurrido un error en login' + error);
            });
}

/* Muestra la sección de login y oculta la section de main y viceversa
 * Si 
 * */
/**
 * Muestra la sección de login y oculta la section de main  y la cabecera o viceversa: Oculta login y muestra section de main y cabecera
 * @param {string} email Email que se muestra acompañando al mensaje de Hola. Si es cadena vacía (o espacios), se vacía el mainContent y se establece el título de LOGIN.

 */
function toggleLoginMain(email) {

    let main = document.getElementById('main');
    let login = document.getElementById('login');
    let usuarioCabecera = document.getElementById('userHeader');
    let emailHeader = document.getElementById('email_header');

    emailHeader.innerHTML = email;
// https://getbootstrap.com/docs/5.0/utilities/display/
    emailHeader.classList.toggle('d-none');


    login.classList.toggle('d-none');
    main.classList.toggle('d-none');
    usuarioCabecera.classList.toggle('d-none');

    if (email.trim() === '') {
        //vaciamos el main
        mainContentEl = document.getElementById('mainContent');
        mainContentEl.innerHTML='';
        setPageTitle(LOGIN_TITLE);
        
    }

}



