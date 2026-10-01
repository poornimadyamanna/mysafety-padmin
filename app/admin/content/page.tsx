import ContentEditor from "@/components/admin/content-editor";

const EMPTY_CONTENT: Record<string, string> = { en: "" };

const ContentManagementPage = async () => {
    const BASE_URL = process.env.API_URL;

    let termsData: Record<string, string> = EMPTY_CONTENT;
    let privacyData: Record<string, string> = EMPTY_CONTENT;

    try {
        const [termsRes, privacyRes] = await Promise.all([
            fetch(`${BASE_URL}/admin/content?field=terms`, {
                cache: "no-store",
            }),
            fetch(`${BASE_URL}/admin/content?field=privacyPolicy`, {
                cache: "no-store",
            }),
        ]);

        if (termsRes.ok) {
            const termsJson = await termsRes.json();
            termsData = termsJson?.data ?? EMPTY_CONTENT;
        }

        if (privacyRes.ok) {
            const privacyJson = await privacyRes.json();
            privacyData = privacyJson?.data ?? EMPTY_CONTENT;
        }
    } catch (err) {
        console.error("Failed to fetch content", err);
    }

    return (
        <ContentEditor
            terms={termsData}
            privacyPolicy={privacyData}
        />
    );
};

export default ContentManagementPage;
