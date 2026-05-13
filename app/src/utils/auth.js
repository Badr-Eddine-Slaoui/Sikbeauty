export const getDashboardPath = (role) => {
  if (!role || typeof role !== 'string') {
    console.warn('No role provided, redirecting to home');
    return '/';
  }
  
  // Normalize role to handle case variations
  const normalizedRole = role.toLowerCase();
  
  switch (normalizedRole) {
    case 'admin':
      return '/admin/dashboard';
    case 'professional':
      return '/professional/dashboard';
    case 'individual':
      return '/client/products';
    default:
      // Log for debugging
      console.warn('Unknown role:', role, 'normalized:', normalizedRole, 'redirecting to home');
      return '/';
  }
};
