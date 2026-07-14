import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import SEO from "@/components/SEO";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const [location] = useLocation();
  const { language } = useLanguage();
  const isSpanish = language === "es";

  return (
    <>
      <SEO
        title={isSpanish ? "Página no encontrada" : "Page not found"}
        description={isSpanish
          ? "La página solicitada no existe o ha cambiado de dirección."
          : "The requested page does not exist or has moved."}
        url={location}
        noIndex
        language={language}
      />
      <main className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                {isSpanish ? "404 · Página no encontrada" : "404 · Page not found"}
              </h1>
            </div>

            <p className="mt-4 text-sm text-gray-600">
              {isSpanish
                ? "La dirección solicitada no existe o ha cambiado."
                : "The requested address does not exist or has moved."}
            </p>
            <Link href="/" className="inline-block mt-6 text-turquoise hover:underline">
              {isSpanish ? "Volver a la página principal" : "Return to the home page"}
            </Link>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
