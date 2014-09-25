## Laboratory work 11

## Basic requirements

* Introduce your text
* Generate or provide keys
* Encode (show results)
* Provide decription keys
* Show decoded text

## TO DO:

### Key generation

* generate 2 distinct primes, their product in bits should be chosen key length
* compute φ = Euler totient function or _Carmichael function_
* choose e(public key), s.t. 1<e<φ and gcd(e,φ) = 1 (coprime numbers)
* choose d(private key), s.t. d is multiplicative inverse of e mod φ;

### Encryption & Decryption

* letter to integer m, crypto c=m^e(mod n) 
* m = c^d(mod n)

### Functions(effort):

* generate primes [7]
* gcd [5]
* totient [1]
* coprime number [5]
* choose e [3]
* multiplicative inverse [6]
* x^y(mod n) with exponentiation by squaring [5]