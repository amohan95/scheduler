<?php
require_once('../lib/functions.php');

if (isset($_GET['dept']) && isset($_GET['semester'])) {
	$dept = $_GET['dept'];
	$semester = $_GET['semester'];
	echo json_encode(get_all_courses($dept, $semester));
}
?>