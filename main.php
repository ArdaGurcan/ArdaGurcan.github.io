<!-- <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> -->
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


$sql = "INSERT INTO ips VALUES (". $longip. ",'". date('Y-m-d H:i:s',time()) . "')";
// echo $sql;
if ($conn->query($sql) === TRUE) {
    // echo "New record created successfully";
  } else {
    // echo "Error: " . $sql . "<br>" . $conn->error;
  }

$sql = "SELECT DISTINCT * FROM ips order by time desc";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  echo '<table class="table-bordered table table-striped"><thead><tr><th scope="col">IP</th><th scope="col">CITY</th><th scope="col">REGION</th><th scope="col">COUNTRY</th><th scope="col">LOCATION</th></tr></thead>';
  while($row = $result->fetch_assoc()) {
    // echo long2ip($row["ip"]). "<br>";
    $details = json_decode(file_get_contents("https://ipinfo.io/".long2ip($row["ip"])."/json"));// . "<br>";
    echo "<tr>";
    echo "<td>$details->ip</td>";
    echo "<td>$details->city</td>";
    echo "<td>$details->region</td>";
    echo "<td>$details->country</td>";
    echo "<td>$details->loc</td>";
    echo "</tr>";
    
    
  }
  echo "</table>";
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