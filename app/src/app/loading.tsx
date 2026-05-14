export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-brandRed border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-brandRed font-montserrat font-medium animate-pulse">Chargement...</p>
      </div>
    </div>
  );
}
