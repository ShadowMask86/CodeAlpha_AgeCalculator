// DOM Elements
const form = document.getElementById('ageForm');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');
const resultsSection = document.getElementById('resultsSection');
const funFacts = document.getElementById('funFacts');

// Error message elements
const dayError = document.getElementById('dayError');
const monthError = document.getElementById('monthError');
const yearError = document.getElementById('yearError');
const generalError = document.getElementById('generalError');

// Result elements
const yearsResult = document.getElementById('yearsResult');
const monthsResult = document.getElementById('monthsResult');
const daysResult = document.getElementById('daysResult');
const totalDays = document.getElementById('totalDays');
const totalHours = document.getElementById('totalHours');
const nextBirthday = document.getElementById('nextBirthday');
const dayOfBirth = document.getElementById('dayOfBirth');

// Fun facts elements
const earthRotations = document.getElementById('earthRotations');
const heartBeats = document.getElementById('heartBeats');
const birthdays = document.getElementById('birthdays');

// 1. INPUT VALIDATION FUNCTIONS
function clearErrors() {
    dayError.textContent = '';
    monthError.textContent = '';
    yearError.textContent = '';
    generalError.textContent = '';
}

function validateInput(day, month, year) {
    let isValid = true;
    clearErrors();
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    // Validate day
    if (!day || day < 1 || day > 31) {
        dayError.textContent = 'Enter a valid day (1-31)';
        isValid = false;
    }
    
    // Validate month
    if (!month || month < 1 || month > 12) {
        monthError.textContent = 'Enter a valid month (1-12)';
        isValid = false;
    }
    
    // Validate year
    if (!year || year < 1900 || year > currentYear) {
        yearError.textContent = `Enter a valid year (1900-${currentYear})`;
        isValid = false;
    }
    
    // Check if date is valid and not in the future
    if (isValid) {
        // Check if the date actually exists (like Feb 30th doesn't exist)
        const testDate = new Date(year, month - 1, day);
        if (testDate.getDate() != day || testDate.getMonth() != month - 1 || testDate.getFullYear() != year) {
            generalError.textContent = 'This date does not exist. Please check your input.';
            isValid = false;
        }
        
        // Check if date is in the future
        const birthDate = new Date(year, month - 1, day);
        if (birthDate > currentDate) {
            generalError.textContent = 'Birth date cannot be in the future.';
            isValid = false;
        }
        
        // Check if the person is too old (over 125 years)
        if (currentYear - year > 125) {
            generalError.textContent = 'Please enter a realistic birth year.';
            isValid = false;
        }
    }
    
    return isValid;
}

// 2. AGE CALCULATION FUNCTIONS
function calculateAge(birthDay, birthMonth, birthYear) {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        days += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    return { years, months, days };
}

function calculateAdditionalInfo(birthDay, birthMonth, birthYear) {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    
    // Calculate total days lived
    const timeDiff = today - birthDate;
    const totalDaysLived = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Calculate total hours lived
    const totalHoursLived = Math.floor(timeDiff / (1000 * 60 * 60));
    
    // Calculate next birthday
    let nextBirthday = new Date(today.getFullYear(), birthMonth - 1, birthDay);
    if (nextBirthday < today) {
        nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    
    // Get day of birth
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfBirthName = dayNames[birthDate.getDay()];
    
    // Calculate fun facts
    const earthRotationsCount = totalDaysLived; // One rotation per day
    const heartBeatsCount = Math.floor(totalDaysLived * 100000); // Average 100k beats per day
    const birthdaysCount = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24 * 365.25));
    
    return {
        totalDaysLived,
        totalHoursLived,
        daysToNextBirthday,
        dayOfBirthName,
        earthRotationsCount,
        heartBeatsCount,
        birthdaysCount
    };
}

// 3. DISPLAY FUNCTIONS
function animateNumber(element, targetValue, duration = 1000) {
    const startValue = 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
        
        element.textContent = currentValue.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateNumber);
}

function displayResults(age, additionalInfo) {
    // Animate main age results
    animateNumber(yearsResult, age.years, 1200);
    animateNumber(monthsResult, age.months, 1000);
    animateNumber(daysResult, age.days, 800);
    
    // Update additional information
    setTimeout(() => {
        totalDays.textContent = additionalInfo.totalDaysLived.toLocaleString();
        totalHours.textContent = additionalInfo.totalHoursLived.toLocaleString();
        
        if (additionalInfo.daysToNextBirthday === 0) {
            nextBirthday.textContent = "Today! 🎉 Happy Birthday!";
        } else if (additionalInfo.daysToNextBirthday === 1) {
            nextBirthday.textContent = "Tomorrow! 🎂";
        } else {
            nextBirthday.textContent = `${additionalInfo.daysToNextBirthday} days`;
        }
        
        dayOfBirth.textContent = additionalInfo.dayOfBirthName;
        
        // Animate fun facts
        animateNumber(earthRotations, additionalInfo.earthRotationsCount, 1500);
        animateNumber(heartBeats, additionalInfo.heartBeatsCount, 2000);
        animateNumber(birthdays, additionalInfo.birthdaysCount, 800);
    }, 500);
    
    // Show results with animation
    resultsSection.classList.add('show');
    
    setTimeout(() => {
        funFacts.classList.add('show');
    }, 300);
    
    setTimeout(() => {
        resetBtn.classList.add('show');
    }, 600);
}

function resetForm() {
    // Clear form
    form.reset();
    clearErrors();
    
    // Hide results
    resultsSection.classList.remove('show');
    funFacts.classList.remove('show');
    resetBtn.classList.remove('show');
    
    // Reset result values
    yearsResult.textContent = '0';
    monthsResult.textContent = '0';
    daysResult.textContent = '0';
    totalDays.textContent = '0';
    totalHours.textContent = '0';
    nextBirthday.textContent = '-';
    dayOfBirth.textContent = '-';
    earthRotations.textContent = '0';
    heartBeats.textContent = '0';
    birthdays.textContent = '0';
    
    // Focus on first input
    dayInput.focus();
}

// 4. EVENT LISTENERS
document.addEventListener('DOMContentLoaded', function() {
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        
        if (validateInput(day, month, year)) {
            // Add loading animation
            calculateBtn.classList.add('calculating');
            calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
            
            setTimeout(() => {
                const age = calculateAge(day, month, year);
                const additionalInfo = calculateAdditionalInfo(day, month, year);
                
                displayResults(age, additionalInfo);
                
                // Reset button state
                calculateBtn.classList.remove('calculating');
                calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Calculate Age';
            }, 1000);
        }
    });
    
    // Reset button
    resetBtn.addEventListener('click', resetForm);
    
    // Input restrictions (only numbers)
    [dayInput, monthInput, yearInput].forEach(input => {
        input.addEventListener('input', function() {
            // Remove non-numeric characters
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Clear individual error messages on input
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
            }
            generalError.textContent = '';
        });
        
        // Clear errors on focus
        input.addEventListener('focus', function() {
            const errorElement = document.getElementById(this.id + 'Error');
            if (errorElement) {
                errorElement.textContent = '';
            }
            generalError.textContent = '';
        });
    });
    
    // Keyboard navigation
    dayInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.length >= 1) {
            e.preventDefault();
            monthInput.focus();
        }
    });
    
    monthInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.length >= 1) {
            e.preventDefault();
            yearInput.focus();
        }
    });
    
    yearInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.value.length >= 4) {
            e.preventDefault();
            calculateBtn.click();
        }
    });
    
    // Auto-advance on complete input
    dayInput.addEventListener('input', function() {
        if (this.value.length === 2) {
            monthInput.focus();
        }
    });
    
    monthInput.addEventListener('input', function() {
        if (this.value.length === 2) {
            yearInput.focus();
        }
    });
    
    console.log('🎂 Age Calculator loaded successfully!');
});