import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import { 
  Notification as NotificationType,
  subscribeToNotifications,
  removeNotification
} from '../../utils/notifications';

// Individual notification component
const NotificationItem: React.FC<{ notification: NotificationType }> = ({ notification }) => {
  const { id, type, message } = notification;
  
  const bgColors = {
    success: 'bg-green-500/10 border-green-500',
    error: 'bg-red-500/10 border-red-500',
    warning: 'bg-yellow-500/10 border-yellow-500',
    info: 'bg-blue-500/10 border-blue-500',
  };
  
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
  };
  
  return (
    <div 
      className={`flex items-start p-4 rounded-lg border ${bgColors[type]} mb-2 animate-fadeIn`}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3">
        {icons[type]}
      </div>
      <div className="flex-grow">
        <div className="text-sm">{message}</div>
      </div>
      <button 
        onClick={() => removeNotification(id)}
        className="ml-3 flex-shrink-0 text-slate-400 hover:text-slate-100 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// Notification container component
export const NotificationContainer: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  
  useEffect(() => {
    // Subscribe to notification changes
    const unsubscribe = subscribeToNotifications(setNotifications);
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);
  
  if (notifications.length === 0) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50 w-80 max-w-full">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
};

export default NotificationContainer;