<?php
$gene = $_POST['gene'];
file_put_contents("/saved.txt", $gene);
?>