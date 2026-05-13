"use client";
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from '@/utils/react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import ClientNavbar from '../../components/Client/ClientNavbar';
import PageLoader from '../../components/ui/PageLoader';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <ClientNavbar />
        <PageLoader label="Vérification du paiement..." />
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-brandWhite flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white border border-green-200 shadow-lg rounded-3xl px-6 sm:px-10 py-12">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle size={48} className="text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-l_black mb-3">
                Paiement réussi !
              </h1>
              <p className="font-montserrat text-lg text-gray-600 mb-2">
                Merci pour votre commande
              </p>
              <p className="font-montserrat text-sm text-gray-500">
                Votre paiement a été traité avec succès. Vous recevrez un email de confirmation sous peu.
              </p>
            </div>

            {/* Order Details */}
            {sessionId && (
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <Package size={20} className="text-brandRed mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-montserrat text-sm font-semibold text-l_black mb-1">
                      Référence de transaction
                    </p>
                    <p className="font-montserrat text-xs text-gray-600 break-all">
                      {sessionId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-montserrat text-sm font-semibold text-blue-900 mb-2">
                Prochaines étapes
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-blue-600 mt-1 shrink-0" />
                  <p className="font-montserrat text-sm text-blue-800">
                    Vous recevrez un email de confirmation avec les détails de votre commande
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-blue-600 mt-1 shrink-0" />
                  <p className="font-montserrat text-sm text-blue-800">
                    Votre commande sera traitée dans les plus brefs délais
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight size={16} className="text-blue-600 mt-1 shrink-0" />
                  <p className="font-montserrat text-sm text-blue-800">
                    Vous serez informé de l'expédition de votre colis
                  </p>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/client/products')}
                className="inline-flex items-center justify-center gap-2 bg-brandRed text-white px-8 py-3 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-semibold"
              >
                <Home size={20} />
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
