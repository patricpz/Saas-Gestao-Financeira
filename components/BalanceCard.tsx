

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BalanceCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color?: string;
  subtitle?: string;
  trend?: string;
  trendClassName?: string;
  className?: string;
}

export function BalanceCard({ 
  title, 
  value, 
  icon, 
  color = 'text-muted-foreground',
  subtitle,
  trend,
  trendClassName = 'text-muted-foreground',
  className
}: BalanceCardProps) {
  return (
    <Card className={cn('h-full rounded-2xl shadow-sm', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {trend ? <p className={cn('text-xs font-semibold', trendClassName)}>{trend}</p> : null}
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-4xl font-bold text-slate-900">
            {value}
          </div>
          <div className={cn('rounded-full bg-blue-50 p-2', color)}>
          {icon}
          </div>
        </div>
        {subtitle ? <p className="text-sm text-slate-500">{subtitle}</p> : null}
      </CardContent>
    </Card>
  );
}
