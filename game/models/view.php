<?php
	class View {
		
		function printHeader(){
			header('Content-type: text/html');
		}
		
		function getView($file = '', $data = '') {
				
			$fullPath = "/Users/bisikennadi/Desktop/NodeJSGroupProject/game/views/$file.html";
			
			if (preg_match("/\w/", $file) && file_exists($fullPath)) {
				
				include($fullPath);
			}
		}
	}
?>