import config from './playwright.config';

export default {
  ...config,
  webServer: [
    {
      name: 'authenticated',
      url: 'http://localhost:3000',
      command: 'node -e "setInterval(() => {}, 1 << 30)"',
      reuseExistingServer: true,
    },
    {
      name: 'unauthenticated',
      url: 'http://localhost:8000',
      command: 'node -e "setInterval(() => {}, 1 << 30)"',
      reuseExistingServer: true,
    },
  ],
};
