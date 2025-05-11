// Utility to format amounts as Russian Rubles (RUB)
export function formatRUB(amount: number): string {
  // Use Intl.NumberFormat for Russian locale with 2 decimals
  // Non-breaking spaces (U+00A0) for thousand separators
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  })
    .format(amount)
    .replace(/\s/g, '\u00A0') + '\u00A0₽'; // Append RUB symbol
}