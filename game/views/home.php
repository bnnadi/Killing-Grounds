<?php
	include "controllers/SignIn.php";
	include "controllers/SignUp.php";
	
	
?>
<!DOCTYPE html>
<html>
<head>
    <title>Killing Grounds</title>
    <link href='http://fonts.googleapis.com/css?family=Amatic+SC:700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css"  href="css/main.css">
</head>
<body>
    <h1 class="home-head">Killing Grounds</h1>
    <form method="post" enctype="multipart/form-data" action="#">
        <label>Login with you username and password</label><br>
		<p id="loginInfo"></p>
        <input class="hidden" type="text" name="email" placeholder="your email"><br>
        <input type="text" name="username" placeholder="username"><br class="hidden">
        <input type="password" name="password" placeholder="password"><br>
        <input class="hidden" type="password" name="confirm" placeholder="confirm password"><br>
        <a id="register">Not a user? Register here...</a><input id="submit" type="submit" title="Submit">
    </form>

    <footer><a id="leaderboards">Leaderboards</a></footer>

    <script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
    <script>
        jQuery(function($){
             $("#register").on('click',function(e){
                e.preventDefault();
                 console.log("New player");
                console.log($(this).siblings('.hidden'));
                 $(this).siblings('.hidden').toggle();
            });
        });
    </script>
</body>
</html>
  
