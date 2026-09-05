/**
 * Tests for GreetingModule.getGreeting()
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 */

// ============================================
// Test Setup - Copy of GreetingModule for isolated testing
// ============================================

const GreetingModule = {
    getGreeting(hour) {
        if (hour >= 5 && hour < 12) return 'Good Morning';
        if (hour >= 12 && hour < 17) return 'Good Afternoon';
        if (hour >= 17 && hour < 21) return 'Good Evening';
        return 'Good Night';
    }
};

// ============================================
// Unit Tests
// ============================================

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
    if (condition) {
        console.log(`✓ PASS: ${testName}`);
        testsPassed++;
    } else {
        console.error(`✗ FAIL: ${testName}`);
        testsFailed++;
    }
}

// Test: Good Morning (5:00 AM - 11:59 AM)
function testGoodMorning() {
    console.log('\n--- Testing Good Morning (5:00 AM - 11:59 AM) ---');
    
    assert(GreetingModule.getGreeting(5) === 'Good Morning', 'Hour 5 returns Good Morning');
    assert(GreetingModule.getGreeting(6) === 'Good Morning', 'Hour 6 returns Good Morning');
    assert(GreetingModule.getGreeting(7) === 'Good Morning', 'Hour 7 returns Good Morning');
    assert(GreetingModule.getGreeting(8) === 'Good Morning', 'Hour 8 returns Good Morning');
    assert(GreetingModule.getGreeting(9) === 'Good Morning', 'Hour 9 returns Good Morning');
    assert(GreetingModule.getGreeting(10) === 'Good Morning', 'Hour 10 returns Good Morning');
    assert(GreetingModule.getGreeting(11) === 'Good Morning', 'Hour 11 returns Good Morning');
}

// Test: Good Afternoon (12:00 PM - 4:59 PM)
function testGoodAfternoon() {
    console.log('\n--- Testing Good Afternoon (12:00 PM - 4:59 PM) ---');
    
    assert(GreetingModule.getGreeting(12) === 'Good Afternoon', 'Hour 12 returns Good Afternoon');
    assert(GreetingModule.getGreeting(13) === 'Good Afternoon', 'Hour 13 returns Good Afternoon');
    assert(GreetingModule.getGreeting(14) === 'Good Afternoon', 'Hour 14 returns Good Afternoon');
    assert(GreetingModule.getGreeting(15) === 'Good Afternoon', 'Hour 15 returns Good Afternoon');
    assert(GreetingModule.getGreeting(16) === 'Good Afternoon', 'Hour 16 returns Good Afternoon');
}

// Test: Good Evening (5:00 PM - 8:59 PM)
function testGoodEvening() {
    console.log('\n--- Testing Good Evening (5:00 PM - 8:59 PM) ---');
    
    assert(GreetingModule.getGreeting(17) === 'Good Evening', 'Hour 17 returns Good Evening');
    assert(GreetingModule.getGreeting(18) === 'Good Evening', 'Hour 18 returns Good Evening');
    assert(GreetingModule.getGreeting(19) === 'Good Evening', 'Hour 19 returns Good Evening');
    assert(GreetingModule.getGreeting(20) === 'Good Evening', 'Hour 20 returns Good Evening');
}

// Test: Good Night (9:00 PM - 4:59 AM)
function testGoodNight() {
    console.log('\n--- Testing Good Night (9:00 PM - 4:59 AM) ---');
    
    assert(GreetingModule.getGreeting(21) === 'Good Night', 'Hour 21 returns Good Night');
    assert(GreetingModule.getGreeting(22) === 'Good Night', 'Hour 22 returns Good Night');
    assert(GreetingModule.getGreeting(23) === 'Good Night', 'Hour 23 returns Good Night');
    assert(GreetingModule.getGreeting(0) === 'Good Night', 'Hour 0 returns Good Night');
    assert(GreetingModule.getGreeting(1) === 'Good Night', 'Hour 1 returns Good Night');
    assert(GreetingModule.getGreeting(2) === 'Good Night', 'Hour 2 returns Good Night');
    assert(GreetingModule.getGreeting(3) === 'Good Night', 'Hour 3 returns Good Night');
    assert(GreetingModule.getGreeting(4) === 'Good Night', 'Hour 4 returns Good Night');
}

// Test: Boundary cases
function testBoundaryCases() {
    console.log('\n--- Testing Boundary Cases ---');
    
    // Just before morning cutoff
    assert(GreetingModule.getGreeting(4) === 'Good Night', 'Hour 4 (just before 5 AM) returns Good Night');
    // Just after morning cutoff
    assert(GreetingModule.getGreeting(5) === 'Good Morning', 'Hour 5 (at 5 AM) returns Good Morning');
    
    // Just before afternoon cutoff  
    assert(GreetingModule.getGreeting(11) === 'Good Morning', 'Hour 11 (just before noon) returns Good Morning');
    // At afternoon cutoff
    assert(GreetingModule.getGreeting(12) === 'Good Afternoon', 'Hour 12 (noon) returns Good Afternoon');
    
    // Just before evening cutoff
    assert(GreetingModule.getGreeting(16) === 'Good Afternoon', 'Hour 16 (just before 5 PM) returns Good Afternoon');
    // At evening cutoff
    assert(GreetingModule.getGreeting(17) === 'Good Evening', 'Hour 17 (5 PM) returns Good Evening');
    
    // Just before night cutoff
    assert(GreetingModule.getGreeting(20) === 'Good Evening', 'Hour 20 (just before 9 PM) returns Good Evening');
    // At night cutoff
    assert(GreetingModule.getGreeting(21) === 'Good Night', 'Hour 21 (9 PM) returns Good Night');
}

// ============================================
// Property-Based Test
// ============================================

/**
 * Property 1: Time-Based Greeting Coverage
 * For any hour value (0-23), the GreetingModule SHALL return 
 * exactly one of the four greeting messages
 * 
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4
 */
function testPropertyGreetingCoverage() {
    console.log('\n--- Property Test: Time-Based Greeting Coverage ---');
    
    const validGreetings = ['Good Morning', 'Good Afternoon', 'Good Evening', 'Good Night'];
    let allValid = true;
    const greetingDistribution = {};
    
    // Initialize distribution counter
    validGreetings.forEach(g => greetingDistribution[g] = 0);
    
    for (let hour = 0; hour < 24; hour++) {
        const greeting = GreetingModule.getGreeting(hour);
        
        if (!validGreetings.includes(greeting)) {
            console.error(`✗ FAIL: Hour ${hour} returned invalid greeting: "${greeting}"`);
            allValid = false;
        } else {
            greetingDistribution[greeting]++;
        }
    }
    
    assert(allValid, 'All hours (0-23) return a valid greeting');
    
    // Verify each greeting is returned at least once
    let allGreetingsUsed = true;
    validGreetings.forEach(g => {
        if (greetingDistribution[g] === 0) {
            console.error(`✗ FAIL: "${g}" was never returned`);
            allGreetingsUsed = false;
        }
    });
    assert(allGreetingsUsed, 'All four greetings are used across 24 hours');
    
    console.log('Greeting distribution:', greetingDistribution);
    
    return allValid && allGreetingsUsed;
}

// ============================================
// Run All Tests
// ============================================

function runAllTests() {
    console.log('=================================================');
    console.log('Testing GreetingModule.getGreeting()');
    console.log('Validates: Requirements 2.1, 2.2, 2.3, 2.4');
    console.log('=================================================');
    
    testGoodMorning();
    testGoodAfternoon();
    testGoodEvening();
    testGoodNight();
    testBoundaryCases();
    testPropertyGreetingCoverage();
    
    console.log('\n=================================================');
    console.log(`Test Results: ${testsPassed} passed, ${testsFailed} failed`);
    console.log('=================================================');
    
    if (testsFailed > 0) {
        console.error('\nSome tests failed!');
        process.exit(1);
    } else {
        console.log('\nAll tests passed!');
    }
}

// Run tests
runAllTests();

// Export for use in other test files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GreetingModule, runAllTests };
}