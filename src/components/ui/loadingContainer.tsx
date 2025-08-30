type LoadingContainerProps = {
  children: React.ReactNode;
};

export default function LoadingContainer({ children }: LoadingContainerProps) {
  return <div className='w-100 h-100'>{children}</div>;
}
