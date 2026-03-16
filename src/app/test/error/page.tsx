export default function Page() {
  if (process.env.NODE_ENV !== 'production') {
    throw new Error('Testing error page');
  }
  return null;
}
