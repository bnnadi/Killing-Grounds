<!--<?php
    include "controllers/connection.php";
?>-->
<!DOCTYPE html>
<html>
<head>
    <title>Killing Grounds</title>
    <link href='http://fonts.googleapis.com/css?family=Amatic+SC:700' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" type="text/css"  href="../css/main.css">
</head>
<body>
    <h1 class="leader-head">Killing Grounds Leaders</h1>
    
    <div class="leaderboard">
    	<ol>
	    <?php
	    	$leaderQuery = "SELECT * from leaderboards order by score desc limit 10;";
	    	$leaderResult = mysql_query($userQuery);

	    	foreach ($leaderResult as $player) {
	    		echo "<li><p>".$player=>name."</p><p>".$player=>score."</p></li>";
	    	}
	   	?>
    	</ol>
    </div>

    <footer><a action="home">Home</a></footer>

</body>
</html>
  
