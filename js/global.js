/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */


const BASE_URL = "http://localhost/dwcs/ud6/Tarea06.2/controller/FrontController.php";
const OK_TEXT = "Aceptar";
const CANCEL_TEXT = "Cancelar";
//2.c)
const ADMIN_ROLE = 1;
const LOGIN_TITLE ='Login';


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
}
/**
 *  Muestra un modal con el id especificado (sin #) Usa 2 flags para controlar si se ha aceptado/cancelado en el listener del evento que indica el cierre del modal
 * @param {string} modal_id
 * @param {string} title Titulo del modal
 * @param {string}  msg Mensaje con la pregunta que se planteará al usuario
 * @param {type} opt_ok_text Texto a mostrar en el botón de Aceptar. Si no existe, se mostrará el contenido en el html inicialmente.
 * @param {type} opt_cancel_text Texto a mostrar en el botón de Cancelar. Si no existe, se mostrará el contenido en el html inicialmente.
 * @param {type} opt_ok_function Función a ejecutar si el usuario ha hecho clic en el botón de aceptar. Se deberá ejecutar después de cerrar el diálogo. Si no se aporta una función, simplemente se cerrará el diálogo.
 * @param {type} opt_cancel_function Función a ejecutar si el usuario ha hecho clic en el botón de cancelar. Se deberá ejecutar después de cerrar el diálogo.  Si no se aporta una función, simplemente se cerrará el diálogo.
 
 */
function showModal(modal_id, title, msg,
        opt_ok_text = null,
        opt_cancel_text = null,
        opt_ok_function = null,
        opt_cancel_function = null) {

//creo unos flags para indicar qué ha decidido el usuario
    let ok_clicked = false;
    let cancel_clicked = false;

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

    myModalEl.addEventListener('hidden.bs.modal', function (event) {
        if (ok_clicked === true) {
            if (opt_ok_function !== null) {
                opt_ok_function();
            }
        } else {
            if (cancel_clicked === true) {
                if (opt_cancel_function !== null) {
                    opt_cancel_function();
                }
            }
        }
        ok_clicked = false;
        cancel_clicked = false;
    }, {once: true});
    //Con once:true 
    //nos aseguramos de que solo se ejecute una vez y que justo después se quite el manejador de enventos
    //https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener


    optok_el.onclick = function () {
        //establecemos los flags del botón sobre el que se ha hecho clic y  reiniciamos el valor del otro botón a false
        ok_clicked = true;
        cancel_clicked = false;

        myModal.hide();
    };
    optcancel_el.onclick = function () {
        cancel_clicked = true;
        ok_clicked = false;

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
 *  Muestra un modal con el id especificado (sin #) Se añade el listener del evento que indica el cierre del modal solo si se acepta (más eficiente)
 * @param {string} modal_id
 * @param {string} title Titulo del modal
 * @param {string}  msg Mensaje con la pregunta que se planteará al usuario
 * @param {type} opt_ok_text Texto a mostrar en el botón de Aceptar. Si no existe, se mostrará el contenido en el html inicialmente.
 * @param {type} opt_cancel_text Texto a mostrar en el botón de Cancelar. Si no existe, se mostrará el contenido en el html inicialmente.
 * @param {type} opt_ok_function Función a ejecutar si el usuario ha hecho clic en el botón de aceptar. Se deberá ejecutar después de cerrar el diálogo. Si no se aporta una función, simplemente se cerrará el diálogo.
 * @param {type} opt_cancel_function Función a ejecutar si el usuario ha hecho clic en el botón de cancelar. Se deberá ejecutar después de cerrar el diálogo.  Si no se aporta una función, simplemente se cerrará el diálogo.
 
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


/*1.b) */
function showError(msg, show) {
    var divError = document.getElementById("divError");
    if (show) {
        divError.innerHTML = msg;
        divError.classList.remove('d-none');
        setTimeout(function () {
            divError.innerHTML = '';
            divError.classList.add('d-none');
        }
        , 2000);
    } else {
        divError.innerHTML = '';
        divError.classList.add('d-none');
    }
}


function setPageTitle(title) {
    titleEl = document.getElementById('pageTitle');
    titleEl.innerHTML = title;
}
