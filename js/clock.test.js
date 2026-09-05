/**
 * Test file for ClockModule.formatTime()
 * Run in browser console or using Node.js
 */

// Mock DOM for testing
if (typeof document === 'undefined') {
    global.document = {
        getElementById: () => ({ textContent: '' })
    };
}

// Copy the formatTime function for testing
const ClockModule = {
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
};

// Test cases for HH:MM:SS format with leading zeros
function runTests() {
    const tests = [
        {
            name: 'Midnight (00:00:00)',
            date: new Date(2024, 0, 15, 0, 0, 0),
            expected: '00:00:00'
        },
        {
            name: 'Morning 9:30:45',
            date: new Date(2024, 0, 15, 9, 30, 45),
            expected: '09:30:45'
        },
        {
            name: 'Noon (12:00:00)',
            date: new Date(2024, 0, 15, 12, 0, 0),
            expected: '12:00:00'
        },
        {
            name: 'Afternoon 14:05:01',
            date: new Date(2024, 0, 15, 14, 5, 1),
            expected: '14:05:01'
        },
        {
            name: 'Evening 18:59:59',
            date: new Date(2024, 0, 15, 18, 59, 59),
            expected: '18:59:59'
        },
        {
            name: 'Night 23:15:30',
            date: new Date(2024, 0, 15, 23, 15, 30),
            expected: '23:15:30'
        }
    ];

    console.log('=== ClockModule.formatTime() Tests ===');
    console.log('Testing 24-hour format with leading zeros (HH:MM:SS)\n');

    let passed = 0;
    let failed = 0;

    tests.forEach(test => {
        const result = ClockModule.formatTime(test.date);
        const success = result === test.expected;
        
        if (success) {
            console.log(`✓ PASS: ${test.name}`);
            console.log(`  Result: ${result}`);
            passed++;
        } else {
            console.log(`✗ FAIL: ${test.name}`);
            console.log(`  Expected: ${test.expected}`);
            console.log(`  Got:      ${result}`);
            failed++;
        }
    });

    console.log(`\n=== Results: ${passed}/${tests.length} passed ===`);
    
    // Return true if all tests pass
    return failed === 0;
}

// Run tests
const success = runTests();

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ClockModule, runTests };
}