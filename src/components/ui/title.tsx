type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  defaultFont?: boolean;
};

export default function Title({
  children,
  tag: Tag = 'h1',
  defaultFont = false,
  ...props
}: TitleProps) {
  return (
    <Tag
      {...props}
      className={`text-2xl ${defaultFont ? '' : 'text-primary'} font-bold ${props.className}`}
    >
      {children}
    </Tag>
  );
}
