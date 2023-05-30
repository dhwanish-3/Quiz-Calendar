<?php
$conn = new mysqli('localhost','root','','test');
$listofEvents=array();
$listofDates = array();
if($conn->connect_error){
    echo "$conn->connect_error";
    die("Connection Failed : ". $conn->connect_error);
}else{
    function getEvents($date){
        global $listofEvents,$listofDates,$conn;
        $sqlquery="SELECT * FROM quiz_calender WHERE date = '{$date}'";
        $result=$conn->query($sqlquery);
        if($result->num_rows>0){
            $row = mysqli_fetch_assoc($result);
            array_push($listofDates,$row);
            if($row['no_of_events']!=0){
                $events=json_decode($row['events']);
                $list=array();
                for ($i = 0; $i < count($events); $i++) {                        
                    $eventQuery="SELECT * FROM events WHERE id = '{$events[$i]}'";
                    $eventResult=$conn->query($eventQuery);                
                    if($eventResult->num_rows>0){
                        $eventRow=mysqli_fetch_assoc($eventResult);
                        array_push($list,$eventRow);
                    }
                }
                array_push($listofEvents, $list);
            }else{
                array_push($listofEvents, null);
            }
        }else{
            array_push($listofDates, null);
            array_push($listofEvents, null);
        }
    }
    $dateToday=date('Y-m-d');
    $i=intval(substr($dateToday,-2));
    $i=1;
    $currMonth=intval(date('m'));
    $currYear=intval(date('Y'));
    $daysInMonth = cal_days_in_month(CAL_GREGORIAN, $currMonth, $currYear);       
    //for current month
    for($loop=0;$loop<$daysInMonth;$loop++){
        $date="{$currYear}-{$currMonth}-{$i}";
        getEvents($date);
        $i++;
    }
    $firstMonth=array();
    for($i=0;$i<count($listofDates);$i++){
        $firstMonthEvent=json_encode($listofEvents[$i]);
        $firstMonthDate=json_encode($listofDates[$i]);
        $firstCombo=array("date"=>$firstMonthDate,"events"=>$firstMonthEvent);
        array_push($firstMonth,$firstCombo);
    }
    $listofDates=array();
    $listofEvents=array();
    //for next month
    $nextMonth=$currMonth+1;
    $nextYear=$currYear;
    $daysInNextMonth = cal_days_in_month(CAL_GREGORIAN, $nextMonth, $currYear);
    if($currMonth==12){
        $nextMonth=1;
        $nextYear=$currYear+1;
        $daysInNextMonth = cal_days_in_month(CAL_GREGORIAN, $nextMonth, $nextYear);
    }
    $i=1;
    for($loop=0;$loop<$daysInNextMonth;$loop++){
        $date="{$nextYear}-{$nextMonth}-{$i}";
        getEvents($date);
        $i++;
    }
    $secondMonth=array();
    for($i=0;$i<count($listofDates);$i++){
        $secondMonthEvent=json_encode($listofEvents[$i]);
        $secondMonthDate=json_encode($listofDates[$i]);
        $secondCombo=array("date"=>$secondMonthDate,"events"=>$secondMonthEvent);
        array_push($secondMonth,$secondCombo);
    }
    $returnArray=array();
    array_push($returnArray,$firstMonth);
    array_push($returnArray,$secondMonth);
    // for($i=0;$i<count($listofDates);$i++){
    //     $Event=json_encode($listofEvents[$i]);
    //     $Date=json_encode($listofDates[$i]);
    //     $Combo=array("date"=>$Date,"events"=>$Event);
    //     array_push($returnArray,$Combo);
    // }
    echo json_encode($returnArray);
}
?>