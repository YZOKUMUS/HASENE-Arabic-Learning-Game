// 🎯 Onboarding Test Functions
// These functions can be called from browser console for testing

// Reset onboarding (user will see intro again)
function resetOnboarding() {
    localStorage.removeItem('onboardingCompleted');
    localStorage.removeItem('userGoal');
    console.log('✅ Onboarding reset! Refresh page to see intro again.');
    return 'Onboarding has been reset!';
}

// Complete onboarding (skip intro)
function completeOnboarding() {
    localStorage.setItem('onboardingCompleted', 'true');
    localStorage.setItem('userGoal', 'beginner');
    console.log('✅ Onboarding marked as completed!');
    return 'Onboarding marked as completed!';
}

// Check onboarding status
function checkOnboardingStatus() {
    const completed = localStorage.getItem('onboardingCompleted');
    const goal = localStorage.getItem('userGoal');
    
    console.log('📊 Onboarding Status:');
    console.log('   Completed:', completed === 'true' ? '✅ Yes' : '❌ No');
    console.log('   User Goal:', goal || '❌ Not set');
    
    return {
        completed: completed === 'true',
        goal: goal || 'Not set'
    };
}

// Show intro again
function showIntroAgain() {
    window.location.href = 'onboarding.html';
}

// Export to global scope for console access
if (typeof window !== 'undefined') {
    window.resetOnboarding = resetOnboarding;
    window.completeOnboarding = completeOnboarding;
    window.checkOnboardingStatus = checkOnboardingStatus;
    window.showIntroAgain = showIntroAgain;
}

console.log('🎯 Onboarding Test Functions Loaded!');
console.log('   - resetOnboarding()     : Reset and show intro again');
console.log('   - completeOnboarding()  : Skip intro');
console.log('   - checkOnboardingStatus(): Check current status');
console.log('   - showIntroAgain()      : Go to onboarding page');