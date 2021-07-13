<?php 
$servername = "localhost";
$username = "ardaweb";
$password = "Papatya*32";
$db = "arda";

$conn = new mysqli($servername, $username, $password, $db);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
// echo "Connected successfully";
function getip() {
if (validip($_SERVER["HTTP_CLIENT_IP"])) {
    return $_SERVER["HTTP_CLIENT_IP"];
}

foreach (explode(",", $_SERVER["HTTP_X_FORWARDED_FOR"]) as $ip) {
    if (validip(trim($ip))) {
        return $ip;
    }
}

if (validip($_SERVER["HTTP_PC_REMOTE_ADDR"])) {
    return $_SERVER["HTTP_PC_REMOTE_ADDR"];
} elseif (validip($_SERVER["HTTP_X_FORWARDED"])) {
    return $_SERVER["HTTP_X_FORWARDED"];
} elseif (validip($_SERVER["HTTP_FORWARDED_FOR"])) {
    return $_SERVER["HTTP_FORWARDED_FOR"];
} elseif (validip($_SERVER["HTTP_FORWARDED"])) {
    return $_SERVER["HTTP_FORWARDED"];
} else {
    return $_SERVER["REMOTE_ADDR"];
}
}

function validip($ip) {
if (!empty($ip) && ip2long($ip) != -1) {
    $reserved_ips = array(
        array('0.0.0.0', '2.255.255.255'),
        array('10.0.0.0', '10.255.255.255'),
        array('127.0.0.0', '127.255.255.255'),
        array('169.254.0.0', '169.254.255.255'),
        array('172.16.0.0', '172.31.255.255'),
        array('192.0.2.0', '192.0.2.255'),
        array('192.168.0.0', '192.168.255.255'),
        array('255.255.255.0', '255.255.255.255')
    );

    foreach ($reserved_ips as $r) {
        $min = ip2long($r[0]);
        $max = ip2long($r[1]);
        if ((ip2long($ip) >= $min) && (ip2long($ip) <= $max)) return false;
    }

    return true;
} else {
    return false;
}
}
$ip = getip();
$longip = ip2long($ip);
// echo $ip;


$sql = "INSERT INTO ips VALUES (". $longip. ")";
if ($conn->query($sql) === TRUE) {
    // echo "New record created successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

$sql = "SELECT DISTINCT * FROM ips";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  while($row = $result->fetch_assoc()) {
    // echo long2ip($row["ip"]). "<br>";
    echo "https://ipinfo.io/".long2ip($row["ip"])."/json";
    $details = json_decode(file_get_contents("https://ipinfo.io/".long2ip($row["ip"])."/json"));// . "<br>";
  }
} else {
  echo "0 results";
}
$conn->close();

// $query = sprintf("INSERT INTO table ips VALUES (%s)", $longip);
// query($query, $link) or die("Error inserting record: " . mysqli_error($conn));

// if (mysqli_affected_rows() != 1) {
// echo "nothing was inserted";
// } else {
// echo "1 row was inserted";
// }
// $res = query("SELECT * FROM table ORDER BY ips DESC")
// or die("Error selecting records" . mysqli_error());

// while ($row = mysqli_fetch_assoc($res)) {
// $ip = long2ip($row['ipaddr']);
// echo "IP: $ip<br />";
// }
?>