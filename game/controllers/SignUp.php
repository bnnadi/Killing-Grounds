<?php
 require_once('models/view.php');
 
 class SignUp {
 	function get($pairs,$data = '') {
 		$view_model = new View();
        $view_model->getView("home");
        
        if (empty($_POST)) {
            echo "<p id='loginInfo'>FILL ALL THE FIELDS</p>";
        } else {
            include_once('validators/formvalidator.php');

            $formFields = array(
                'username' => $_POST['username'],
                'email' => $_POST['email'],
                'password' => $_POST['password'],
                'confirm_password' => $_POST['confirm']
            );

            $validator = new FormValidator();
            $message = $validator->validate($formFields);
            
            if ($message == "valid") {
                include_once('database/createSql.php');

                $user = $formFields['username'];
                $email = $formFields['email'];
                $pass = $formFields['password'];

                $create = new CreateSQL();
                $create->create($user, $email, $pass);
                header('Location: index.php');
            } else {
                echo $message;
            }   
        }

	}
 }

?>