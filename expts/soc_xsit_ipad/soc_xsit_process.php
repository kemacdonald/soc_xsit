<?php
	//$result_string = $_POST['postresult_string'];
	$result_string = $_POST['expHTML'];

	$time = date("Y-m-d-H-i");

	file_put_contents('soc_xsit_results_' . $time . '.txt', $result_string, FILE_APPEND);
?>