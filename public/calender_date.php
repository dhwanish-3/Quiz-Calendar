<?php
    $data = $_GET['data'];
    $conn = new mysqli('localhost', 'root', '', 'test');
    $listofDates = array();

    if ($conn->connect_error) {
        die("Connection Failed: " . $conn->connect_error);
    } else {
        function fetchDate($date) {
            global $conn, $listofDates;
            $sqlquery = "SELECT * FROM quiz_calender WHERE date = '{$date}'";
            $result = $conn->query($sqlquery);
            if ($result->num_rows > 0) {
                $row = mysqli_fetch_assoc($result);
                array_push($listofDates, $row);
            }
        }

        $dateToday = date('Y-m-d');
        $i = intval(substr($dateToday, -2));
        $currMonth = intval(date('m'));
        $currYear = intval(date('Y'));

        for ($loop = 0; $loop < 30; $loop++) {
            $date = "{$currYear}-{$currMonth}-{$i}";
            fetchDate($date);
            $i++;
        }

        header('Content-Type: application/json');
        echo json_encode($listofDates);
    }
?>
