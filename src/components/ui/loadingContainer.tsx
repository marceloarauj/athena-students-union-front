import Spinner from './spinner';

type LoadingContainerProps = {
  loading: boolean;
  children: React.ReactNode;
};

export default function LoadingContainer({ loading, children }: LoadingContainerProps) {
  return (
    <div className='relative w-full h-full'>
      {loading && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/80 z-50'>
          <div className='flex flex-col items-center gap-2'>
            <Spinner />
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
