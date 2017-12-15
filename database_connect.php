<?php
require 'connexion_data.php';
$mysqli = new mysqli($host, $username, $password, $database);
if ($mysqli->connect_error) {
    var_dump(mysqli_connect_error());
}
$mysqli->set_charset('utf8mb4');