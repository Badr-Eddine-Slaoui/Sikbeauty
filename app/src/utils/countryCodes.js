import parsePhoneNumberFromString from 'libphonenumber-js';

export const COUNTRY_PHONE_CODES = [
  { code: '+212', country: 'Morocco', name: 'Maroc (+212)' },
  { code: '+33', country: 'France', name: 'France (+33)' },
  { code: '+32', country: 'Belgium', name: 'Belgique (+32)' },
  { code: '+41', country: 'Switzerland', name: 'Suisse (+41)' },
  { code: '+1', country: 'Canada', name: 'Canada (+1)' },
  { code: '+1', country: 'United States', name: 'United States (+1)' },
  { code: '+34', country: 'Spain', name: 'Espagne (+34)' },
  { code: '+39', country: 'Italy', name: 'Italie (+39)' },
  { code: '+49', country: 'Germany', name: 'Allemagne (+49)' },
  { code: '+44', country: 'United Kingdom', name: 'Royaume-Uni (+44)' },
  { code: '+213', country: 'Algeria', name: 'Algérie (+213)' },
  { code: '+216', country: 'Tunisia', name: 'Tunisie (+216)' },
  { code: '+221', country: 'Senegal', name: 'Sénégal (+221)' },
  { code: '+225', country: 'Ivory Coast', name: "Côte d'Ivoire (+225)" },
  { code: '+971', country: 'United Arab Emirates', name: 'Émirats Arabes Unis (+971)' },
  { code: '+966', country: 'Saudi Arabia', name: 'Arabie Saoudite (+966)' },
  { code: '+974', country: 'Qatar', name: 'Qatar (+974)' },
  { code: '+351', country: 'Portugal', name: 'Portugal (+351)' },
  { code: '+31', country: 'Netherlands', name: 'Pays-Bas (+31)' },
  { code: '+352', country: 'Luxembourg', name: 'Luxembourg (+352)' },
  { code: '+90', country: 'Turkey', name: 'Turquie (+90)' },
  { code: '+20', country: 'Egypt', name: 'Égypte (+20)' },
  { code: '+961', country: 'Lebanon', name: 'Liban (+961)' },
];

/**
 * Validates a phone number based on its country dial code.
 * @param {string} phoneCountryCode 
 * @param {string} phoneNumber 
 * @returns {boolean}
 */
export function validatePhoneForCode(phoneCountryCode, phoneNumber) {
  if (!phoneCountryCode || !phoneNumber) return false;
  // Clean phone number (strip whitespace, hyphens, parentheses)
  const cleanPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
  // Clean country code to have '+' at the beginning
  const cleanCode = phoneCountryCode.startsWith('+') ? phoneCountryCode : `+${phoneCountryCode}`;
  try {
    const phone = parsePhoneNumberFromString(cleanCode + cleanPhone);
    return phone ? phone.isValid() : false;
  } catch (error) {
    return false;
  }
}
