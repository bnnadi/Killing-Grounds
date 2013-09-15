<?php 
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"/>
        <link href='http://fonts.googleapis.com/css?family=Amatic+SC:700' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" type="text/css" href="css/main.css">
		<title>Killing Grounds</title>
	</head>

    <body>
    <nav>
        <h2>Killing Grounds</h2>
        <a href="/" id="logout">Logout</a>
    </nav>
        <canvas id="stage"></canvas>

        <div id="instructions">
            <h3>Instructions</h3>
            <ul>
                <li>Control player with 'WAD'.</li>
                <li>Shoot players with 'SPACE'.</li>
                <li>Try to kill as many enemies as you can.</li>
                <li>Good Luck!</li>
            </ul>
        </div>

        <div id="pop-up" style="display:none; background-color: #aaa; width:200px;height:200px;position:absolute;background-color:#eeeeee;width:300px;height:300px;z-index: 9002;">
            <h3>Good Game!</h3>
            <p>Would you like to publish your name and score to the leaderboards?</p>
            <input action="leaderboards" type="submit" value="Yes"><input action="home" type="submit" value="No">
        </div>

        <script type="text/javascript" src="js/game.js"></script>
    </body>
</html>




