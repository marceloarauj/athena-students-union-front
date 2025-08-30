type HeaderProps = React.HTMLAttributes<HTMLHeadingElement> & {
  children: React.ReactNode;
  tag?: 'h1' | 'h2' | 'h3';
};

export default function Header({ children, tag: Tag = 'h1', ...props }: HeaderProps) {
  return (
    <Tag {...props} className={`text-2xl text-primary font-bold ${props.className}`}>
      {children}
    </Tag>
  );
}
