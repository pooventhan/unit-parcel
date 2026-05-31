/**
 * Validate if a barcode contains only alphanumeric characters
 * @param barcode - The barcode string to validate
 * @returns Object with isValid boolean and error message
 */
export function validateBarcode(barcode: string): { isValid: boolean; error?: string } {
  if (!barcode || barcode.trim().length === 0) {
    return {
      isValid: false,
      error: 'Barcode cannot be empty',
    };
  }

  const trimmedBarcode = barcode.trim();

  // Check if barcode contains only alphanumeric characters
  if (!/^[a-zA-Z0-9]+$/.test(trimmedBarcode)) {
    return {
      isValid: false,
      error: 'Barcode must contain only letters and numbers',
    };
  }

  return {
    isValid: true,
  };
}

/**
 * Check if a string contains only alphanumeric characters
 * @param text - The text to check
 * @returns true if alphanumeric, false otherwise
 */
export function isAlphanumeric(text: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(text);
}
