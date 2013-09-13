<?php
    
    include("database/connection.php");

    $user = $_POST['username'];
    $pass = md5($_POST['password']);

    $userQuery = "SELECT * FROM Players WHERE username = '$user' LIMIT 1;";
    $userResult = mysql_query($userQuery);

    $userResult = mysql_fetch_array($userResult);
    $userID = $userResult['userID'];
    $userPass = $userResult['password'];

    $saltQuery = "SELECT * FROM Salt WHERE userID = '$userID' LIMIT 1;";
    $saltResult = mysql_query($saltQuery);
    
    $saltResult = mysql_fetch_array($saltResult);
    $salt = $saltResult['salt'];
    
    if (md5($salt.$pass) == $userPass) {
        $_SESSION['loggedin'] = 'true';
        $_SESSION['username'] = $user;
        $_SESSION['userid'] = $userID;
//        header('Location: home');
    } else {
        echo "<p>Username or Password do not match.</p>";
    }

?>