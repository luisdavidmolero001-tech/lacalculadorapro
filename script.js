document.addEventListener('DOMContentLoaded', function() {
    // Elementos principales
    const display = document.getElementById('display');
    const historyDisplay = document.getElementById('history');
    const historyList = document.getElementById('historyList');
    const memoryValueElement = document.getElementById('memoryValue');
    
    // Variables de estado
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetDisplay = false;
    let memory = 0;
    let scientificMode = false;
    let calculationHistory = [];
    
    // Inicialización
    updateDisplay();
    updateMemoryDisplay();
    
    // Configurar el interruptor de tema
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', function() {
        document.body.classList.toggle('light-theme', !this.checked);
    });
    
    // Manejo de clics en botones de la calculadora
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            const action = this.getAttribute('data-action');
            
            if (value !== null) {
                inputNumber(value);
            } else if (action !== null) {
                handleAction(action);
            }
        });
    });
    
    // Funciones para entrada de números
    function inputNumber(num) {
        if (resetDisplay) {
            currentInput = '';
            resetDisplay = false;
        }
        
        if (currentInput === '0' && num !== '.') {
            currentInput = num;
        } else {
            // Evitar múltiples puntos decimales
            if (num === '.' && currentInput.includes('.')) return;
            currentInput += num;
        }
        
        updateDisplay();
    }
    
    // Manejo de acciones/operaciones
    function handleAction(action) {
        switch(action) {
            case 'clear':
                clearCalculator();
                break;
            case 'clearEntry':
                clearEntry();
                break;
            case 'percent':
                calculatePercent();
                break;
            case 'divide':
            case 'multiply':
            case 'subtract':
            case 'add':
            case 'power':
                setOperation(action);
                break;
            case 'equals':
                calculateResult();
                break;
            case 'sqrt':
                calculateSquareRoot();
                break;
            case 'square':
                calculateSquare();
                break;
            case 'sin':
                calculateSin();
                break;
            case 'cos':
                calculateCos();
                break;
            case 'tan':
                calculateTan();
                break;
        }
    }
    
    // Funciones de operaciones básicas
    function setOperation(op) {
        if (operation !== null && !resetDisplay) {
            calculateResult();
        }
        
        previousInput = currentInput;
        operation = op;
        resetDisplay = true;
        updateHistoryDisplay();
    }
    
    function calculateResult() {
        if (operation === null || resetDisplay) return;
        
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        let result = 0;
        
        switch(operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert("Error: No se puede dividir entre cero");
                    clearCalculator();
                    return;
                }
                result = prev / current;
                break;
            case 'power':
                result = Math.pow(prev, current);
                break;
        }
        
        // Guardar en el historial
        const historyEntry = {
            expression: `${previousInput} ${getOperationSymbol(operation)} ${currentInput}`,
            result: result
        };
        
        calculationHistory.unshift(historyEntry);
        updateHistoryList();
        
        // Mostrar resultado
        currentInput = result.toString();
        operation = null;
        previousInput = '';
        resetDisplay = true;
        
        updateDisplay();
        updateHistoryDisplay();
    }
    
    // Funciones matemáticas especiales
    function calculateSquareRoot() {
        const num = parseFloat(currentInput);
        if (num < 0) {
            alert("Error: No se puede calcular la raíz cuadrada de un número negativo");
            return;
        }
        
        const result = Math.sqrt(num);
        addToHistory(`√(${currentInput})`, result);
        currentInput = result.toString();
        resetDisplay = true;
        updateDisplay();
    }
    
    function calculateSquare() {
        const num = parseFloat(currentInput);
        const result = Math.pow(num, 2);
        addToHistory(`sqr(${currentInput})`, result);
        currentInput = result.toString();
        resetDisplay = true;
        updateDisplay();
    }
    
    function calculateSin() {
        const num = parseFloat(currentInput);
        const result = Math.sin(num * Math.PI / 180); // Convertir a radianes
        addToHistory(`sin(${currentInput}°)`, result);
        currentInput = result.toString();
        resetDisplay = true;
        updateDisplay();
    }
    
    function calculateCos() {
        const num = parseFloat(currentInput);
        const result = Math.cos(num * Math.PI / 180); // Convertir a radianes
        addToHistory(`cos(${currentInput}°)`, result);
        currentInput = result.toString();
        resetDisplay = true;
        updateDisplay();
    }
    
    function calculateTan() {
        const num = parseFloat(currentInput);
        // Evitar ángulos donde la tangente es indefinida
        if (Math.abs(num % 180) === 90) {
            alert("Error: Tangente indefinida para este ángulo");
            return;
        }
        const result = Math.tan(num * Math.PI / 180); // Convertir a radianes
        addToHistory(`tan(${currentInput}°)`, result);
        currentInput = result.toString();
        resetDisplay = true;
        updateDisplay();
    }
    
    // Funciones de utilidad
    function calculatePercent() {
        const num = parseFloat(currentInput);
        const result = num / 100;
        currentInput = result.toString();
        resetDisplay = true;
        updateDisplay();
    }
    
    function clearCalculator() {
        currentInput = '0';
        previousInput = '';
        operation = null;
        resetDisplay = false;
        updateDisplay();
        updateHistoryDisplay();
    }
    
    function clearEntry() {
        currentInput = '0';
        updateDisplay();
    }
    
    function updateDisplay() {
        display.value = currentInput;
    }
    
    function updateHistoryDisplay() {
        if (operation && previousInput) {
            historyDisplay.textContent = `${previousInput} ${getOperationSymbol(operation)}`;
        } else {
            historyDisplay.textContent = '';
        }
    }
    
    function getOperationSymbol(op) {
        switch(op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            case 'power': return '^';
            default: return '';
        }
    }
    
    // Funciones de memoria
    document.getElementById('memoryClear').addEventListener('click', function() {
        memory = 0;
        updateMemoryDisplay();
    });
    
    document.getElementById('memoryRecall').addEventListener('click', function() {
        currentInput = memory.toString();
        resetDisplay = true;
        updateDisplay();
    });
    
    document.getElementById('memoryAdd').addEventListener('click', function() {
        const current = parseFloat(currentInput) || 0;
        memory += current;
        updateMemoryDisplay();
    });
    
    document.getElementById('memorySubtract').addEventListener('click', function() {
        const current = parseFloat(currentInput) || 0;
        memory -= current;
        updateMemoryDisplay();
    });
    
    document.getElementById('memoryStore').addEventListener('click', function() {
        memory = parseFloat(currentInput) || 0;
        updateMemoryDisplay();
    });
    
    function updateMemoryDisplay() {
        memoryValueElement.textContent = memory;
    }
    
    // Funciones de historial
    function addToHistory(expression, result) {
        calculationHistory.unshift({
            expression: expression,
            result: result
        });
        updateHistoryList();
    }
    
    function updateHistoryList() {
        historyList.innerHTML = '';
        
        calculationHistory.slice(0, 5).forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div>${item.expression}</div>
                <div><strong>= ${item.result}</strong></div>
            `;
            
            // Permitir hacer clic en un elemento del historial para usarlo
            historyItem.addEventListener('click', function() {
                currentInput = item.result.toString();
                resetDisplay = true;
                updateDisplay();
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    document.getElementById('clearHistory').addEventListener('click', function() {
        calculationHistory = [];
        updateHistoryList();
    });
    
    // Funciones extras
    document.getElementById('toggleMode').addEventListener('click', function() {
        scientificMode = !scientificMode;
        const specialButtons = document.querySelectorAll('.special-functions');
        const modeButton = document.getElementById('toggleMode');
        
        if (scientificMode) {
            specialButtons.forEach(btn => btn.style.display = 'flex');
            modeButton.textContent = 'Modo Básico';
            modeButton.style.backgroundColor = '#6c5ce7';
        } else {
            specialButtons.forEach(btn => btn.style.display = 'none');
            modeButton.textContent = 'Modo Científico';
            modeButton.style.backgroundColor = '';
        }
    });
    
    document.getElementById('copyResult').addEventListener('click', function() {
        navigator.clipboard.writeText(currentInput)
            .then(() => {
                const originalText = this.textContent;
                this.textContent = '¡Copiado!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 1500);
            })
            .catch(err => {
                console.error('Error al copiar: ', err);
            });
    });
    
    document.getElementById('randomNumber').addEventListener('click', function() {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        currentInput = randomNum.toString();
        resetDisplay = true;
        updateDisplay();
        
        addToHistory("Número aleatorio", randomNum);
    });
    
    // Soporte para teclado
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        
        if (key >= '0' && key <= '9') {
            inputNumber(key);
        } else if (key === '.') {
            inputNumber('.');
        } else if (key === '+') {
            setOperation('add');
        } else if (key === '-') {
            setOperation('subtract');
        } else if (key === '*') {
            setOperation('multiply');
        } else if (key === '/') {
            event.preventDefault();
            setOperation('divide');
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
        } else if (key === 'Escape' || key === 'Delete') {
            clearCalculator();
        } else if (key === '%') {
            calculatePercent();
        } else if (key === 'Backspace') {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }
    });
});