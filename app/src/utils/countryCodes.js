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
  { code: '+353', country: 'Ireland', name: 'Irlande (+353)' },
  { code: '+43', country: 'Austria', name: 'Autriche (+43)' },
  { code: '+45', country: 'Denmark', name: 'Danemark (+45)' },
  { code: '+46', country: 'Sweden', name: 'Suède (+46)' },
  { code: '+47', country: 'Norway', name: 'Norvège (+47)' },
  { code: '+358', country: 'Finland', name: 'Finlande (+358)' },
  { code: '+48', country: 'Poland', name: 'Pologne (+48)' },
  { code: '+30', country: 'Greece', name: 'Grèce (+30)' },
  { code: '+380', country: 'Ukraine', name: 'Ukraine (+380)' },
  { code: '+40', country: 'Romania', name: 'Roumanie (+40)' },
  { code: '+370', country: 'Lithuania', name: 'Lituanie (+370)' },
  { code: '+371', country: 'Latvia', name: 'Lettonie (+371)' },
  { code: '+372', country: 'Estonia', name: 'Estonie (+372)' },
  { code: '+852', country: 'Hong Kong', name: 'Hong Kong (+852)' },
  { code: '+81', country: 'Japan', name: 'Japon (+81)' },
  { code: '+82', country: 'South Korea', name: 'Corée du Sud (+82)' },
  { code: '+86', country: 'China', name: 'Chine (+86)' },
  { code: '+91', country: 'India', name: 'Inde (+91)' },
  { code: '+65', country: 'Singapore', name: 'Singapour (+65)' },
  { code: '+61', country: 'Australia', name: 'Australie (+61)' },
  { code: '+64', country: 'New Zealand', name: 'Nouvelle-Zélande (+64)' },
  { code: '+55', country: 'Brazil', name: 'Brésil (+55)' },
  { code: '+52', country: 'Mexico', name: 'Mexique (+52)' },
  { code: '+27', country: 'South Africa', name: 'Afrique du Sud (+27)' },
  { code: '+234', country: 'Nigeria', name: 'Nigeria (+234)' },
  { code: '+254', country: 'Kenya', name: 'Kenya (+254)' },
  { code: '+218', country: 'Libya', name: 'Libye (+218)' },
  { code: '+962', country: 'Jordan', name: 'Jordanie (+962)' },
  { code: '+965', country: 'Kuwait', name: 'Koweït (+965)' },
  { code: '+968', country: 'Oman', name: 'Oman (+968)' },
  { code: '+973', country: 'Bahrain', name: 'Bahreïn (+973)' },
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
