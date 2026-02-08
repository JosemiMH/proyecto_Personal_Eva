import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
// import { staticLocationHook } from "wouter/static-location";
import App from "./App";
import "./index.css";

import { QueryClient } from "@tanstack/react-query";

// Simple implementation of staticLocationHook to avoid build issues
const staticLocationHook = (path = "/") => () => [path, () => null] as [string, (to: string, options?: any) => void];

import * as HelmetAsync from 'react-helmet-async';
const { HelmetProvider } = HelmetAsync;

export function render(url: string) {
    const hook = staticLocationHook(url);
    const queryClient = new QueryClient(); // Simple client for SSR
    const helmetContext = {};

    const html = renderToString(
        <HelmetProvider context={helmetContext}>
            <Router hook={hook}>
                <App queryClient={queryClient} />
            </Router>
        </HelmetProvider>
    );
    return { html, helmetContext };
}
