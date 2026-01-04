import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import React, { Suspense } from "react";

import ResourcesPage from "@/components/Resources"; // Ensure this is imported if used directly or lazily
// Restore missing imports
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import CookieConsent from "@/components/CookieConsent";
import ChatBot from "@/components/ChatBot";
import ScrollToTop from "@/components/ScrollToTop";

// Lazy load heavy components
const Home = React.lazy(() => import("@/pages/Home"));
const Privacy = React.lazy(() => import("@/pages/Privacy"));
const Terms = React.lazy(() => import("@/pages/Terms"));
const Cookies = React.lazy(() => import("@/pages/Cookies"));
const Booking = React.lazy(() => import("@/pages/Booking"));
const Admin = React.lazy(() => import("@/pages/Admin"));
const AuthPage = React.lazy(() => import("@/pages/Auth"));
// const ResourcesPage = React.lazy(() => import("@/components/Resources")); // If using lazy, comment out check above

function Router() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/cookies" component={Cookies} />
        <Route path="/booking" component={Booking} />
        <Route path="/auth" component={AuthPage} />
        <ProtectedRoute path="/admin" component={Admin} />
        <Route path="/resources" component={ResourcesPage} />
        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default function App({ queryClient: propsClient }: { queryClient?: any }) {
  const client = propsClient || queryClient;
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <LanguageProvider>
          <Router />
          <ChatBot />
          <CookieConsent />
          <ScrollToTop />
          <Toaster />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
