import { ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string | ReactNode;
  duration?: number;
}

// In-memory store for active notifications
let notifications: Notification[] = [];
let listeners: ((notifications: Notification[]) => void)[] = [];

// Generate a unique ID for notifications
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Notify listeners of changes
const notifyListeners = (): void => {
  listeners.forEach(listener => listener([...notifications]));
};

// Add a notification
export const addNotification = (
  message: string | ReactNode,
  type: NotificationType = 'info',
  duration: number = 5000
): string => {
  const id = generateId();
  const notification: Notification = { id, type, message, duration };
  
  notifications = [...notifications, notification];
  notifyListeners();
  
  // Auto-remove after duration (if duration > 0)
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, duration);
  }
  
  return id;
};

// Remove a notification by ID
export const removeNotification = (id: string): void => {
  notifications = notifications.filter(notification => notification.id !== id);
  notifyListeners();
};

// Clear all notifications
export const clearNotifications = (): void => {
  notifications = [];
  notifyListeners();
};

// Subscribe to notification changes
export const subscribeToNotifications = (
  callback: (notifications: Notification[]) => void
): () => void => {
  listeners.push(callback);
  
  // Return unsubscribe function
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
};

// Convenience methods for different notification types
export const showSuccess = (message: string | ReactNode, duration?: number): string => 
  addNotification(message, 'success', duration);

export const showError = (message: string | ReactNode, duration?: number): string => 
  addNotification(message, 'error', duration);

export const showInfo = (message: string | ReactNode, duration?: number): string => 
  addNotification(message, 'info', duration);

export const showWarning = (message: string | ReactNode, duration?: number): string => 
  addNotification(message, 'warning', duration);