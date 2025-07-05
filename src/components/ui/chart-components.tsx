import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from "lucide-react";

interface ChartData {
  name: string;
  value: number;
  change?: number;
  color?: string;
}

interface MiniChartProps {
  title: string;
  data: ChartData[];
  type: 'line' | 'bar' | 'pie';
  variant?: 'default' | 'tech' | 'success' | 'warning';
}

export function MiniChart({ title, data, type, variant = 'default' }: MiniChartProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'tech':
        return 'bg-tech-blue/5 border-tech-blue/20';
      case 'success':
        return 'bg-success/5 border-success/20';
      case 'warning':
        return 'bg-warning/5 border-warning/20';
      default:
        return 'bg-primary/5 border-primary/20';
    }
  };

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <Card className={`${getVariantClasses()} hover:shadow-medium transition-smooth`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {type === 'line' && <Activity className="w-4 h-4" />}
          {type === 'bar' && <BarChart3 className="w-4 h-4" />}
          {type === 'pie' && <PieChart className="w-4 h-4" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color || `hsl(var(--primary))` }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.value}</span>
                {item.change !== undefined && (
                  <Badge variant={item.change >= 0 ? "default" : "destructive"} className="text-xs">
                    {item.change >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(item.change)}%
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {type === 'bar' && (
          <div className="mt-4 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{item.name}</span>
                  <span>{item.value}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor: item.color || `hsl(var(--primary))`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {type === 'line' && (
          <div className="mt-4 h-16 flex items-end space-x-1">
            {data.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full transition-all duration-1000 ease-out rounded-t"
                  style={{ 
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.color || `hsl(var(--primary))`,
                    minHeight: '4px'
                  }}
                />
                <span className="text-xs text-muted-foreground mt-1">{item.name.slice(0, 3)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  suffix?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'tech' | 'success' | 'warning';
  description?: string;
}

export function KPICard({ 
  title, 
  value, 
  change, 
  suffix, 
  icon: Icon, 
  variant = 'default',
  description 
}: KPICardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'tech':
        return 'bg-gradient-tech text-tech-blue-foreground';
      case 'success':
        return 'bg-gradient-to-br from-success to-success/80 text-success-foreground';
      case 'warning':
        return 'bg-gradient-to-br from-warning to-warning/80 text-warning-foreground';
      default:
        return 'bg-gradient-primary text-primary-foreground';
    }
  };

  return (
    <Card className={`${getVariantClasses()} border-0 shadow-medium hover:shadow-strong transition-smooth animate-fade-in`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium opacity-90">{title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold">
                {value}
              </p>
              {suffix && <span className="text-sm opacity-75">{suffix}</span>}
            </div>
            {description && (
              <p className="text-xs opacity-75">{description}</p>
            )}
            {change !== undefined && (
              <div className="flex items-center gap-1">
                {change >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="text-xs font-medium">
                  {change > 0 ? '+' : ''}{change}% vs mês anterior
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-2 bg-white/20 rounded-lg">
              <Icon className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  children?: React.ReactNode;
  color?: string;
}

export function ProgressRing({ 
  value, 
  max = 100, 
  size = 'md', 
  strokeWidth = 8, 
  children,
  color = "hsl(var(--primary))"
}: ProgressRingProps) {
  const sizeMap = {
    sm: 60,
    md: 80,
    lg: 120
  };
  
  const radius = (sizeMap[size] - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = (value / max) * 100;
  const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={sizeMap[size]}
        height={sizeMap[size]}
        className="transform -rotate-90"
      >
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <circle
          cx={sizeMap[size] / 2}
          cy={sizeMap[size] / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children || (
          <div className="text-center">
            <div className="text-lg font-bold">{Math.round(percentage)}%</div>
          </div>
        )}
      </div>
    </div>
  );
}