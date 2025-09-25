

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
  className?: string;
}

export function BalanceCard({ 
  title, 
  value, 
  icon, 
  color = 'text-muted-foreground',
  className
}: BalanceCardProps) {
  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn('p-2 rounded-full bg-muted', color)}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn('text-2xl font-bold', color)}>
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
