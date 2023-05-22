<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title id="headTitle">Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="../css/estilos.css">
</head>

<body>

    <section class="container-fluid" id="spa">
        <header class="mb-5">
            <div class="p-5 text-center bg-light" style="margin-top: 58px;">
                <h1 class="mb-3" id="pageTitle">Login</h1>
            </div>

            <div class="d-flex  justify-content-end  align-items-center d-none" id="userHeader">
                <div class="d-flex mx-2 align-items-center justify-content-end">
                    <p class="lead">¡Hola <span class='d-none' id='email_header'></span>!</p>
                </div>

                <form method="post" class="d-flex mx-2 align-items-center justify-content-start" id="formLogout">
                    <input type="submit" class="btn btn-primary btn-block" value="Cerrar sesión" name="btnCerrar" id="btnCerrar"></button>
                </form>
            </div>
        </header>

        <!--  message div -->
        <div class="row d-flex justify-content-center">

            <div class="col-6  mb-4 alert alert-danger invisible" id="divMsg" role="alert">
            </div>
        </div>


        <section id="login" class="row justify-content-center">

            <div class="row justify-content-center">
                <div class="col-sm-12 col-md-6">
                    <form method="post" id="formLogin">
                        <!-- Email input -->
                        <div class="form-group mb-4 ">
                            <label class="form-label" for="email">Email address</label>
                            <input type="email" id="email" class="form-control" name="email" required />

                        </div>

                        <!-- Current Password input -->
                        <div class="form-group mb-4">
                            <label class="form-label" for="pwd">Contraseña actual</label>
                            <input type="password" id="pwd" class="form-control" name="pwd" required />

                        </div>

                        <div class="form-group mb-4">
                            <label class="form-label" for="rol">Seleccione el rol:</label>

                            <select name="rol" id="rol" required>

                            </select>
                        </div>


                        <!-- Submit button -->
                        <input type="submit" class="btn btn-primary btn-block mb-4" value="Iniciar sesión">
                        <a href="#formRegister" class="btn btn-secondary btn-block mb-4" id='registerLink'>Regístrese aquí</a>

                    </form>

                </div>
            </div>
        </section>


        <section id="registerSection" class="d-none">
            <div class="container h-100" id="registerContent">
                <div class=" row d-flex justify-content-center align-items-center h-100">
                    <div class="col-lg-12 col-xl-11">
                        <div class="card text-black" style="border-radius: 25px;">
                            <div class="card-body p-md-5">
                                <div class="row justify-content-center">
                                    <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                                        <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4"></p>

                                        <form class="mx-1 mx-md-4" method="post" id="formRegister">



                                            <div class="d-flex flex-row align-items-center mb-4">
                                                <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                                <div class="form-outline flex-fill mb-0">
                                                    <input type="email" id="emailRegister" class="form-control" name="emailRegister" required />
                                                    <label class="form-label" for="emailRegister">Email</label>
                                                    <span id="emailFeedback" class="unavailable d-none"></span>
                                                </div>
                                            </div>

                                            <div class="d-flex flex-row align-items-center mb-4">
                                                <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                                <div class="form-outline flex-fill mb-0">
                                                    <input type="password" id="pwd1Register" class="form-control" name="pwd1Register" required minlength="6"/>
                                                    <label class="form-label" for="pwd1Register">Contraseña</label>
                                                </div>
                                            </div>

                                            <div class="d-flex flex-row align-items-center mb-4">
                                                <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                                                <div class="form-outline flex-fill mb-0">
                                                    <input type="password" id="pwd2Register" class="form-control" name="pwd2Register" required minlength="6"/>

                                                    <label class="form-label" for="pwd2Register">Repita su contraseña</label>
                                                    <span class="error" aria-live="polite"></span>
                                                </div>
                                            </div>




                                            <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                                <input type="submit" class="btn btn-primary btn-lg" value="Registrar usuario" />
                                                <a href="#login" class="btn btn-secondary btn-lg mx-2" id='loginLink'>Login</a>

                                            </div>

                                        </form>

                                    </div>
                                    <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                                        <img src="../files/no-picture.jpg" class="img-fluid" alt="Sample image">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- d-none => display:none  https://getbootstrap.com/docs/5.3/utilities/display/ -->
        <main id="main" class="d-none">
            <!-- Aquí la vista particular -->
            <h2>Esto es el main</h2>

            <!-- Añadimos esta section para que permanezca el h2 anterior -->
            <section id='mainContent'>

            </section>


        </main>


        <!-- Modal -->
        <div class="modal fade" id="spa_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal_title">Modal title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id='modal_msg'>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" id='opt_cancel'>Cancelar</button>
                        <button type="button" class="btn btn-primary" id='opt_ok'>Aceptar</button>
                    </div>
                </div>
            </div>
        </div>

    </section>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <script src="../js/global.js" type="text/javascript"></script>
    <script src="../js/cargarDatos.js" type="text/javascript"></script>
    <script src="../js/manejarSesion.js" type="text/javascript"></script>
    <script src="../js/registerValidation.js" type="text/javascript"></script>



    </script>
</body>

</html>