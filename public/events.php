<?php
    $conn = new mysqli('localhost','root','','test');
    $listofEvents=array();
    if($conn->connect_error){
		echo "$conn->connect_error";
		die("Connection Failed : ". $conn->connect_error);
	} else{
        function getEvents($date){
            $conn = new mysqli('localhost','root','','test');
            $sqlquery=`SELECT * FROM quiz_calender WHERE date = {$date}`;
            $result=$conn->query($sqlquery);
            if($result->num_rows>0){
                $row = mysqli_fetch_assoc($result);
                $events=json_decode($row['events']);
                for ($i = 0; $i < count($events); $i++) {
                    $eventQuery=`SELECT * FROM events WHERE id = {$events[$i]}`;
                    $eventResult=$conn->query($eventQuery);
                    if($eventResult->num_rows>=1){
                        $eventRow=mysqli_fetch_assoc($eventResult);
                        array_push($listofEvents,$eventRow);
                    }
                }
                
            }
        }
        $dateToday=date('Y-m-d');
        $i=intval(substr($dateToday,-2));
        $currMonth=intval(date('m'));
        $currYear=intval(date('Y'));
        for($loop=0;$loop<30;$loop++){
            $date=`{$currYear}-{$currMonth}-{$i}`;
            getEvents($date);
        }
        echo json_encode($listofEvents);
	}
?>