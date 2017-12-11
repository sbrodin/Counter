<?php
if (!empty($_POST['name']) &&
    !empty($_POST['counter_id'])) {
    $name = $_POST['name'];
    $counter_id = intval($_POST['counter_id']);
} else {
    $return = array(
        'status' => 'error',
        'message' => 'Problème de paramètre',
    );
    echo json_encode($return);
    exit;
}
require 'database_connect.php';

// Mise à jour du compteur avec vérification de l'appartenance du compteur à l'utilisateur
$query = 'UPDATE counter ';
if (isset($_POST['direction'])) {
    if ($_POST['direction'] == '+') {
        $query.= 'SET counter_value = counter_value+1 ';
    } else if ($_POST['direction'] == '-'){
        $query.= 'SET counter_value = counter_value-1 ';
    }
}
if (!empty($_POST['new_name']) &&
    !empty($_POST['new_color'])) {
    $query.= 'SET counter_name = ?, ';
    $query.= 'counter_color = ? ';
}
if (isset($_POST['delete'])) {
    $query.= 'SET active = 0 ';
}
$query.= 'WHERE counter_id = ? ';
$query.= 'AND counter.user_id = ';
$query.= '(SELECT user.user_id ';
$query.= 'FROM user ';
$query.= 'WHERE user.user_name = ?) ';
$query.= 'LIMIT 1';

$stmt = $mysqli->prepare($query);
$counters = array();
if (!$stmt) {
    require 'database_disconnect.php';
    $return = array(
        'status' => 'error',
        'message' => 'Echec lors de la préparation de la requête',
    );
    echo json_encode($return);
    exit;
} else {
    // $name est de la forme '/counter/user/name/'
    $name = explode('/', $name);
    $name_length = count($name);
    $name = $name[$name_length - 2];

    if (!empty($_POST['new_name']) &&
        !empty($_POST['new_color'])) {
        $new_name = $_POST['new_name'];
        $new_color = substr($_POST['new_color'], 1);
        $stmt->bind_param('ssds', $new_name, $new_color, $counter_id, $name);
    } else {
        $stmt->bind_param('ds', $counter_id, $name);
    }
    $stmt->execute();
    // Si le compteur a bien été mis à jour
    if ($mysqli->affected_rows == 1) {
        $return = array(
            'status' => 'success',
            'counter_id' => $counter_id,
        );
        if (isset($_POST['direction'])) {
            if ($_POST['direction'] == '+') {
                $return['direction'] = '+';
            } else if ($_POST['direction'] == '-'){
                $return['direction'] = '-';
            }
        }
        if (!empty($_POST['new_name']) &&
            !empty($_POST['new_color'])) {
            $return['new_name'] = $_POST['new_name'];
            $return['new_color'] = $_POST['new_color'];
        }
        if (isset($_POST['delete'])) {
            $return['delete'] = true;
        }
    } else {
        // Si on a juste confirmé l'édition, sans rien modifier
        if (!empty($_POST['new_name']) &&
            !empty($_POST['new_color'])) {
            $return = array(
                'status' => 'success',
                'counter_id' => $counter_id,
                'new_name' => $_POST['new_name'],
                'new_color' => $_POST['new_color'],
            );
        } else {
            $return = array(
                'status' => 'error',
                'message' => 'Problème d\'authentification',
            );
        }
    }
    $stmt->close();
    require 'database_disconnect.php';
    echo json_encode($return);
    exit;
}