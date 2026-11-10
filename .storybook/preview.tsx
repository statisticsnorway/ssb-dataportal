import type { Preview } from '@storybook/nextjs-vite';
import { AuthProvider } from '../src/app/authContext';
import { openSans, roboto, robotoCondensed } from '../src/app/fonts';
import '../src/app/global.css';

const preview: Preview = {
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    (Story) => (
      <AuthProvider isAuthenticated={false}>
        <div className={`${openSans.variable} ${roboto.variable} ${robotoCondensed.variable}`} data-color='secondary'>
          <Story />
        </div>
      </AuthProvider>
    ),
  ],
};

export default preview;
