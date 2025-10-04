export type BioContainerProps = {
  children: React.ReactNode;
  className?: string;
};
export function BioContainer({ children, className = '' }: BioContainerProps) {
  const hasPaddingClass = /(^|\s)p[xylrtb]?-\d+/.test(className);
  const paddingClass = hasPaddingClass ? '' : 'p-4';

  return (
    <div className={`${paddingClass} border border-dark-line rounded-md ${className}`.trim()}>
      {children}
    </div>
  );
}
