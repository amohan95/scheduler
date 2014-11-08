<?php
require_once('../lib/functions.php');

if (isset($_GET['semester'])) {
	$semester = $_GET['semester'];
	echo json_encode(get_all_departments($semester));
}
?>
