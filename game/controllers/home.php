<?php
 require_once('models/view.php');
 
 class Home {
 	function get($pairs,$data = '') {
 		$view_model = new View();
		
 		if (empty($pairs[action])) {
			 $action= 'home';
			$view_model->getView($action);
		}else {
			include "controllers/LogOut.php";
			 $action = $pairs['game'];
			 $view_model->getView($action);
		 }

	}
 }
?>