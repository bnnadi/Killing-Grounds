<?php
include "controllers/home.php";

 if (empty ($_GET["controller"])) {
	$con = 'home';
}else{
	$con = $_GET["controller"];
}

if ($con == "home") {
	$homeInstance = new Home();
	$homeInstance->get($_GET);
} else {

}
?>