<?php

class CreateSQL {

    function create($username, $email, $password) {
        include("database/connection.php");
        
        $salt = md5("abcd");
        $pass = md5($password);
        $pass = md5($salt.$pass);
    
        mysql_query("INSERT INTO Players (username, email, password)
                     VALUES ('$username', '$email', '$pass');");
        
        $lastid = mysql_insert_id();
        
        mysql_query("INSERT INTO Salt (userID, salt)
                     VALUES ('$lastid', '$salt')");
    }
    
}

?>