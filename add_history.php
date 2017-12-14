<?php
function add_history($counter_id = null, $changed_variable, $changed_to = null) {
    global $mysqli;
    if (!isset($counter_id)) {
        exit;
    } else {
        $counter_value = 0;
        if ($changed_variable === 'value') {
            $query = 'SELECT counter_value ';
            $query.= 'FROM counter ';
            $query.= 'WHERE counter_id = ? ';
            $query.= 'LIMIT 1 ';

            $stmt = $mysqli->prepare($query);
            if (!$stmt) {
                $return = array(
                    'status' => 'error',
                    'message' => 'Echec lors de la préparation de la requête',
                );
                echo json_encode($return);
                exit;
            } else {
                $stmt->bind_param(
                    'd',
                    $counter_id
                );
                $stmt->execute();
                $stmt->bind_result(
                    $value
                );
                while ($stmt->fetch()) {
                    $counter_value = $value;
                }
                $stmt->close();
            }
        }
        $query = 'INSERT INTO counterhistory ';
        $query.= '(counterhistory_counterid, counterhistory_date, counterhistory_changedvariable, counterhistory_to) ';
        $query.= 'VALUES ';
        $query.= '(?, ?, ?, ?) ';

        $stmt = $mysqli->prepare($query);
        if (!$stmt) {
            $return = array(
                'status' => 'error',
                'message' => 'Echec lors de la préparation de la requête',
            );
            echo json_encode($return);
            exit;
        } else {
            if ($changed_variable === 'value') {
                $changed_to = $counter_value;
            }
            $date = date('Y-m-d H:i:s');
            $stmt->bind_param(
                'dsss',
                $counter_id,
                $date,
                $changed_variable,
                $changed_to
            );
            $stmt->execute();
            // Si l'historique a bien été créé
            // if ($mysqli->affected_rows == 1) {
            //     $counter_id = $mysqli->insert_id;
            //     // On ajoute à l'historique
            //     require 'add_history.php';
            //     add_history($counter_id, 'counter', null, null);
            //     $return['status'] = 'success';
            //     $return[] = array(
            //         'counter_id' => $counter_id,
            //         'counter_name' => $default_counter_name,
            //         'counter_color' => $default_counter_color,
            //         'counter_value' => $default_counter_value,
            //     );
            // } else {
            //     $return = array(
            //         'status' => 'error',
            //         'message' => 'Problème d\'authentification',
            //     );
            // }
            $stmt->close();
            // echo json_encode($return);
        }
    }
}