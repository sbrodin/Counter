<?php
if (!empty($_POST)) {
    if (!empty($_POST['user_name']) &&
        !empty($_POST['password'])) {
        $user_name = $_POST['user_name'];
        $password = $_POST['password'];
        if (!empty($_POST['displayed_name'])) {
            $displayed_name = $_POST['displayed_name'];
        } else {
            $displayed_name = ucfirst($user_name);
        }

        // Création du répertoire
        mkdir('../user/' . $user_name, 0777);
        if (!is_dir('../user/' . $user_name)) {
            echo '<pre>';
            var_dump(error_get_last());
            echo '</pre>';
            $return = array(
                'status' => 'error',
                'message' => 'Répertoire non créé : ' . error_get_last(),
            );
            echo json_encode($return);
            exit;
        }
        $old_mask = umask(0);
        chmod('../user/' . $user_name, 0777);
        umask($old_mask);

        // Création du .htaccess
        $htaccess_content = "AuthName \"Page d'administration protégée, veuillez vous identifier\"\n";
        $htaccess_content.= "AuthType Basic\n";
        $htaccess_content.= 'AuthUserFile "/var/www/html/dev/counter/user/' . $user_name . "/.htpasswd\"\n";
        $htaccess_content.= 'Require valid-user';
        file_put_contents('../user/' . $user_name . '/.htaccess', $htaccess_content);

        // Création du .htpasswd
        // Encrypt password
        $password = crypt($password, base64_encode($password));
        // Print encrypted password
        $htpasswd_content = $user_name . ':' . $password;
        file_put_contents('../user/' . $user_name . '/.htpasswd', $htpasswd_content);

        // Création du fichier index.html
        $index_content = file_get_contents('../user/template/index.html');
        $index_content = str_replace('%%Template%%', $displayed_name, $index_content);
        file_put_contents('../user/' . $user_name . '/index.html', $index_content);

        // Création de l'utilisateur en base
        require '../database_connect.php';

        // Création du compteur
        $query = 'INSERT INTO user ';
        $query.= '(user_name) ';
        $query.= 'VALUES ';
        $query.= '(?) ';

        $stmt = $mysqli->prepare($query);
        $counters = array();
        if (!$stmt) {
            require '../database_disconnect.php';
            $return = array(
                'status' => 'error',
                'message' => 'Problème de paramètre',
            );
            echo json_encode($return);
            exit;
        } else {
            $stmt->bind_param(
                's',
                $user_name
            );
            $stmt->execute();
            // Si l'utilisateur a bien été créé'
            if ($mysqli->affected_rows == 1) {
                $return['status'] = 'success';
                $return[] = array(
                    'user_id' => $mysqli->insert_id,
                    'user_name' => $user_name,
                );
            } else {
                $return = array(
                    'status' => 'error',
                    'message' => 'Problème d\'authentification',
                );
            }
            $stmt->close();
            require '../database_disconnect.php';
            echo json_encode($return);
            exit;
        }
    }
} else {
    ?>
    <!doctype html>

    <html lang="fr">
        <head>
            <meta charset="utf-8">
            <title>Counter - Création d'utilisateur</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta name="description" content="Counter">
            <meta name="author" content="Stanislas Brodin">
            <link href="../style.css" media="screen" rel="stylesheet" type="text/css">
        </head>
        <body>
            <div>Création d'utilisateur</div>
            <div><a id="logout" href="">Déconnexion</a></div>
            <form method="POST">
                <div>
                    <label for="user_name">Nom d'utilisateur : </label>
                    <input type="text" id="user_name" name="user_name" required autofocus>
                </div>
                <div>
                    <label for="password">Mot de passe : </label>
                    <input type="text" id="password" name="password" required>
                </div>
                <div>
                    <label for="displayed_name">Nom affiché pour le répertoire : </label>
                    <input type="text" id="displayed_name" name="displayed_name">
                </div>
                <div>
                    <input type="submit" name="submit" value="Valider">
                </div>
            </form>
            <script type="text/javascript" src="../script.js"></script>
        </body>
    </html>

    <?php
}