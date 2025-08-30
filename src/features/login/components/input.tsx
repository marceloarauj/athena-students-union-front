type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  password?: boolean;
};

export default function LoginInput({ password, ...props }: TextInputProps) {
  return (
    <div className='flex flex-row w-full'>
      <div className='w-1 h-full bg-primary rounded-l-md' />
      <input
        {...props}
        type={password ? 'password' : 'text'}
        className='outline-none bg-gray-300 border border-transparent focus:border-input-primary p-2 w-full transition duration-300 rounded-r-md'
      />
    </div>
  );
}
