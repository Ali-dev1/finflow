interface BankInfo {
  name: string;
  logo?: string;
  color: string;
}

export function detectRussianBank(cardNumber: string): BankInfo | null {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  
  const banks: Record<string, BankInfo> = {
    '2200': { name: 'Mir', color: 'text-emerald-600' },
    '2201': { name: 'Mir', color: 'text-emerald-600' },
    '2202': { name: 'Mir', color: 'text-emerald-600' },
    '41': { name: 'Sberbank', color: 'text-blue-600' },
    '52': { name: 'Tinkoff', color: 'text-yellow-600' },
    '54': { name: 'Alfa-Bank', color: 'text-red-600' }
  };

  for (const [prefix, bank] of Object.entries(banks)) {
    if (cleanNumber.startsWith(prefix)) {
      return bank;
    }
  }
  return null;
}