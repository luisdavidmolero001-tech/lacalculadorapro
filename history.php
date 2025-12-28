<?php
// history.php - Guardar y recuperar historial de cálculos desde el servidor

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = 'calculator_history.json';

// Función para cargar el historial desde el archivo
function loadHistory() {
    global $dataFile;
    
    if (file_exists($dataFile)) {
        $content = file_get_contents($dataFile);
        return json_decode($content, true) ?: [];
    }
    
    return [];
}

// Función para guardar el historial en el archivo
function saveHistory($history) {
    global $dataFile;
    
    // Limitar el historial a los últimos 50 elementos
    if (count($history) > 50) {
        $history = array_slice($history, 0, 50);
    }
    
    file_put_contents($dataFile, json_encode($history, JSON_PRETTY_PRINT));
    return true;
}

// Manejar las solicitudes
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Devolver el historial
    $history = loadHistory();
    echo json_encode([
        'success' => true,
        'history' => $history
    ]);
    
} elseif ($method === 'POST') {
    // Agregar una nueva entrada al historial
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (isset($input['expression']) && isset($input['result'])) {
        $history = loadHistory();
        
        $newEntry = [
            'id' => uniqid(),
            'expression' => $input['expression'],
            'result' => $input['result'],
            'timestamp' => date('Y-m-d H:i:s')
        ];
        
        array_unshift($history, $newEntry);
        saveHistory($history);
        
        echo json_encode([
            'success' => true,
            'message' => 'Entrada guardada',
            'entry' => $newEntry
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Datos incompletos'
        ]);
    }
    
} elseif ($method === 'DELETE') {
    // Limpiar el historial
    saveHistory([]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Historial limpiado'
    ]);
    
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido'
    ]);
}
?>