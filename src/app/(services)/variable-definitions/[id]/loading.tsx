import { Skeleton } from '@digdir/designsystemet-react';

export default function Loading() {
  return (
    <div className='container' style={{ paddingTop: '2rem' }}>
      <Skeleton variant='rectangle' width='100%' height={300} style={{ marginBottom: '2rem' }} />
      <Skeleton variant='rectangle' width='100%' height={600} />
    </div>
  );
}
