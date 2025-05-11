// Utility to detect Russian banks from card numbers
export function detectRussianBank(cardNumber: string): string | null {
  // Remove non-digits from card number
  const cleanNumber = cardNumber.replace(/\D/g, '');

  // Map of bank prefixes to names
  const bankPrefixes: Record<string, string> = {
    '2200': 'Mir', // Mir card (National Payment System)
    '2201': 'Mir',
    '2202': 'Mir',
    '2203': 'Mir',
    '2204': 'Mir',
    '41': 'Sberbank', // Sberbank standard
    '43': 'Sberbank Premium', // Sberbank premium
    '52': 'Tinkoff', // Tinkoff Bank
    '54': 'Alfa-Bank', // Alfa-Bank
    '67': 'Raiffeisenbank', // Raiffeisenbank
  };

  // Check if card number starts with a known prefix
  for (const [prefix, bank] of Object.entries(bankPrefixes)) {
    if (cleanNumber.startsWith(prefix)) {
      return bank;
    }
  }
  return null; // No bank detected
}