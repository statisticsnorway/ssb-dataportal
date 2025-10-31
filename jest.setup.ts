// Load extra matchers
import '@testing-library/jest-dom';

jest.mock('react-localization', () => ({
    __esModule: true,
    default: class {
        strings: any;
        header: { menu: string; contactUs: string; };
        footer: { privacyStatement: string; accessibility: string; };
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
        }
        setLanguage(lang: string) {
        }
    },
    LocalizedStringsMethods: class {},
}));
