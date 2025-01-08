<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

include "db_config.php";
$postjson = json_decode(file_get_contents('php://input'), true);
$aksi = strip_tags($postjson['aksi']);
$data = array();
switch ($aksi) {
    case "add_register":
        $username = filter_var($postjson['username'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $email = filter_var($postjson['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $pss = filter_var($postjson['pss'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $konfirmasi = filter_var($postjson['konfirmasi'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

        try {
            $sql = "INSERT INTO daftar (username,email,pss,konfirmasi) VALUES (:username, :email, :pss, :konfirmasi)";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->bindParam(':pss', $pss, PDO::PARAM_STR);
            $stmt->bindParam(':konfirmasi', $konfirmasi, PDO::PARAM_STR);
            $stmt->execute();
            if ($sql)
                $result = json_encode(array('success' => true));
            else
                $result = json_encode(array('success' => false, 'msg' => 'error, please try again'));

            echo $result;
        } 
        catch (PDOException $e) 
        {
            echo $e->getMessage();
        }
        break;

    case "getdata":
        $limit = filter_var($postjson['limit'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $start = filter_var($postjson['start'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        try {
            $sql = "SELECT * FROM daftar ORDER BY id DESC LIMIT :start,:limit";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':start', $start, PDO::PARAM_STR);
            $stmt->bindParam(':limit', $limit, PDO::PARAM_STR);
            $stmt->execute();
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            foreach ($rows as $row) {
                $data[] = array(
                    'id' => $row['id'],
                    'username' => $row['username'],
                    'email' => $row['email'],
                    'pss' => $row['pss'],
                    'konfirmasi' => $row['konfirmasi']
                );
            }
            if($stmt) $result = json_encode(array('success'=>true, 'result'=>$data));
            else $result =  json_encode(array('success'=>false));

            echo $result;
        } 
        catch (PDOException $e) 
        {
            echo $e->getMessage();
        }

    break;
}