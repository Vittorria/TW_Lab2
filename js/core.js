// functions necessary to perform app logic
// some of the functions will need VERY HUGE NUMBERS, will implement later

// Euler totient function
function totient(p, q) {
    return (p - 1) * (q -1)
}

// Greates common divisor
function gcd(a, b) {
    while(b != 0) {
        t = b
        b = a % b
        a = t
    }
    return a
}

//Exponentiation by squaring
function power(x, n) {
    if (n == 0) {
        return 1
    }
    else if (n == 1) {
        return x
    }
    else if ((n % 2) == 1) {
        return power(x*x, (n - 1)/2)
    }
    else {
        return power(x*x, n/2)
    } 
}


