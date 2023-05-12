/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/javascript.js to edit this template
 */


function getRoles() {
    let roles_url = "?controller=Usuario&action=getRoles";

    fetch(BASE_URL + roles_url)
            .then(response => {
                roles = response.json();
                return roles;

            })
            .then(roles => {
                buildRolesSelect(roles);
            }).catch((error) => {
        console.log('Ha ocurrido un error: ' + error);
    });
}



function buildRolesSelect(roles) {
    let select_roles = document.querySelector('#rol');
    for (let i = 0; i < roles.length; i++) {
        let option = '<option value="' + roles[i].id + '">' + roles[i].name + '</option>';
        select_roles.innerHTML += option;
    }
}
//3.a) 
function cargarUsuarios() {
    let list_users_url = "?controller=Usuario&action=list";
    fetch(BASE_URL + list_users_url)
            .then(response => {

                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log("Something went wrong on API server: cargarUsuarios()!");
                    return false;
                }



            })
            .then(response_json => {
                if (response_json.page_title && response_json.data) {
                    let title = response_json.page_title;
                    //console.log(response_json);
                    setPageTitle(title);
                    let table = crearTabla('users_table', response_json.data, ["id", "Email", "Roles", "Acciones"]);
                    let mainContent = document.getElementById('mainContent');
                    mainContent.appendChild(table);
                } else {
                    showError('No se han podido obtener los usuarios', true);
                }



            }).catch((error) => {
        console.log('Ha ocurrido un error en cargarUsuarios: ' + error);
        showError('Ha ocurrido un error: ' + error, true);
    });
}

//3b) Tercer punto
/** Crea una tabla html con id enviado por parámetro, datos y cabeceras enviados
 * @param {string} tableId El valor del atributo html id que acompañará al objeto <table>
 * @param {Array} array_data array de objetos JSON con los que se poblará el cuerpo de la tabla
 * @param {Array} array_cabeceras de cadenas con los que se poblará la cabecera de la tabla
 * @returns {HTMLElement|crearTabla.table} el elemento table con la clase table de Bootstrap https://getbootstrap.com/docs/5.0/content/tables/
 
 */
function crearTabla(tableId, array_data, array_cabeceras) {
    let table = document.createElement('table');
    table.setAttribute('id', tableId);
    //añadimos clase css de bootstrap https://getbootstrap.com/docs/5.0/content/tables/
    table.classList.add('table');
    let thead = document.createElement('thead');
    table.appendChild(thead);
    let fila_cab = crear_fila(array_cabeceras, 'th');
    thead.appendChild(fila_cab);

    let tbody = document.createElement('tbody');
    for (let i = 0; i < array_data.length; i++) {

        let fila_body = crear_fila(array_data[i], 'td');


        let idButton = "del_user_btn_" + array_data[i].userId;
        let deleteButtonEl = crearButtonEl(idButton, confirmDeleteUser, 'btn btn-danger', 'Eliminar usuario');
        deleteButtonEl.setAttribute('data-bs-userId', array_data[i].userId);

        addCellToTr(fila_body, deleteButtonEl, 'td');

        tbody.append(fila_body);
    }

    table.appendChild(tbody);
    return table;
}
/**
 * Crea un elemento tr con celdas th o td con los datos incluidos en el 
 * @param {Object} object Puede tratarse de un array de índices numéricos con las cadenas que se incluirán dentro de las celdas cabecera o un objeto JSON cuyos valores formarán parte de las celdas
 * @param {String} th_td Se indica si se crearán celdas th o td mediante las cadenas 'th' o 'td'
 * @returns {HTMLElement} Devuelve el elemento tr
 */
function crear_fila(object, th_td) {

    const keys = Object.keys(object);

    let tr = document.createElement('tr');

    for (let i = 0; i < keys.length; i++) {
        let celda = document.createElement(th_td);
        const key = keys[i];
        celda.innerHTML = object[key];

        tr.appendChild(celda);
    }
    return tr;
}

/**
 * Crea un elemento <button> con los siguienes parámetros
 * @param {String} idButton Valor del atributo HTML id
 * @param {function} clickListener function que será ejecutada cuando se dispare el evento click
 * @param {String} cssClass Clase css que será aplicada al <button>
 * @param {String} text Texto a mostrar dentro de <button>
 * @returns {HTMLElement|crear_buttonEl.buttonEl} Devuelve el objeto <button> creado
 */
function crearButtonEl(idButton, clickListener, cssClass, text) {
    let buttonEl = document.createElement('button');
    buttonEl.className = cssClass;
    buttonEl.innerText = text;
    buttonEl.setAttribute('id', idButton);
    buttonEl.onclick = clickListener;

    return buttonEl;
}

/**
 * Añade una nueva celda a un elemento <tr>
 * @param {HTMLElement} trEl Element <tr>
 * @param {HTMLElement} contentEl elemento HTML que será añadido a la celda dentro del <tr>
 * @param {String} th_td Cadena 'th' o 'td' para indicar qué clase de celda se añadirá
 * @returns {HTMLElement} Devuelve <tr> con la nueva celda creada
 */
function addCellToTr(trEl, contentEl, th_td) {
    let celdaEl = document.createElement(th_td);
    celdaEl.append(contentEl);
    trEl.append(celdaEl);
    return trEl;


}

function confirmDeleteUser(event) {

    let userId = event.target.getAttribute('data-bs-userId');


    showModal("spa_modal", "Confirmación", "¿Está seguro de que desea eliminar el usuario?", "Sí", "No", function () {
        doDelete(userId);
    }, null);
}


function doDelete(userId) {
    let delete_url = "?controller=Usuario&action=delete";


    let data_enviar = {'userId': userId};
    let request = new Request(BASE_URL + delete_url, {
        method: 'POST',
        body: JSON.stringify(data_enviar)
    });

    fetch(request)
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    console.log("Something went wrong on API server doDeleteUser()!");
                    return false;
                }
            })
            .then(response => {
                if ((response.error === false) && (response.userId)) {
                    let userId = response.userId;
                    deleteUserRow(userId);
                } else {


                    console.error("No se ha podido eliminar el usuario");
                    showError('No se ha podido eliminar el usuario', true);
                }

            }).catch(error => {
        console.log('Ha ocurrido un error en onDelete ' + error);
        showError('No se ha podido eliminar el usuario', true);
    });

}

function deleteUserRow(userId) {
    let button = document.querySelector("button[data-bs-userId='" + userId + "']");
    if (button) {
        let fila = button.closest('tr');
        fila.remove();
    }

}
