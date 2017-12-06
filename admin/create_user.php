<?php
$dir_name = 'test';

// Création du répertoire
mkdir('../user/' . $dir_name);

// Création du .htaccess
$htaccess_content = "AuthName \"Page d'administration protégée, veuillez vous identifier\"\n";
$htaccess_content.= "AuthType Basic\n";
$htaccess_content.= 'AuthUserFile "/var/www/html/dev/counter/' . $dir_name . "/.htpasswd\"\n";
$htaccess_content.= 'Require valid-user';
file_put_contents('../user/' . $dir_name . '/.htaccess', $htaccess_content);

// Création du .htpasswd
// Password to be encrypted for a .htpasswd file
$clearTextPassword = 'counter_admin_password';
// Encrypt password
$password = crypt($clearTextPassword, base64_encode($clearTextPassword));
// Print encrypted password
$htpasswd_content = $dir_name . ':' . $password;
file_put_contents('../user/' . $dir_name . '/.htpasswd', $htpasswd_content);
