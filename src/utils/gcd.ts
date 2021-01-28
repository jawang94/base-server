export function gcd(width: number, height: number): number {
  return height == 0 ? width : gcd(height, width % height);
}
