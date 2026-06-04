type InfoContainerProps = {
  label: string;
  value: string;
};

export default function InfoContainer({ label, value }: InfoContainerProps) {
  return (
    <div className='space-y-0.5 pb-3 border-b border-border last:border-0 last:pb-0'>
      <p className='text-xs font-medium text-primary'>{label}</p>
      <p className='text-sm font-semibold text-foreground'>{value || '—'}</p>
    </div>
  );
}
