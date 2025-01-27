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
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
        break;

    case "getdata":
        $limit = filter_var($postjson['limit'], FILTER_SANITIZE_NUMBER_INT);
        $start = filter_var($postjson['start'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $sql = "SELECT * FROM daftar ORDER BY id DESC LIMIT :start, :limit";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':start', (int) $start, PDO::PARAM_INT);
            $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
            $stmt->execute();

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($rows) {
                $result = json_encode([
                    'success' => true,
                    'result' => $rows
                ]);
            } else {
                $result = json_encode([
                    'success' => false,
                    'message' => 'No data found'
                ]);
            }

            echo $result;
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;


    case "deleteData":
        $id = filter_var($postjson['id'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $sql = "DELETE FROM daftar WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $result = $stmt->execute();

            if ($result) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Data berhasil dihapus'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Gagal menghapus data'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case "login":
        try {
            if (!isset($postjson['username']) || !isset($postjson['konfirmasi'])) {
                throw new Exception('Username and password are required');
            }

            $username = trim($postjson['username']);
            $konfirmasi = trim($postjson['konfirmasi']);


            // Log input data
            error_log("Login attempt - username: " . $username);

            $sql = "SELECT * FROM daftar WHERE username = :username AND konfirmasi = :konfirmasi";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':konfirmasi', $konfirmasi, PDO::PARAM_STR);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            // Log query result
            error_log("Query result: " . json_encode($user));

            if ($user) {
                echo json_encode([
                    'success' => true,
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'konfirmasi' => $user['konfirmasi']
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Username atau password salah'
                ]);
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ]);
        }
        break;

    case "lupa_akun":
        $email = filter_var($postjson['email'], FILTER_SANITIZE_EMAIL);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'success' => false,
                'message' => 'Format email tidak valid'
            ]);
            exit;
        }

        try {
            // Cari akun berdasarkan email
            $sql = "SELECT username, konfirmasi FROM daftar WHERE email = :email";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                // Kirim email dengan informasi akun
                $to = $email;
                $subject = "Informasi Akun Pertanian Mobile";
                $message = "Berikut adalah informasi akun Anda:\n\n";
                $message .= "Username: " . $user['username'] . "\n";
                $message .= "Password: " . $user['konfirmasi'] . "\n\n";
                $message .= "Harap simpan informasi ini dengan aman.";
                $message .= "Salam Hangat,";
                $message .= "Tim IT Pertanian Mobile";

                $headers = "From: noreply@pertanianmobile.com\r\n";
                $headers .= "Reply-To: noreply@pertanianmobile.com\r\n";
                $headers .= "X-Mailer: PHP/" . phpversion();

                // Kirim email
                $mail_sent = mail($to, $subject, $message, $headers);

                if ($mail_sent) {
                    echo json_encode([
                        'success' => true,
                        'message' => 'Informasi akun telah dikirim ke email'
                    ]);
                } else {
                    echo json_encode([
                        'success' => false,
                        'message' => 'Gagal mengirim email'
                    ]);
                }
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Email tidak terdaftar'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Kesalahan sistem: ' . $e->getMessage()
            ]);
        }
        break;

    case "change_password":
        if (!isset($postjson['username']) || !isset($postjson['old_password']) || !isset($postjson['new_password'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Data tidak lengkap'
            ]);
            exit();
        }

        $username = filter_var($postjson['username'], FILTER_SANITIZE_STRING);
        $old_password = filter_var($postjson['old_password'], FILTER_SANITIZE_STRING);
        $new_password = filter_var($postjson['new_password'], FILTER_SANITIZE_STRING);

        try {
            // Check if password is correct
            $check_sql = "SELECT id FROM daftar WHERE username = :username AND konfirmasi = :old_password";
            $check_stmt = $pdo->prepare($check_sql);
            $check_stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $check_stmt->bindParam(':old_password', $old_password, PDO::PARAM_STR);
            $check_stmt->execute();

            if ($check_stmt->rowCount() === 0) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Password lama tidak sesuai'
                ]);
                exit();
            }

            // Update password
            $update_sql = "UPDATE daftar SET konfirmasi = :new_password WHERE username = :username";
            $update_stmt = $pdo->prepare($update_sql);
            $update_stmt->bindParam(':new_password', $new_password, PDO::PARAM_STR);
            $update_stmt->bindParam(':username', $username, PDO::PARAM_STR);

            if ($update_stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Password berhasil diubah'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Gagal mengubah password'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem'
            ]);
        }
        break;
}