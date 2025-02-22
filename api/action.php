<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Content-Type: application/json; charset=UTF-8');

include "db_config.php";

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$postjson = json_decode(file_get_contents('php://input'), true);
$aksi = strip_tags($postjson['aksi']);
$data = array();

switch ($aksi) {
    case "add_register":
        $username = filter_var($postjson['username'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $email = filter_var($postjson['email'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $pss = filter_var($postjson['pss'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);
        $konfirmasi = filter_var($postjson['konfirmasi'], FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_LOW);

         // Validasi username
         if (strlen($username) < 7) {
            echo json_encode([
                'success' => false,
                'message' => 'Username minimal 7 karakter'
            ]);
            exit;
        }

        if (!preg_match('/^[a-zA-Z0-9]+$/', $username)) {
            echo json_encode([
                'success' => false,
                'message' => 'Username hanya boleh berisi huruf dan angka'
            ]);
            exit;
        }

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

            error_log("Login attempt - username: " . $username);

            $sql = "SELECT * FROM daftar WHERE username = :username AND konfirmasi = :konfirmasi";
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            $stmt->bindParam(':konfirmasi', $konfirmasi, PDO::PARAM_STR);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            error_log("Query result: " . json_encode($user));

            if ($user) {
                echo json_encode([
                    'success' => true,
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
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
        if (empty($postjson['email'])) {
            echo json_encode([
                'success' => false,
                'message' => 'Email tidak boleh kosong'
            ]);
            exit;
        }

        $email = filter_var($postjson['email'], FILTER_SANITIZE_EMAIL);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            echo json_encode([
                'success' => false,
                'message' => 'Format email tidak valid'
            ]);
            exit;
        }

        try {
            // Check if email exists
            $stmt = $pdo->prepare("SELECT * FROM daftar WHERE email = :email");
            $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$user) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Email tidak terdaftar dalam sistem'
                ]);
                exit;
            }

            require_once 'send_email.php';

            // Log before sending email
            error_log("Attempting to send email to: " . $email);

            $sendResult = sendPasswordRecoveryEmail($email, $user);

            // Log after sending email
            error_log("Email send result: " . json_encode($sendResult));

            if ($sendResult === true) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Informasi akun telah dikirim ke email Anda. Silakan cek folder inbox email utama atau spam Anda.'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Gagal mengirim email: ' . $sendResult
                ]);
            }
        } catch (PDOException $e) {
            error_log("Database error: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Terjadi kesalahan pada database. Mohon coba beberapa saat lagi.'
            ]);
        } catch (Exception $e) {
            error_log("General error: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
        break;

    default:
        echo json_encode([
            'success' => false,
            'message' => 'Invalid action'
        ]);
        break;

    case "getLatestUserData":
        try {
            if (!isset($postjson['id'])) {
                throw new Exception('ID pengguna diperlukan');
            }

            $id = filter_var($postjson['id'], FILTER_SANITIZE_NUMBER_INT);

            $sql = "SELECT id, username, email, konfirmasi FROM daftar WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user) {
                echo json_encode([
                    'success' => true,
                    'result' => array(
                        [
                            'id' => $user['id'],
                            'username' => $user['username'],
                            'email' => $user['email'],
                            'konfirmasi' => $user['konfirmasi']
                        ]
                    )
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Pengguna tidak ditemukan'
                ]);
            }
        } catch (Exception $e) {
            error_log("Error in getLatestUserData: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
        break;

    case "change_password":
        try {
            $old_password = trim($postjson['old_password']);
            $new_password = trim($postjson['new_password']);
            $user_id = isset($postjson['user_id']) ? trim($postjson['user_id']) : null;

            if (empty($old_password) || empty($new_password)) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Data tidak lengkap'
                ]);
                exit;
            }

            // Verifikasi password lama
            $check_sql = "SELECT id FROM daftar WHERE konfirmasi = ? AND id = ?";
            $check_stmt = $pdo->prepare($check_sql);
            $check_stmt->execute([$old_password, $user_id]);

            if ($check_stmt->rowCount() === 0) {
                echo json_encode([
                    'success' => false,
                    'message' => 'Password lama tidak sesuai'
                ]);
                exit;
            }

            // Update password
            $update_sql = "UPDATE daftar SET konfirmasi = ?, pss = ? WHERE id = ? AND konfirmasi = ?";
            $update_stmt = $pdo->prepare($update_sql);
            $success = $update_stmt->execute([$new_password, $new_password, $user_id, $old_password]);

            if ($success) {
                // Ambil data user terbaru setelah update
                $fetch_sql = "SELECT id, username, email, konfirmasi FROM daftar WHERE id = ?";
                $fetch_stmt = $pdo->prepare($fetch_sql);
                $fetch_stmt->execute([$user_id]);
                $updated_user = $fetch_stmt->fetch(PDO::FETCH_ASSOC);

                echo json_encode([
                    'success' => true,
                    'message' => 'Password berhasil diubah',
                    'user' => $updated_user
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

    case "validate_user":
        try {
            // Get the field to validate (either username or email)
            $username = isset($postjson['username']) ? trim($postjson['username']) : null;
            $email = isset($postjson['email']) ? trim($postjson['email']) : null;

            if ($username !== null) {
                $sql = "SELECT id FROM daftar WHERE username = :username";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':username', $username, PDO::PARAM_STR);
            } elseif ($email !== null) {
                $sql = "SELECT id FROM daftar WHERE email = :email";
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':email', $email, PDO::PARAM_STR);
            } else {
                throw new Exception('No field provided for validation');
            }

            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Data valid'
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Data tidak ditemukan'
                ]);
            }
        } catch (Exception $e) {
            error_log("Validation error: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => 'Terjadi kesalahan saat validasi'
            ]);
        }
        break;

    case "add_bantuan":
        try {
            // Validasi input
            if (empty($postjson['username']) || empty($postjson['email']) || empty($postjson['kendala'])) {
                throw new Exception('Semua field harus diisi');
            }

            $username = trim($postjson['username']);
            $email = trim($postjson['email']);
            $kendala = trim($postjson['kendala']);

            // Debug log
            error_log("Received data - username: $username, email: $email, kendala: $kendala");

            // Insert data
            $sql = "INSERT INTO bantuan (username, email, kendala) VALUES (:username, :email, :kendala)";
            $stmt = $pdo->prepare($sql);

            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':kendala', $kendala);

            if ($stmt->execute()) {
                echo json_encode([
                    'success' => true,
                    'message' => 'Kendala berhasil disimpan'
                ]);
            } else {
                throw new Exception('Gagal menyimpan data');
            }

        } catch (Exception $e) {
            error_log("Error in add_bantuan: " . $e->getMessage());
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case "get_tumbuhan_detail":
        $id = filter_var($postjson['id'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $sql = "SELECT * FROM kamus WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $tumbuhan = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($tumbuhan) {
                echo json_encode([
                    'success' => true,
                    'result' => $tumbuhan
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Tumbuhan tidak ditemukan'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case "get_tanah_detail":
        $id = filter_var($postjson['id'], FILTER_SANITIZE_NUMBER_INT);

        try {
            $sql = "SELECT * FROM tanah WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();

            $tanah = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($tanah) {
                echo json_encode([
                    'success' => true,
                    'result' => $tanah
                ]);
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Data tanah tidak ditemukan'
                ]);
            }
        } catch (PDOException $e) {
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;

    case "get_crop_recommendations":
        try {
            if (!isset($postjson['temperature']) || !isset($postjson['humidity'])) {
                throw new Exception('Temperature and humidity are required');
            }

            $temperature = filter_var($postjson['temperature'], FILTER_VALIDATE_FLOAT);
            $humidity = filter_var($postjson['humidity'], FILTER_VALIDATE_FLOAT);

            if ($temperature === false || $humidity === false) {
                throw new Exception('Invalid temperature or humidity values');
            }

            // Query disesuaikan dengan nama kolom di database
            $sql = "SELECT * FROM rekomendasi 
                        WHERE :temp BETWEEN `suhu minimal` AND `suhu maksimal` 
                        AND :hum BETWEEN `udara minimal` AND `udara maksimal`
                        ORDER BY ABS(:temp2 - (`suhu minimal` + `suhu maksimal`)/2) + 
                                 ABS(:hum2 - (`udara minimal` + `udara maksimal`)/2)
                        LIMIT 10";

            $stmt = $pdo->prepare($sql);

            // Binding semua parameter yang digunakan
            $stmt->bindValue(':temp', $temperature, PDO::PARAM_STR);
            $stmt->bindValue(':hum', $humidity, PDO::PARAM_STR);
            $stmt->bindValue(':temp2', $temperature, PDO::PARAM_STR);
            $stmt->bindValue(':hum2', $humidity, PDO::PARAM_STR);

            $stmt->execute();

            $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if ($results) {
                echo json_encode([
                    'success' => true,
                    'result' => array_map(function ($row) {
                        return [
                            'id' => $row['id'],
                            'datatumbuhan' => $row['datatumbuhan'],
                            'suhu_min' => $row['suhu minimal'],
                            'suhu_max' => $row['suhu maksimal'],
                            'udara_min' => $row['udara minimal'],
                            'udara_max' => $row['udara maksimal'],
                            'lembabtanah' => $row['lembabtanah']
                        ];
                    }, $results)
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'result' => [],
                    'message' => 'Tidak ada rekomendasi yang sesuai dengan kondisi cuaca saat ini'
                ]);
            }

        } catch (Exception $e) {
            error_log("Error in get_crop_recommendations: " . $e->getMessage());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => $e->getMessage()
            ]);
        }
        break;
}