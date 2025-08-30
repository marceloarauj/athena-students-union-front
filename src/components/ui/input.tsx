type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  password?: boolean;
};

export default function TextInput({ password, ...props }: TextInputProps) {
  return (
    <div className='flex flex-row relative w-full'>
      <input
        {...props}
        type={password ? 'password' : 'text'}
        className='border-2 border-input-primary rounded-md p-2 w-full'
      />
    </div>
  );
}
