<?php

class UsuarioController {

    const VIEW_FOLDER = "user";

    public $page_title;
    public $view;
    private UsuarioServicio $usuarioServicio;

    public function __construct() {
        $this->view = self::VIEW_FOLDER . DIRECTORY_SEPARATOR . 'login';
        $this->page_title = '';
        $this->usuarioServicio = new UsuarioServicio();
    }

    //3.b)
    public function list() {
        $this->view = self::VIEW_FOLDER . DIRECTORY_SEPARATOR . 'list_user';
        $this->page_title = 'Listado de usuarios';
        $users = $this->usuarioServicio->getUsuarios();

        //filtramos el resultado para que coincida con lo que espera el cliente
        $users = $this->usuarioServicio->filterUsersList($users);

        $response["page_title"] = $this->page_title;
        $response["data"] = $users;
        $response_json = json_encode($response);
        return $response_json;
    }

    public function login() {
        //Para simplificar la implementación del ejemplo de SPA vamos a obviar la redirección en caso de que ya haya iniciado sesión


        $this->page_title = 'Inicio de sesión';
        $this->view = self::VIEW_FOLDER . DIRECTORY_SEPARATOR . 'login';

        if (isset($_POST["email"]) && isset($_POST["pwd"]) && isset($_POST["rol"])) {
            $email = $_POST["email"];
            $pwd = $_POST["pwd"];
            $rolId = $_POST["rol"];

            $userResult = $this->usuarioServicio->login($email, $pwd, $rolId);

            if ($userResult == null) {

                $response["error"] = true;
                return json_encode($response);
            } else {
                //                c) Se guardará en la sesión (1 punto)
                //
                //    El id del usuario
                //    El id del rol seleccionado
                //    El email del usuario
                //    El tiempo de último acceso con time()
                SessionManager::iniciarSesion();
                $_SESSION["userId"] = $userResult->getId();
                $_SESSION["email"] = $userResult->getEmail();
                $_SESSION["roleId"] = $rolId;
                $_SESSION["ultimoAcceso"] = time();
                // $this->redirectAccordingToRole();

                $response["userId"] = $userResult->getId();
                $response["email"] = $userResult->getEmail();
                //2.a) 
                $response["rolId"] = $rolId;
                return json_encode($response);
            }
        } else {
            //400 Bad Request
            http_response_code(400);
            $response["error"] = true;
            return json_encode($response);
        }
    }

    public function loginJSON() {
        //Para simplificar la implementación del ejemplo de SPA vamos a obviar la redirección en caso de que ya haya iniciado sesión


        $this->page_title = 'Inicio de sesión';
        $this->view = self::VIEW_FOLDER . DIRECTORY_SEPARATOR . 'login';

        try {
            $data = json_decode(file_get_contents("php://input"), true);

            if (isset($data["email"]) && isset($data["pwd"]) && isset($data["rol"])) {
                $email = $data["email"];
                $pwd = $data["pwd"];
                $rolId = $data["rol"];

                $userResult = $this->usuarioServicio->login($email, $pwd, $rolId);

                if ($userResult == null) {
                    $response["error"] = true;
                    return json_encode($response);
                } else {
                    //                c) Se guardará en la sesión (1 punto)
                    //
                    //    El id del usuario
                    //    El id del rol seleccionado
                    //    El email del usuario
                    //    El tiempo de último acceso con time()
                    SessionManager::iniciarSesion();
                    $_SESSION["userId"] = $userResult->getId();
                    $_SESSION["email"] = $userResult->getEmail();
                    $_SESSION["roleId"] = $rolId;
                    $_SESSION["ultimoAcceso"] = time();
                    // $this->redirectAccordingToRole();

                    $response["userId"] = $userResult->getId();
                    $response["email"] = $userResult->getEmail();
                    //2.a)
                    $response["rolId"] = $rolId;
                    return json_encode($response);
                }
            } else {
                //400 Bad Request
                http_response_code(400);
                $response["error"] = true;
                return json_encode($response);
            }
        } catch (Exception $ex) {

            //400 Bad Request
            http_response_code(400);
            $response["error"] = true;
            return json_encode($response);
        }
    }

    public function logout() {
        SessionManager::cerrarSesion();
        $response["error"] = false;
        return json_encode($response);
    }

    //2.c)
    public function register() {
        $this->page_title = 'Registro de usuario';
        $this->view = self::VIEW_FOLDER . DIRECTORY_SEPARATOR . 'register_user';
        //      return  $this->usuarioServicio->registerValidUser();
        $user = $this->usuarioServicio->registerValidUser();
        if ($user == null) {
            //400 Bad Request
            http_response_code(400);
            $response["error"] = true;
        } else {
            $response["errors"] = $user->getErrors();
            $response["error"] = !($user->getStatus() == Util::OPERATION_OK);
        }

        return json_encode($response);
    }

    public function getRoles() {
        $app_roles = $this->usuarioServicio->getRoles();
        return json_encode($app_roles);
    }

    public function delete() {
        $exito = false;
        $response["error"] = true;
        $data = json_decode(file_get_contents("php://input"), true);
        if (isset($data["userId"])) {
            $userId = $data["userId"];
            $exito = $this->usuarioServicio->delete($userId);

            $response["error"] = !$exito;
            $response["userId"] = $userId;
            return json_encode($response);
        } else {
            //400 Bad Request
            http_response_code(400);
            return json_encode($response);
        }
    }

//c) 
    public function checkEmail() {
        $response["available"] = false;

        try {
            $data = json_decode(file_get_contents("php://input"), true);
            if (isset($data["email"])) {
                $available = $this->usuarioServicio->isEmailAvailable($data["email"]);
                $response["available"] = $available;
            } else {
                //400 Bad Request
                http_response_code(400);
            }
        } catch (\Exception $e) {
            echo "Ha ocurrido una excepción " . $e->getMessage();
            //500 Internal Server Error
            http_response_code(500);
        }
        return json_encode($response);
    }

}
