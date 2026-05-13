"use client";
import { Link } from '@/utils/react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export default function CartIcon() {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <Link
      to="/cart"
      className="relative flex items-center justify-center p-2 text-l_black hover:text-brandRed transition-colors duration-300"
      title="Shopping Cart"
    >
      <ShoppingCart size={24} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-brandRed text-white text-xs font-montserrat font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}

