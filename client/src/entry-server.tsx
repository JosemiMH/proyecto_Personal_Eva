import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
// import { staticLocationHook } from "wouter/static-location";
import App from "./App";
import "./index.css";

import { QueryClient } from "@tanstack/react-query";

// Simple implementation of staticLocationHook to avoid build issues
const staticLocationHook = (path = "/") => () => [path, () => null] as [string, (to: string, options?: any) => void];

export function render(url: string) {
    const hook = staticLocationHook(url);
    const queryClient = new QueryClient(); // Simple client for SSR
    const html = renderToString(
        <Router hook={hook}>
            <App queryClient={queryClient} />
        </Router>
    );
    return { html };
}
