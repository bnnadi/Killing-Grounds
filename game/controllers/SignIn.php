<?php
 require_once('models/view.php');
 
 class SignIn {
 	function get($pairs,$data = '') {
        
        if ($_SESSION['loggedin']) {
//            echo "<h2 class='cta'>" . $_SESSION['username'] . " has logged in.</h2>";
            $username = $_SESSION["username"];
        }
        else if (!empty($_POST)) {
            include_once("database/login.php");
            header('Location: index.php');
        } else {
            $username = "guest";
        }
        
 		$view_model = new View();
        $view_model->getView("home");
	}
 }

?>