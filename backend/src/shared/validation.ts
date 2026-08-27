export function esMailValido(mail: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.trim())
}
