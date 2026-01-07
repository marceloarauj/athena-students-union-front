export default function Spinner() {
  return (
    <div>
      <div
        style={{ animationDuration: '650ms' }}
        className='animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-b-transparent border-primary'
      ></div>
    </div>
  );
}

export function SpinnerContainer() {
  return (
    <div className='flex items-center justify-center w-screen h-screen'>
      <Spinner />
    </div>
  );
}
