import { Card } from './Card';

const Widget = ({
  children,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={
        'flex w-full h-full flex-col items-start gap-0 border border-[#D6BE9B] rounded-[5px] bg-white py-0'
      }
    >
      {children}
    </Card>
  );
};

export { Widget };
