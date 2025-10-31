// Load extra matchers
import '@testing-library/jest-dom';

jest.mock('react-localization', () => ({
    __esModule: true,
    default: class {
        strings: any;
        header: { menu: string; contactUs: string; };
        footer: { privacyStatement: string; accessibility: string; };
        concept: { noName: string };
        currentLanguage: string;
        constructor(strings: any) {
            this.strings = strings;
            this.header = {
                menu: 'Meny',
                contactUs: 'Kontakt oss',
            };
            this.footer = {
                privacyStatement: 'Personvernerklæring',
                accessibility: 'Tilgjengelighet',
            };
            this.concept = {
                noName: 'Uten navn', // 👈 add this
            };
            this.currentLanguage = 'nb';
        }
        setLanguage(lang: string) {
            this.currentLanguage = lang;
        }
        getLanguage() {
            return this.currentLanguage;
        }
    },
    LocalizedStringsMethods: class {},
}));
