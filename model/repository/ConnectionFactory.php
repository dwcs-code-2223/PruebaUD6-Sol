<?php

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Scripting/PHPClass.php to edit this template
 */

/**
 * Description of ConnectionFactory
 *
 * @author wadmin
 */
class ConnectionFactory {

    private static ?PDO $connection = null;
    private static $ruta_fichero;

    private function __construct() {
        
    }

    private function __clone() {
        
    }

    public static function getConnection() {

        if (is_null(self::$connection)) {
            self::$ruta_fichero = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . DATABASE_INI_FILE;
           
            if (!$settings = parse_ini_file(self::$ruta_fichero, TRUE)) {
                throw new Exception('Unable to open ' . self::$ruta_fichero . '.');
            }



            $dns = $settings['database']['driver'] .
                    ':host=' . $settings['database']['host'] .
                    ((!empty($settings['database']['port'])) ? (';port=' . $settings['database']['port']) : '') .
                    ';dbname=' . $settings['database']['schema'];

            self::$connection = new PDO($dns,
                    $settings['database']['username'] ,
                    $settings['database']['password'],
                    array(PDO::ATTR_PERSISTENT => $settings['database']['persistent'])                    
                 
                    
            );
        }
        return self::$connection;
    }

}
