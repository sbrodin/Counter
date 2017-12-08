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

$query = 'SELECT counter_id, counter_name, counter_color, counter_value ';
$query.= 'FROM counter ';
$query.= 'WHERE counter.user_id = ';
$query.= '(SELECT user.user_id ';
$query.= 'FROM user ';
$query.= 'WHERE user.user_name = ?)';

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

    $stmt->bind_param('s', $name);
    $stmt->execute();
    if ($result = $stmt->get_result()) {
        $counters['status'] = 'success';
    }
    while ($row = $result->fetch_assoc()) {
        $counters[] = $row;
    }
    $stmt->close();
}
require 'database_disconnect.php';

echo json_encode($counters);