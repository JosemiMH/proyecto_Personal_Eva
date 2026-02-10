import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import React, { Suspense } from "react";
import { AnimatePresence } from "framer-motion";

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
const BlogPostPage = React.lazy(() => import("@/pages/BlogPostPage"));
// const ResourcesPage = React.lazy(() => import("@/components/Resources")); // If using lazy, comment out check above

function Router() {
  const [location] = useLocation();
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AnimatePresence mode="wait">
        <Switch location={location} key={location}>
          <Route path="/">
            <Home />
          </Route>
          <Route path="/privacy">
            <Privacy />
          </Route>
          <Route path="/terms">
            <Terms />
          </Route>
          <Route path="/cookies">
            <Cookies />
          </Route>
          <Route path="/booking">
            <Booking />
          </Route>
          <Route path="/auth">
            <AuthPage />
          </Route>
          <ProtectedRoute path="/admin" component={Admin} />
          <Route path="/resources">
            <ResourcesPage />
          </Route>
          <Route path="/blog/:slug" component={BlogPostPage} />
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
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
