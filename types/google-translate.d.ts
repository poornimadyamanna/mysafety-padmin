export {};

declare global {
  interface GoogleTranslateElementConstructor {
    new (
      options: {
        pageLanguage: string;
        includedLanguages: string;
        layout?: unknown;
        autoDisplay?: boolean;
      },
      targetId: string,
    ): void;

    InlineLayout?: {
      SIMPLE?: unknown;
    };
  }

  interface Window {
    google?: {
      translate?: {
        TranslateElement: GoogleTranslateElementConstructor;
      };
    };

    googleTranslateElementInit?: () => void;
    __google_translate_inited_for?: string;
  }
}
