import React, { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import GoogleTranslateLoaderSafe from "./GoogleTranslateLoaderSafe";
import styles from "./language-selector.module.css";

interface Language {
    code: string;
    name: string;
    googleCode: string;
    flag: string;
}

const languages: Language[] = [
    { code: "EN", name: "English", googleCode: "en", flag: "🇬🇧" },
    { code: "HI", name: "Hindi", googleCode: "hi", flag: "🇮🇳" },
    { code: "TA", name: "Tamil", googleCode: "ta", flag: "🇮🇳" },
    { code: "TE", name: "Telugu", googleCode: "te", flag: "🇮🇳" },
    { code: "KN", name: "Kannada", googleCode: "kn", flag: "🇮🇳" },
    { code: "BN", name: "Bengali", googleCode: "bn", flag: "🇮🇳" },
    { code: "MR", name: "Marathi", googleCode: "mr", flag: "🇮🇳" },
    { code: "OR", name: "Odia", googleCode: "or", flag: "🇮🇳" },
];

const LanguageSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem("preferred_lang_code");
        if (saved) {
            const found = languages.find((l) => l.googleCode === saved);
            if (found) setSelectedLanguage(found);
        }
    }, []);

    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    const applyTranslation = (googleCode: string): boolean => {
        try {
            // SPECIAL CASE: Reset to English
            if (googleCode === "en") {
                document.cookie = `googtrans=/en/en;path=/;`;
                window.location.reload();
                return true;
            }

            const select = document.querySelector<HTMLSelectElement>(
                "#google_translate_element select"
            );

            if (select) {
                select.value = googleCode;
                select.dispatchEvent(new Event("change", { bubbles: true }));
                return true;
            }
        } catch { }

        // fallback
        try {
            const from = "en";
            const to = googleCode;
            document.cookie = `googtrans=/${from}/${to};path=/;`;
            window.location.reload();
            return true;
        } catch (e) {
            console.error("Fallback translation failed:", e);
            return false;
        }
    };

    const handleLanguageSelect = (googleCode: string): void => {
        const langObj = languages.find((l) => l.googleCode === googleCode);
        if (!langObj) return;

        setSelectedLanguage(langObj);
        localStorage.setItem("preferred_lang_code", googleCode);
        setIsOpen(false);

        setTimeout(() => {
            applyTranslation(googleCode);
        }, 150);
    };

    return (
        <>
            <div id="google_translate_element" style={{ display: "none" }} />

            <GoogleTranslateLoaderSafe
                targetId="google_translate_element"
                includedLanguages={languages.map((l) => l.googleCode).join(",")}
            />

            <div className={styles.container} ref={dropdownRef}>
                <div
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    aria-label="Select language"
                    onClick={() => setIsOpen((s) => !s)}
                    className={styles.toggleButton}
                >
                    <Globe className={styles.icon} />
                </div>

                {isOpen && (
                    <div className={styles.menu} role="menu" aria-label="Language menu">
                        {languages.map((language) => {
                            const isSelected = selectedLanguage.code === language.code;

                            return (
                                <button
                                    key={language.code}
                                    role="menuitemradio"
                                    aria-checked={isSelected}
                                    onClick={() => handleLanguageSelect(language.googleCode)}
                                    className={`${styles.menuItem} ${isSelected ? styles.selected : ""
                                        }`}
                                >
                                    <span className={styles.flag}>{language.flag}</span>

                                    <div className={styles.labelWrap}>
                                        <span className={styles.label}>{language.name}</span>
                                        <span className={styles.subLabel}>{language.code}</span>
                                    </div>

                                    {isSelected && <Check className={styles.check} />}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

export default LanguageSelector;
