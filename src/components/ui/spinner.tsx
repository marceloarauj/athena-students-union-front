export default function Spinner() {
  return (
    <div className='flex justify-center items-center'>
      <div
        style={{ animationDuration: '650ms' }}
        className='animate-spin rounded-full h-5 w-5 border border-t-transparent border-b-transparent border-primary'
      ></div>
    </div>
  );
}
