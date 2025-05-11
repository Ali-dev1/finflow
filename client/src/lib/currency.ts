export function formatRUB(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(amount).replace(/\s/g, '\u00A0') + '\u00A0₽';
}

export function parseRUBInput(value: string): number {
  return parseFloat(value.replace(',', '.')) || 0;
}