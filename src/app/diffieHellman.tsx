export class DiffieHellman {
  /*cálculo de (base^exp) % mod
    retirado de:
    https://learn.microsoft.com/pt-br/windows/win32/seccrypto/diffie-hellman-keys#example-code
    */
  static modExp(base: number, exp: number, mod: number): number {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  }

  //não são números criptograficamente seguros
  static generatePrivateKey(): number {
    return Math.floor(Math.random() * 100) + 2;
  }

  static calculatePublicKey(g: number, privateKey: number, p: number): number {
    return this.modExp(g, privateKey, p);
  }

  static calculateSharedSecret(
    publicKey: number,
    privateKey: number,
    p: number
  ): number {
    return this.modExp(publicKey, privateKey, p);
  }
}

export const isPrime = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};
