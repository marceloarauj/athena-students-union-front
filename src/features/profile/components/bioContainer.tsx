export type BioContainerProps = {
  children: React.ReactNode;
  className?: string;
};
export function BioContainer({ children, className }: BioContainerProps) {
  return <div className={`p-4 border border-dark-line rounded-md ${className}`}>{children}</div>;
}
