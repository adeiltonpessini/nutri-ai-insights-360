import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, AlertTriangle, CheckCircle, Info, TrendingUp } from "lucide-react";

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'performance';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

interface NotificationToastProps {
  className?: string;
}

export function NotificationToast({ className }: NotificationToastProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Conversão alimentar em queda',
      message: 'Lote Fazenda São João apresentou redução de 8% na conversão',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      action: {
        label: 'Ver detalhes',
        href: '/diagnostico'
      }
    },
    {
      id: '2',
      type: 'success',
      title: 'Formulação otimizada',
      message: 'Nova formulação para crescimento aprovada e ativa',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      action: {
        label: 'Ver formulação',
        href: '/simulador'
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'Relatório mensal disponível',
      message: 'Relatório de sustentabilidade de Dezembro foi gerado',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true
    },
    {
      id: '4',
      type: 'performance',
      title: 'Meta de eficiência atingida',
      message: 'Propriedade Santa Clara alcançou 95% de eficiência',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'performance':
        return <TrendingUp className="w-4 h-4 text-tech-blue" />;
      default:
        return <Info className="w-4 h-4 text-primary" />;
    }
  };

  const getBadgeVariant = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'default';
      case 'warning':
        return 'destructive';
      case 'performance':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours === 1) return 'há 1 hora';
    if (diffInHours < 24) return `há ${diffInHours} horas`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'há 1 dia';
    return `há ${diffInDays} dias`;
  };

  useEffect(() => {
    // Simular novas notificações
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          id: Date.now().toString(),
          type: 'info' as const,
          title: 'Lote atualizado',
          message: 'Dados de peso médio atualizados automaticamente',
          timestamp: new Date(),
          read: false
        },
        {
          id: (Date.now() + 1).toString(),
          type: 'performance' as const,
          title: 'Melhoria detectada',
          message: 'Conversão alimentar melhorou 3% na última semana',
          timestamp: new Date(),
          read: false
        }
      ];

      if (Math.random() > 0.7) {
        const newNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)];
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Button 
        variant="ghost" 
        size="sm"
        className="relative hover:bg-accent/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center animate-pulse-glow"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-hidden z-50 shadow-strong animate-scale-in">
          <div className="p-4 border-b bg-gradient-primary text-primary-foreground">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notificações</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-primary-foreground hover:bg-primary-foreground/20 text-xs"
                    onClick={markAllAsRead}
                  >
                    Marcar todas
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-primary-foreground hover:bg-primary-foreground/20 p-1"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`p-4 hover:bg-accent/30 transition-smooth cursor-pointer ${
                      !notification.read ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 hover:bg-destructive/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                          >
                            <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                          {notification.action && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-xs h-6 px-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = notification.action!.href;
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}