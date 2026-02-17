export function sanitizeEmpresa(value: string | any): string {
    if (!value) return 'AQUANQA I'; // Default

    const normalized = value.toString().toLowerCase().trim();

    // AQUANQA I patterns
    if (
        normalized === '1' ||
        normalized === 'aquanqa 1' ||
        normalized === 'aquanqa i' ||
        normalized.includes('i') && normalized.includes('aquanqa') && !normalized.includes('ii')
    ) {
        return 'AQUANQA I';
    }

    // AQUANQA II patterns
    if (
        normalized === '2' ||
        normalized === 'aquanqa 2' ||
        normalized === 'aquanqa ii' ||
        normalized.includes('ii') && normalized.includes('aquanqa')
    ) {
        return 'AQUANQA II';
    }

    // Fallback or default
    return 'AQUANQA I';
}
