import { Loader2 } from "lucide-react";

export default function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background/80 mobile-safe-area">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse text-sm font-medium">Cargando experiencia...</p>
            </div>
        </div>
    );
}
