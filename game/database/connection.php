<?php

$dbhost = ':/Applications/MAMP/tmp/mysql/mysql.sock';
$dbuser = 'root';
$dbpass = 'root';
$db = 'mysql_tut';

$conn = mysql_connect($dbhost, $dbuser, $dbpass);
mysql_select_db($db);

?>