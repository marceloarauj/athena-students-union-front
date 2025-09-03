type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className='bg-primary [letter-spacing:0.3em] hover:bg-primary-hover transition duration-300 cursor-pointer text-white rounded-md p-2 w-full'
    >
      {children}
    </button>
  );
}
