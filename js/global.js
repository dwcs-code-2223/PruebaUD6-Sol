/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */


const BASE_URL = "http://localhost/dwcs/ud6/PruebaUD6-sol/controller/FrontController.php";
const OK_TEXT = "Aceptar";
const CANCEL_TEXT = "Cancelar";
//2.c)
const ADMIN_ROLE = 1;
//Page titles
const LOGIN_TITLE = 'Login';
const REGISTER_TITLE = "Regístrese aquí";
//Ids de las vistas
const LOGIN_VIEW_ID = "login";
const REGISTER_VIEW_ID = "registerSection";
const MAIN_VIEW_ID = "main";
var viewIdsArray = [LOGIN_VIEW_ID, REGISTER_VIEW_ID, MAIN_VIEW_ID];
//Tipos de mensajes
const ERROR_MSG_TYPE = "danger";
const SUCCESS_MSG_TYPE = "success";

let pwdRegExp = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\$@\.\?])(?=.{6,})');


window.onload = onceLoaded;


function onceLoaded() {

    console.debug("window loaded");
    document.querySelector('#formLogin').onsubmit = loginJSON;
    document.querySelector('#formLogout').onsubmit = function (event) {
        //evitamos que se envíe el formulario
        event.preventDefault();
        showModal2('spa_modal', 'Confirmación',
                '¿Está seguro/a de que desea cerrar sesión?',
                'Sí', 'No', logout, null);
    };
    getRoles();

    document.querySelector("#loginLink").onclick = () => {
        showView(LOGIN_VIEW_ID);
        setPageTitle(LOGIN_TITLE);
        setEmail('')
    }

    //1. a)
    document.querySelector('#registerLink').onclick = () => {
        showView(REGISTER_VIEW_ID);
        setPageTitle(REGISTER_TITLE);
        setEmail('');

        //Reset css class and text if toggle between register and login
        let email = document.getElementById('emailRegister');
        email.classList.remove('available');
        email.classList.remove('unavailable');
        let emailFeedback = document.getElementById('emailFeedback');
        emailFeedback.innerHTML = '';
    };

//1. b)
    document.querySelector("#emailRegister").addEventListener("focusout", () => {
        checkEmail();
    });

//2.a)
    document.querySelector("#formRegister").onsubmit = function (event) {
        //evitamos que se envíe el formulario
        event.preventDefault();
        if (validate()) {
            doRegister();
        }
    };






}


/**
 *  Muestra un modal con el id especificado (sin #) Se añade el listener del evento que indica el cierre del modal solo si se acepta (más eficiente)
 * @param {string} modal_id
 * @param {string} title Titulo del modal
 * @param {string}  msg Mensaje con la pregunta que se planteará al usuario
 * @param {string} opt_ok_text Texto a mostrar en el botón de Aceptar. Si no existe, se mostrará el contenido en el html inicialmente.
 * @param {string} opt_cancel_text Texto a mostrar en el botón de Cancelar. Si no existe, se mostrará el contenido en el html inicialmente.
 * @param {callable} opt_ok_function Función a ejecutar si el usuario ha hecho clic en el botón de aceptar. Se deberá ejecutar después de cerrar el diálogo. Si no se aporta una función, simplemente se cerrará el diálogo.
 * @param {callable} opt_cancel_function Función a ejecutar si el usuario ha hecho clic en el botón de cancelar. Se deberá ejecutar después de cerrar el diálogo.  Si no se aporta una función, simplemente se cerrará el diálogo.
 
 */
function showModal2(modal_id, title, msg,
        opt_ok_text = null,
        opt_cancel_text = null,
        opt_ok_function = null,
        opt_cancel_function = null) {


    //Se crea con un objeto options, pero no se pedía en el 
    let myModal = new bootstrap.Modal(document.getElementById(modal_id), {backdrop: 'static', keyboard: true, focus: true});

    let modal_id_selector = '#' + modal_id;

    let title_el = document.querySelector(modal_id_selector + ' #modal_title');
    let msg_el = document.querySelector(modal_id_selector + '  #modal_msg');
    let optok_el = document.querySelector(modal_id_selector + '  #opt_ok');
    let optcancel_el = document.querySelector(modal_id_selector + '  #opt_cancel');

    title_el.innerHTML = title;
    msg_el.innerHTML = msg;


    if (opt_ok_text !== null) {
        optok_el.innerHTML = opt_ok_text;
    } else {
        optok_el.innerHTML = OK_TEXT;
    }

    if (opt_cancel_text !== null) {
        optcancel_el.innerHTML = opt_cancel_text;
    } else {
        optcancel_el.innerHTML = CANCEL_TEXT;
    }

    let myModalEl = document.getElementById(modal_id);
    //Este evento se dispara cuando se termina de mostrar el modal, tanto si el usuario ha hecho clic en OK, NOK o ninguna opción.


    optok_el.onclick = function () {
        //establecemos los flags del botón sobre el que se ha hecho clic y  reiniciamos el valor del otro botón a false
        ok_clicked = true;
        cancel_clicked = false;

        myModalEl.addEventListener('hidden.bs.modal', function (event) {

            if (opt_ok_function !== null) {
                opt_ok_function();
            }

        }, {once: true});
        //Con once:true 
        //nos aseguramos de que solo se ejecute una vez y que justo después se quite el manejador de enventos
        //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener


        myModal.hide();



    };
    optcancel_el.onclick = function () {

        myModalEl.addEventListener('hidden.bs.modal', function (event) {

            if (opt_cancel_function !== null) {
                opt_cancel_function();
            }

        }, {once: true});
        //Con once:true 
        //nos aseguramos de que solo se ejecute una vez y que justo después se quite el manejador de enventos
        //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener


        myModal.hide();
    };

    //Establecemos el foco en OK button con el evento que nos avisa de que se ha mostrado el modal al usuario
    /*Due to how HTML5 defines its semantics, the autofocus HTML attribute has no effect in Bootstrap modals. To achieve the same effect, use some custom JavaScript:
     * 
     */
    myModalEl.addEventListener('shown.bs.modal', function () {
        optok_el.focus();
    }, {once: true});

    //Finalmente mostramos el modal
    myModal.show();

}

/**
 * Muestra un mensaje o no en función del parámatro show(true/false). 
 * @param {string} msg  mensaje a mostrar
 * @param {boolean} show true/false para indicar si se mostrará o no el mensaje
 * @param {string} type será del tipo (success/danger, otros por definir) de Bootstrap mediante las constantes ERROR_MSG_TYPE y SUCCESS_MSG_TYPE
 */
function showMsg(msg, show, type) {
    var divMsg = document.getElementById("divMsg");
    if (show) {
        divMsg.innerHTML = msg;
        divMsg.classList.remove('invisible');
        divMsg.classList.forEach(cssClass => {
            if (cssClass.startsWith('alert-')) {
                divMsg.classList.remove(cssClass);
            }
        });
        divMsg.classList.add('alert-' + type);

        setTimeout(function () {
            divMsg.innerHTML = '';
            divMsg.classList.add('invisible');
        }
        , 2000);
    } else {
        divMsg.innerHTML = '';
        divMsg.classList.add('invisible');
    }
}


function setPageTitle(title) {
    titleEl = document.getElementById('pageTitle');
    titleEl.innerHTML = title;
}


/**
 * Muestra la section de la vista cuyo id se envía por parámetro y oculta las demás secciones del array viewIdsArray.
 * Para que tenga efecto el viewId tiene que formar parte del array viewIdsArray
 * @param {string} viewId cadena de texto con el id de la vista a mostrar. Se recomienda uso de constantes definidas globalmente.
 */
function showView(viewId) {


    let usuarioCabecera = document.getElementById('userHeader');


    for (let index = 0; index < viewIdsArray.length; index++) {
        const tempViewId = viewIdsArray[index];
        if (tempViewId === viewId) {
            show(document.getElementById(viewId), true);
        } else {
            show(document.getElementById(tempViewId), false);
        }
    }

    show(usuarioCabecera, (viewId === MAIN_VIEW_ID));



}
/**
 * Muestra/oculta un elemento html
 * @param {HTMLElement} htmlElement objeto html a mostrar/ocultar
 * @param {boolean} show true para mostrar, false para ocultar 
 */
function show(htmlElement, show) {
    if (show) {
        // hay que mostrar 
        htmlElement.classList.remove('d-none');
    } else {
        // hay que ocultar
        htmlElement.classList.add('d-none');
    }
}

/**
 * Establece el email en la cabecera. Si se pasa cadena vacía, vacía el contenido del main
 * @param {string} email email a mostrar en cabecera o cadena vacía para vaciar la cabecera y el main
 */
function setEmail(email) {
    let emailHeader = document.getElementById('email_header');
    emailHeader.innerHTML = email;
    show(emailHeader, true);
    if (email === '') {
        show(emailHeader, false);
        let mainContent = document.getElementById(MAIN_VIEW_ID + 'Content');
        mainContent.innerHTML = '';
    }
}

/**
 * Muestra el mensaje de disponibilidad de email o su falta de disponibilidad, cambiando el estilo css en cada caso
 * @param {boolean} available true si está disponible, false en caso contrario
 */
function showEmailFeedback(available) {
    let email = document.getElementById('emailRegister');
    let emailFeedback = document.getElementById('emailFeedback');

    if (available) {
        addAvailableCssClass(email, true);
        addAvailableCssClass(emailFeedback, true);
        emailFeedback.innerHTML = email.value + " está disponible";

        show(emailFeedback, true);
    } else {
        addAvailableCssClass(email, false);
        addAvailableCssClass(emailFeedback, false);

        emailFeedback.innerHTML = email.value + " no está disponible";
        show(emailFeedback, true);

    }
}

/**
 * Añadae una clase css para mostrar disponibilidad/falta de disponibilidad a un elmento HTML
 * @param {HTMLElement} htmlElement elemento que recibirá la clase css
 * @param {boolean} available true si está disponible, false en caso contrario
 */
function addAvailableCssClass(htmlElement, available) {
    if (available) {
        htmlElement.classList.remove('unavailable');
        htmlElement.classList.add('available');
    } else {
        htmlElement.classList.remove('available');
        htmlElement.classList.add('unavailable');
    }
}