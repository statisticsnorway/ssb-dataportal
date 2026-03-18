export default function Page() {
  // Avoid breaking the production build when Next.js prerenders pages, but still throw an error in development to test the error page.
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Testing error page');
  }
  return null;
}
