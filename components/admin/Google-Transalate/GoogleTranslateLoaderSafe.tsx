import { useEffect } from "react";

const SCRIPT_URL =
    "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

interface GoogleTranslateLoaderSafeProps {
    targetId?: string;
    includedLanguages?: string;
    timeoutMs?: number;
    pollInterval?: number;
}

const GoogleTranslateLoaderSafe: React.FC<GoogleTranslateLoaderSafeProps> = ({
    targetId = "google_translate_element",
    includedLanguages = "en,fr",
    timeoutMs = 15000,
    pollInterval = 250,
}) => {
    useEffect(() => {
        let cancelled = false;

        if (window.__google_translate_inited_for === targetId) return;

        const tryInit = (): boolean => {
            try {
                const TranslateElement =
                    window.google?.translate?.TranslateElement;
                if (!TranslateElement) return false;

                const opts: {
                    pageLanguage: string;
                    includedLanguages: string;
                    layout?: unknown;
                } = {
                    pageLanguage: "en",
                    includedLanguages,
                };

                const InlineLayout = TranslateElement.InlineLayout;
                if (InlineLayout?.SIMPLE !== undefined) {
                    opts.layout = InlineLayout.SIMPLE;
                }

                new TranslateElement(opts, targetId);
                window.__google_translate_inited_for = targetId;
                return true;
            } catch {
                return false;
            }
        };

        if (!window.googleTranslateElementInit) {
            window.googleTranslateElementInit = () => {
                tryInit();
            };
        }

        if (
            !document.querySelector(
                `script[src^="https://translate.google.com/translate_a/element.js"]`
            )
        ) {
            const script = document.createElement("script");
            script.src = SCRIPT_URL;
            script.async = true;
            script.defer = true;
            script.onload = () => tryInit();
            script.onerror = (e) =>
                console.error("Failed to load Google Translate script:", e);

            document.body.appendChild(script);
        } else {
            tryInit();
        }

        const start = Date.now();
        const intervalId = window.setInterval(() => {
            if (cancelled) {
                clearInterval(intervalId);
                return;
            }

            if (window.__google_translate_inited_for === targetId) {
                clearInterval(intervalId);
                return;
            }

            if (tryInit()) {
                clearInterval(intervalId);
                return;
            }

            if (Date.now() - start > timeoutMs) {
                clearInterval(intervalId);
                console.warn(
                    `Google Translate init delayed beyond ${timeoutMs}ms (safe to ignore)`
                );
            }

        }, pollInterval);

        return () => {
            cancelled = true;
        };
    }, [targetId, includedLanguages, timeoutMs, pollInterval]);

    return null;
};

export default GoogleTranslateLoaderSafe;
