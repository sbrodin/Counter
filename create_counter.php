<?php
if (isset($_POST['name']) && !empty($_POST['name'])) {
    $name = $_POST['name'];
} else {
    $return = array(
        'status' => 'error',
        'message' => 'Problème de paramètre',
    );
    echo json_encode($return);
    exit;
}
require 'database_connect.php';

// Création du compteur
$query = 'INSERT INTO counter ';
$query.= '(user_id, counter_name, counter_color, counter_value) ';
$query.= 'VALUES ';
$query.= '((SELECT user.user_id ';
$query.= 'FROM user ';
$query.= 'WHERE user.user_name = ?), ?, ?, ?) ';

$stmt = $mysqli->prepare($query);
$counters = array();
if (!$stmt) {
    require 'database_disconnect.php';
    $return = array(
        'status' => 'error',
        'message' => 'Problème de paramètre',
    );
    echo json_encode($return);
    exit;
} else {
    // $name est de la forme '/counter/user/name/'
    $name = explode('/', $name);
    $name_length = count($name);
    $name = $name[$name_length - 2];

    $default_counter_name = 'nouveau compteur';
    $default_counter_color = 'ffffff';
    $default_counter_value = 0;

    $stmt->bind_param(
        'sssd',
        $name,
        $default_counter_name,
        $default_counter_color,
        $default_counter_value
    );
    $stmt->execute();
    // Si le compteur a bien été mis à jour
    if ($mysqli->affected_rows == 1) {
        $return['status'] = 'success';
        $return[] = array(
            'counter_id' => $mysqli->insert_id,
            'counter_name' => $default_counter_name,
            'counter_color' => $default_counter_color,
            'counter_value' => $default_counter_value,
        );
    } else {
        $return = array(
            'status' => 'error',
            'message' => 'Problème d\'authentification',
        );
    }
    $stmt->close();
    require 'database_disconnect.php';
    echo json_encode($return);
    exit;
}