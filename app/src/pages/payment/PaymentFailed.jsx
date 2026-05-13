"use client";
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from '@/utils/react-router-dom';
import { XCircle, AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';
import ClientNavbar from '../../components/Client/ClientNavbar';
import PageLoader from '../../components/ui/PageLoader';

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <ClientNavbar />
        <PageLoader label="Vérification..." />
      </>
    );
  }

  return (
    <>
      <ClientNavbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-brandWhite flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-2xl">
          <div className="bg-white border border-red-200 shadow-lg rounded-3xl px-6 sm:px-10 py-12">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={48} className="text-red-600" />
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-8">
              <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-l_black mb-3">
                Paiement annulé
              </h1>
              <p className="font-montserrat text-lg text-gray-600 mb-2">
                Votre paiement n'a pas été effectué
              </p>
              <p className="font-montserrat text-sm text-gray-500">
                Votre commande n'a pas été finalisée. Aucun montant n'a été débité de votre compte.
              </p>
            </div>

            {/* Session Info */}
            {sessionId && (
              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={20} className="text-amber-600 mt-1 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-montserrat text-sm font-semibold text-l_black mb-1">
                      Référence de session
                    </p>
                    <p className="font-montserrat text-xs text-gray-600 break-all">
                      {sessionId}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reasons */}
            <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <h3 className="font-montserrat text-sm font-semibold text-amber-900 mb-2">
                Raisons possibles
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 shrink-0">•</span>
                  <p className="font-montserrat text-sm text-amber-800">
                    Vous avez annulé le paiement
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 shrink-0">•</span>
                  <p className="font-montserrat text-sm text-amber-800">
                    La session de paiement a expiré
                  </p>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1 shrink-0">•</span>
                  <p className="font-montserrat text-sm text-amber-800">
                    Un problème technique est survenu
                  </p>
                </li>
              </ul>
            </div>

            {/* What to do next */}
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h3 className="font-montserrat text-sm font-semibold text-blue-900 mb-2">
                Que faire maintenant ?
              </h3>
              <p className="font-montserrat text-sm text-blue-800">
                Vous pouvez retourner à votre panier et réessayer le paiement, ou continuer vos achats.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/cart')}
                className="inline-flex items-center justify-center gap-2 bg-brandRed text-white px-8 py-3 rounded-full hover:bg-hoverBrandRed transition-colors duration-300 font-montserrat font-semibold"
              >
                <RefreshCw size={20} />
                Retourner au panier
              </button>
              <button
                onClick={() => navigate('/client/products')}
                className="inline-flex items-center justify-center gap-2 bg-white border-2 border-brandRed text-brandRed px-8 py-3 rounded-full hover:bg-brandRed/5 transition-colors duration-300 font-montserrat font-semibold"
              >
                <ArrowLeft size={20} />
                Continuer mes achats
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
