declare module 'language-list' {
    export type LanguageData = {
        language: string;
        code: string;
    };

    // Adjust this as needed based on the library's structure
    export default function languages(): {
        getData: () => LanguageData[];
    };
}
