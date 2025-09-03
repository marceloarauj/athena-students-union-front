type TitleProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
  tag?: 'h1' | 'h2' | 'h3';
};

export default function Title({ children, tag: Tag = 'h1', ...props }: TitleProps) {
  return (
    <Tag {...props} className={`text-2xl text-primary font-bold ${props.className}`}>
      {children}
    </Tag>
  );
}
