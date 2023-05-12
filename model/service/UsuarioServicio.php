<?php

class UsuarioServicio {

    const USER_DOES_NOT_EXIST = "No existe usuario";
    const PWD_INCORRECT = "La contraseña no es correcta";

    private IUsuarioRepository $userRepository;
    private IRolRepository $rolRepository;

    public function __construct() {
        $this->userRepository = new UsuarioRepository();
        $this->rolRepository = new RolRepository();
    }

    /* Get all notes */

    public function getUsuarios(): array {

        $usuarios = $this->userRepository->findAll();
        foreach ($usuarios as $usuario) {
            $roles = $this->rolRepository->findRolesByUserId($usuario->getId());
            $usuario->setRoles($roles);
        }

        return $usuarios;
    }

    //a) iniciar sesión utilizando password_hash() y password_verify() con BCRYPT y parámetros por defecto (1 punto)
    public function login(string $user, string $pwd, $rolId): ?Usuario {

        $userResult = $this->userRepository->getUsuarioByEmail($user);

        if ($userResult != null) {
            $roles = $this->rolRepository->findRolesByUserId($userResult->getId());

            $userResult->setRoles($roles);

            if ($userResult != null && password_verify($pwd, $userResult->getPwdhash())) {

                //check if selected rol is among user roles
                if ($this->isUserInRole($userResult, $rolId)) {

                    return $userResult;
                }
            }
        }
        return null;
    }

    public function getRoles(): array {

        $roles = $this->rolRepository->findAll();

        return $roles;
    }

    public function getRoleById(int $roleId): Rol {

        $roles = $this->rolRepository->findAll();
        foreach ($roles as $rol) {
            if ($rol->getId() === $roleId) {
                return $rol;
            }
        }


        return null;
    }

    public function isUserInRole(Usuario $usuario, int $roleId): bool {
        $rolesArray = $usuario->getRoles();
        foreach ($rolesArray as $rol) {
            if ($rol->getId() === $roleId) {
                return true;
            }
        }

        return false;
    }

    public function isUserInRoleName(Usuario $usuario, string $roleName): bool {
        $rolesArray = $usuario->getRoles();
        foreach ($rolesArray as $rol) {
            if ($rol->getName() === $roleName) {
                return true;
            }
        }

        return false;
    }

    public function register($email, $pwd1, $pwd2) {
        $usuario = null;
        $error = "";
        $exito = false;

        if ($pwd1 !== $pwd2) {
            $error = "Las contraseñas no coinciden";
        } else {
            $usuario = $this->userRepository->getUsuarioByEmail($email);
            if ($usuario != null) {
                $error = "El email ya está en uso";
            } else {

                try {
                    $pwd_hash = password_hash($pwd1, PASSWORD_BCRYPT);

                    $usuario = new Usuario();
                    $usuario->setEmail($email);
                    $usuario->setPwdhash($pwd_hash);

                    $this->userRepository->beginTransaction();

                    $usuario = $this->userRepository->create($usuario);
                    $exito = ($usuario != null);

                    $rol = $this->rolRepository->findRolByName(USER_ROLE);

                    $exito = $exito && ($rol != null );

                    if ($rol != null) {
                        $exito = $exito && $this->userRepository->addRoleToUser($usuario->getId(), $rol->getId());
                    }
                    if ($exito) {
                        $this->userRepository->commit();
                    } else {
                        $this->userRepository->rollback();
                        $error = "No ha sido posible registrar al usuario";
                    }
                } catch (Exception $ex) {
                    echo "Ha habido una exception: " . $ex->getMessage();
                    $this->userRepository->rollback();
                    $error = "Ha habido algún problema. No ha sido posible registrar al usuario";
                }
            }
        }

        if (($error !== "") || ($usuario == null)) {
            $usuario = new Usuario();
            $usuario->setStatus(Util::OPERATION_NOK);
            $usuario->addError($error);
        } else {
            $usuario->setStatus(Util::OPERATION_OK);
        }



        return $usuario;
    }

    //Crea un array con solo email y roles CSV
    public function filterUsersList($users): array {
        $filtrados = array();
        foreach ($users as $user) {
            $filtrado["userId"] = $user->getId();
            $filtrado["email"] = $user->getEmail();
            $filtrado["roles"] = $user->getRoleNamesCSV();
            array_push($filtrados, $filtrado);
        }
        return $filtrados;
    }

    public function delete(int $userId): bool {
        $exito = true;
        if ($userId == $_SESSION["userId"]) {
            $exito = false;
        } else {
            try {
                $this->userRepository->beginTransaction();
                $exito = $this->userRepository->deleteRolesByUserId($userId);
                $exito = $exito && $this->userRepository->delete($userId);
                if ($exito) {
                    $this->userRepository->commit();
                } else {
                    $this->userRepository->rollback();
                }
            } catch (Exception $ex) {
                $this->userRepository->rollback();
            }
        }
        return $exito;
    }

}

?>