<?php
include "db.php";

$data = file_get_contents("php://input");
file_put_contents("mpesa_log.txt", $data);

// decode safely
$response = json_decode($data, true);

// check structure exists
if (isset($response['Body']['stkCallback'])) {

    $callback = $response['Body']['stkCallback'];
    $resultCode = $callback['ResultCode'];

    if ($resultCode == 0) {

        $items = $callback['CallbackMetadata']['Item'];

        $amount = $items[0]['Value'] ?? 0;
        $mpesaCode = $items[1]['Value'] ?? '';
        $phone = $items[4]['Value'] ?? '';
        $order_id = $items[3]['Value'] ?? 0;

        mysqli_query($conn, "UPDATE orders 
            SET status='PAID', mpesa_code='$mpesaCode'
            WHERE id='$order_id'");
    }
}
?>