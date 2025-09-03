export default function Spinner() {
  return (
    <div className='flex justify-center items-center'>
      <div
        style={{ animationDuration: '650ms' }}
        className='animate-spin rounded-full h-6 w-6 border-2 border-t-transparent border-b-transparent border-primary'
      ></div>
    </div>
  );
}
