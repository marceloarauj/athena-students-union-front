import Title from '@/components/ui/title';

type InfoContainerProps = {
  label: string;
  value: string;
};

export default function InfoContainer({ label, value }: InfoContainerProps) {
  return (
    <div className='flex flex-col'>
      <Title tag='h6'>{label}</Title>
      <span className='font-bold'>{value}</span>
      <div className='border-b w-full border-primary'></div>
    </div>
  );
}
