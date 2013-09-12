<?php
	class Connect {
		private $db;
		
		function __construct(){
			$host = "127.0.0.1";
			$user = "root";
			$pass = "root";
			$port= "8889";
			$dbname = "KillGrounds";
			$this->db = new PDO("mysql:host = $host",
													"port=$port",
													"dbname=$dbname",
													$user,$pass);
		}
		
		public function addPlayer(){
			$stmnt = $this->db->prepare("insert into players (username, email, password) values (:username, :email, :password)");
			$stmnt->execute(array(
					':username' => $username,
					':email' => $email,
					':password' =>$password)
	
		}
		
		function __destruct(){
			mysqli_close($db);
		}
	}
?>