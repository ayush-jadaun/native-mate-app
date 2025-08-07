import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  createContext,
  useContext,
} from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Dimensions,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";

// Get screen dimensions
const { width: screenWidth } = Dimensions.get("window");

// Responsive utility functions
const getResponsiveValue = <T,>(small: T, medium: T, large: T): T => {
  if (screenWidth < 480) return small;
  if (screenWidth < 768) return medium;
  return large;
};

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition = "top" | "bottom" | "center";

export interface ToastProps {
  /**
   * Toast message
   */
  message: string;

  /**
   * Toast type
   * @default 'info'
   */
  type?: ToastType;

  /**
   * Toast position
   * @default 'top'
   */
  position?: ToastPosition;

  /**
   * Auto dismiss duration (0 to disable)
   * @default 4000
   */
  duration?: number;

  /**
   * Show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Toast visible state
   */
  visible: boolean;

  /**
   * Callback when toast is dismissed
   */
  onDismiss: () => void;

  /**
   * Custom icon component
   */
  icon?: React.ReactNode;

  /**
   * Custom container style
   */
  style?: ViewStyle;

  /**
   * Custom text style
   */
  textStyle?: TextStyle;

  /**
   * Test ID
   */
  testID?: string;
}

const ToastContext = createContext<{
  showToast: (props: Omit<ToastProps, "visible" | "onDismiss">) => void;
}>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export function Toast({
  message,
  type = "info",
  position = "top",
  duration = 4000,
  showCloseButton = true,
  visible,
  onDismiss,
  icon,
  style,
  textStyle,
  testID,
}: ToastProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      if (duration > 0) {
        const timer = setTimeout(onDismiss, duration);
        return () => clearTimeout(timer);
      }
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: position === "bottom" ? 50 : -50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, duration, onDismiss, fadeAnim, translateAnim, position]);

  const getToastStyles = () => {
    const baseStyle = styles.toastContainer;
    const typeStyles = {
      success: styles.toastSuccess,
      error: styles.toastError,
      warning: styles.toastWarning,
      info: styles.toastInfo,
    };

    const positionStyles = {
      top: styles.toastTop,
      bottom: styles.toastBottom,
      center: styles.toastCenter,
    };

    return [baseStyle, typeStyles[type], positionStyles[position]];
  };

  const getIcon = () => {
    if (icon) return icon;

    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };

    return <Text style={styles.toastIcon}>{icons[type]}</Text>;
  };

  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.toastOverlay}>
        <Animated.View
          style={[
            ...getToastStyles(),
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateAnim }],
            },
            style,
          ]}
          testID={testID}
        >
          <View style={styles.toastContent}>
            {getIcon()}
            <Text style={[styles.toastText, textStyle]}>{message}</Text>
            {showCloseButton && (
              <TouchableOpacity
                style={styles.toastCloseButton}
                onPress={onDismiss}
                testID={`${testID}-close`}
              >
                <Text style={styles.toastCloseText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const showToast = useCallback(
    (props: Omit<ToastProps, "visible" | "onDismiss">) => {
      const id = Date.now().toString();
      const toast = {
        ...props,
        id,
        visible: true,
        onDismiss: () => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        },
      };
      setToasts((prev) => [...prev, toast]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </ToastContext.Provider>
  );
}

// Toast Queue Manager
class ToastQueue {
  private queue: Array<
    Omit<ToastProps, "visible" | "onDismiss"> & { id: string }
  > = [];
  private showToastFn?: (
    props: Omit<ToastProps, "visible" | "onDismiss">
  ) => void;

  setShowToast(fn: (props: Omit<ToastProps, "visible" | "onDismiss">) => void) {
    this.showToastFn = fn;
    this.processQueue();
  }

  add(props: Omit<ToastProps, "visible" | "onDismiss">) {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    this.queue.push({ ...props, id });
    this.processQueue();
  }

  private processQueue() {
    if (this.showToastFn && this.queue.length > 0) {
      const toast = this.queue.shift();
      if (toast) {
        this.showToastFn(toast);
      }
    }
  }

  success(message: string, options?: Partial<ToastProps>) {
    this.add({ ...options, message, type: "success" });
  }

  error(message: string, options?: Partial<ToastProps>) {
    this.add({ ...options, message, type: "error" });
  }

  warning(message: string, options?: Partial<ToastProps>) {
    this.add({ ...options, message, type: "warning" });
  }

  info(message: string, options?: Partial<ToastProps>) {
    this.add({ ...options, message, type: "info" });
  }
}

export const toast = new ToastQueue();

const styles = StyleSheet.create({
  toastOverlay: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: "box-none",
  },
  toastContainer: {
    marginHorizontal: getResponsiveValue(16, 20, 24),
    borderRadius: getResponsiveValue(8, 10, 12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  toastTop: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 0,
    right: 0,
  },
  toastBottom: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 60 : 40,
    left: 0,
    right: 0,
  },
  toastCenter: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    transform: [{ translateY: -25 }],
  },
  toastSuccess: {
    backgroundColor: "#10b981",
  },
  toastError: {
    backgroundColor: "#ef4444",
  },
  toastWarning: {
    backgroundColor: "#f59e0b",
  },
  toastInfo: {
    backgroundColor: "#3b82f6",
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsiveValue(12, 16, 20),
  },
  toastIcon: {
    fontSize: 18,
    color: "#ffffff",
    marginRight: 12,
    fontWeight: "bold",
  },
  toastText: {
    flex: 1,
    color: "#ffffff",
    fontSize: getResponsiveValue(14, 16, 18),
    fontWeight: "500",
  },
  toastCloseButton: {
    marginLeft: 12,
    padding: 4,
  },
  toastCloseText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
