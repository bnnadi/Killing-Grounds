<?php

class FormValidator {

function validate($array) {
	$fullName = $array["username"];
	$email = $array["email"];
	$password = $array["password"];
	$confirmPassword = $array["confirm"];

	if (empty($fullName) || empty($email) || empty($password) || empty($confirmPassword)) {
		return "Please fill all the fields correctly.";
	}

	if (preg_match("/\d+[a-z]+@\w+\.\w+/", $email) === false) {
		return "Email is not valid.";
	}

	if (strlen($password) < 8) {
                return "Password must be at least 8 characters long.";
        }

	if ($password != $confirmPassword) {
		return "Passwords do not match.";
	}

	return "valid";
}

}

?>
