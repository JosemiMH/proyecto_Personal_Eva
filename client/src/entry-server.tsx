import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { PassThrough } from "node:stream";
import { Router } from "wouter";
// import { staticLocationHook } from "wouter/static-location";
import App from "./App";
import "./index.css";

import { QueryClient } from "@tanstack/react-query";
import { seedQueryClient, type InitialQueryData } from "./lib/ssrData";

import { HelmetProvider } from "react-helmet-async";

export function render(url: string, initialData: InitialQueryData = {}) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                queryFn: async () => {
                    throw new Error("Missing preloaded data for an SSR query");
                },
                staleTime: Infinity,
                retry: false,
            },
        },
    });
    seedQueryClient(queryClient, initialData);
    queryClient.setQueryData(["/api/user"], null);

    const helmetContext: Record<string, unknown> = {};
    const app = (
        <HelmetProvider context={helmetContext}>
            <Router ssrPath={url}>
                <App queryClient={queryClient} />
            </Router>
        </HelmetProvider>
    );

    return new Promise<{ html: string; helmetContext: Record<string, unknown> }>((resolve, reject) => {
        let settled = false;
        let timeout: NodeJS.Timeout | undefined;
        const output = new PassThrough();
        const chunks: Buffer[] = [];

        const finishWithError = (error: unknown) => {
            if (settled) return;
            settled = true;
            if (timeout) clearTimeout(timeout);
            queryClient.clear();
            reject(error instanceof Error ? error : new Error(String(error)));
        };

        output.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        output.on("error", finishWithError);
        output.on("end", () => {
            if (settled) return;
            settled = true;
            if (timeout) clearTimeout(timeout);
            const html = Buffer.concat(chunks).toString("utf-8");
            queryClient.clear();
            resolve({ html, helmetContext });
        });

        const stream = renderToPipeableStream(app, {
            onAllReady() {
                stream.pipe(output);
            },
            onShellError: finishWithError,
            onError(error) {
                console.error("SSR render error:", error);
            },
        });

        timeout = setTimeout(() => {
            stream.abort();
            finishWithError(new Error("SSR render timed out"));
        }, 15_000);
    });
}
