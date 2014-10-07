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
// Extended greatest common divisor
function egcd(a, b) {
    if (a == 0) {
        return [b, 0 ,1]
    }
    else {
        list = egcd(b % a, a)
        g = list[0]
        y = list[1]
        x = list[2]
        return [g, x - Math.floor(b/a) * y, y]
    }
}

//Modular multiplicative inverse
function mod_inv(a, m) {
    list = egcd(a, m)
    if (list[0] != 1) {
        return null // modular inverse doesn't exist
    }
    else {
        return list[1] % m
    }
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

function is_coprime(a, b) {
    if (gcd(a,b) == 1) {
        return true
    }
    else {
        return false
    }
}

function choose_pub_key(totient) {
    //TODO add acceptable lower limit
    while(true) {
        pub = Math.floor((Math.random() * (totient - 1))+1)
        if (is_coprime(pub, totient)) {
            return pub
        }
    }
}

function choose_private_key(totient, pub_key) {
    //TODO handle the case with inexistent key, will have to regenerate pub_key
    return mod_inv(pub_key, totient)
}    

function encrypt(block, key, modulus) {
    return power(block, key) % modulus
}


//TODO Miller-rabin primality test
function is_prime(n, k) {
    s = 0
    
    while(true) {
        a = Math.floor(Math.random() * (n - 4)) + 2 //randint in range 2 ; n - 2
    }
}

