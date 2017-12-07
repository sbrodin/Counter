<?php
if (isset($_POST['name']) && !empty($_POST['name'])) {
    $name = $_POST['name'];
} else {
    die ('Problème de paramètre');
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
    echo 'Echec lors de la preparation de la requete';
} else {
    // $name est de la forme '/counter/user/name/'
    $name = explode('/', $name);
    $name_length = count($name);
    $name = $name[$name_length - 2];

    $stmt->bind_param('s', $name);
    $stmt->execute();
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        $counters[] = $row;
    }
    $stmt->close();
}
require 'database_disconnect.php';

echo json_encode($counters);