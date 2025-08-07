import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  Pressable,
  Animated,
} from "react-native";

// Get screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Responsive breakpoints
const BREAKPOINTS = {
  small: 480,
  medium: 768,
  large: 1024,
};

// Responsive utility functions
const isSmallScreen = screenWidth < BREAKPOINTS.small;
const isMediumScreen =
  screenWidth >= BREAKPOINTS.small && screenWidth < BREAKPOINTS.medium;
const isLargeScreen = screenWidth >= BREAKPOINTS.medium;

/**
 * Get responsive value based on screen size
 */
function getResponsiveValue<T>(small: T, medium: T, large: T): T {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
}

/**
 * Get responsive font size
 */
function getResponsiveFontSize(baseSize: number): number {
  const multiplier = getResponsiveValue(0.9, 1, 1.1);
  return Math.round(baseSize * multiplier);
}

/**
 * Alert variant types for different visual styles
 */
export type AlertVariant = "info" | "success" | "warning" | "error" | "default";

/**
 * Alert size types
 */
export type AlertSize = "sm" | "md" | "lg";

/**
 * Alert position types for toast alerts
 */
export type AlertPosition = "top" | "bottom" | "center";

/**
 * Alert type - modal or toast
 */
export type AlertType = "modal" | "toast" | "inline";

/**
 * Alert button configuration
 */
export interface AlertButton {
  /**
   * Button text
   */
  text: string;

  /**
   * Button style variant
   */
  style?: "default" | "cancel" | "destructive";

  /**
   * Button press handler
   */
  onPress: () => void;

  /**
   * Whether this button is preferred (highlighted)
   */
  preferred?: boolean;
}

/**
 * Props for the Alert component
 */
export interface AlertProps {
  /**
   * Whether the alert is visible
   */
  visible: boolean;

  /**
   * Alert type - modal, toast, or inline
   * @default 'modal'
   */
  type?: AlertType;

  /**
   * Alert variant for styling
   * @default 'default'
   */
  variant?: AlertVariant;

  /**
   * Alert size
   * @default 'md'
   */
  size?: AlertSize;

  /**
   * Alert title
   */
  title?: string;

  /**
   * Alert message content
   */
  message: string;

  /**
   * Alert buttons (for modal type)
   */
  buttons?: AlertButton[];

  /**
   * Icon component to display
   */
  icon?: React.ReactNode;

  /**
   * Whether to show close button
   * @default true
   */
  showCloseButton?: boolean;

  /**
   * Auto dismiss duration in milliseconds (for toast)
   */
  autoDismiss?: number;

  /**
   * Toast position (for toast type)
   * @default 'top'
   */
  position?: AlertPosition;

  /**
   * Whether alert can be dismissed by tapping backdrop
   * @default true
   */
  backdropDismiss?: boolean;

  /**
   * Custom container style
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Custom title style
   */
  titleStyle?: TextStyle;

  /**
   * Custom message style
   */
  messageStyle?: TextStyle;

  /**
   * Custom icon container style
   */
  iconStyle?: ViewStyle;

  /**
   * Custom button container style
   */
  buttonContainerStyle?: ViewStyle;

  /**
   * Custom backdrop style
   */
  backdropStyle?: ViewStyle;

  /**
   * Test ID for testing purposes
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;

  /**
   * Callback when alert is shown
   */
  onShow?: () => void;

  /**
   * Animation duration in milliseconds
   * @default 300
   */
  animationDuration?: number;
}

/**
 * A comprehensive Alert component for React Native
 *
 * Features:
 * - Multiple types (modal, toast, inline)
 * - Multiple variants (info, success, warning, error, default)
 * - Responsive design across all screen sizes
 * - Customizable buttons with different styles
 * - Auto-dismiss functionality for toasts
 * - Flexible positioning options
 * - Full accessibility support
 * - Smooth animations
 * - Professional styling
 * - Icon support
 *
 * @param visible - Whether the alert is visible
 * @param type - Alert display type (modal, toast, inline)
 * @param variant - Visual style variant
 * @param title - Alert title text
 * @param message - Alert message content
 * @param buttons - Array of button configurations
 * @param onDismiss - Callback when alert is dismissed
 */
export function Alert({
  visible,
  type = "modal",
  variant = "default",
  size = "md",
  title,
  message,
  buttons = [],
  icon,
  showCloseButton = true,
  autoDismiss,
  position = "top",
  backdropDismiss = true,
  style,
  titleStyle,
  messageStyle,
  iconStyle,
  buttonContainerStyle,
  backdropStyle,
  testID,
  accessibilityLabel,
  onDismiss,
  onShow,
  animationDuration = 300,
}: AlertProps) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));

  // Auto dismiss timer
  useEffect(() => {
    if (visible && type === "toast" && autoDismiss && autoDismiss > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoDismiss);

      return () => clearTimeout(timer);
    }
  }, [visible, type, autoDismiss]);

  // Handle show animation
  useEffect(() => {
    if (visible) {
      onShow?.();
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, slideAnim, animationDuration]);

  // Handle dismiss
  const handleDismiss = () => {
    onDismiss?.();
  };

  // Handle backdrop press
  const handleBackdropPress = () => {
    if (backdropDismiss) {
      handleDismiss();
    }
  };

  // Get variant styles
  const variantStyles = getVariantStyles(variant);
  const sizeStyles = getSizeStyles(size);

  // Get slide animation transform
  const getSlideTransform = () => {
    if (type === "toast") {
      if (position === "top") {
        return {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0],
              }),
            },
          ],
        };
      } else if (position === "bottom") {
        return {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
        };
      }
    }

    return {
      transform: [
        {
          scale: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        },
      ],
    };
  };

  // Render default icon based on variant
  const renderDefaultIcon = () => {
    if (icon) return icon;

    switch (variant) {
      case "success":
        return <Text style={styles.defaultIcon}>✓</Text>;
      case "warning":
        return <Text style={styles.defaultIcon}>⚠</Text>;
      case "error":
        return <Text style={styles.defaultIcon}>✕</Text>;
      case "info":
        return <Text style={styles.defaultIcon}>ℹ</Text>;
      default:
        return null;
    }
  };

  // Render close button
  const renderCloseButton = () => {
    if (!showCloseButton) return null;

    return (
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleDismiss}
        testID={testID ? `${testID}-close` : undefined}
        accessibilityLabel="Close alert"
        accessibilityRole="button"
      >
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    );
  };

  // Render buttons
  const renderButtons = () => {
    if (buttons.length === 0) return null;

    return (
      <View style={[styles.buttonContainer, buttonContainerStyle]}>
        {buttons.map((button, index) => {
          const buttonStyles = getButtonStyles(
            button.style || "default",
            button.preferred
          );

          return (
            <TouchableOpacity
              key={index}
              style={[styles.button, buttonStyles.container]}
              onPress={button.onPress}
              testID={testID ? `${testID}-button-${index}` : undefined}
              accessibilityLabel={button.text}
              accessibilityRole="button"
            >
              <Text style={[styles.buttonText, buttonStyles.text]}>
                {button.text}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Render alert content
  const renderContent = () => {
    const containerStyles = [
      styles.container,
      variantStyles.container,
      sizeStyles.container,
      type === "toast" && styles.toastContainer,
      type === "inline" && styles.inlineContainer,
      style,
    ];

    return (
      <Animated.View
        style={[containerStyles, { opacity: fadeAnim }, getSlideTransform()]}
        testID={testID}
        accessibilityLabel={accessibilityLabel || message}
        accessibilityRole="alert"
      >
        <View style={styles.header}>
          <View style={styles.contentContainer}>
            {renderDefaultIcon() && (
              <View
                style={[
                  styles.iconContainer,
                  variantStyles.iconContainer,
                  iconStyle,
                ]}
              >
                {renderDefaultIcon()}
              </View>
            )}

            <View style={styles.textContainer}>
              {title && (
                <Text
                  style={[
                    styles.title,
                    variantStyles.title,
                    sizeStyles.title,
                    titleStyle,
                  ]}
                  testID={testID ? `${testID}-title` : undefined}
                >
                  {title}
                </Text>
              )}

              <Text
                style={[
                  styles.message,
                  variantStyles.message,
                  sizeStyles.message,
                  !title && styles.messageOnly,
                  messageStyle,
                ]}
                testID={testID ? `${testID}-message` : undefined}
              >
                {message}
              </Text>
            </View>
          </View>

          {renderCloseButton()}
        </View>

        {renderButtons()}
      </Animated.View>
    );
  };

  // Render based on type
  if (type === "inline") {
    return visible ? renderContent() : null;
  }

  if (type === "toast") {
    const toastPositionStyle = {
      top: position === "top" ? getResponsiveValue(50, 60, 80) : undefined,
      bottom:
        position === "bottom" ? getResponsiveValue(50, 60, 80) : undefined,
      alignSelf: "center" as const,
    };

    return (
      <Modal
        visible={visible}
        transparent
        animationType="none"
        onRequestClose={handleDismiss}
      >
        <View style={[styles.toastOverlay, toastPositionStyle]}>
          {renderContent()}
        </View>
      </Modal>
    );
  }

  // Modal type
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}
    >
      <Pressable
        style={[styles.modalOverlay, backdropStyle]}
        onPress={handleBackdropPress}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          {renderContent()}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/**
 * Get variant-specific styles
 */
function getVariantStyles(variant: AlertVariant) {
  const baseStyles = {
    container: {},
    title: { color: "#111827" },
    message: { color: "#374151" },
    iconContainer: {},
  };

  switch (variant) {
    case "success":
      return {
        container: {
          backgroundColor: "#f0fdf4",
          borderColor: "#22c55e",
          borderLeftWidth: 4,
        },
        title: { color: "#15803d" },
        message: { color: "#166534" },
        iconContainer: { backgroundColor: "#dcfce7" },
      };

    case "warning":
      return {
        container: {
          backgroundColor: "#fffbeb",
          borderColor: "#f59e0b",
          borderLeftWidth: 4,
        },
        title: { color: "#d97706" },
        message: { color: "#92400e" },
        iconContainer: { backgroundColor: "#fef3c7" },
      };

    case "error":
      return {
        container: {
          backgroundColor: "#fef2f2",
          borderColor: "#ef4444",
          borderLeftWidth: 4,
        },
        title: { color: "#dc2626" },
        message: { color: "#991b1b" },
        iconContainer: { backgroundColor: "#fecaca" },
      };

    case "info":
      return {
        container: {
          backgroundColor: "#eff6ff",
          borderColor: "#3b82f6",
          borderLeftWidth: 4,
        },
        title: { color: "#1d4ed8" },
        message: { color: "#1e40af" },
        iconContainer: { backgroundColor: "#dbeafe" },
      };

    default:
      return {
        container: {
          backgroundColor: "#ffffff",
          borderColor: "#e5e7eb",
          borderWidth: 1,
        },
        title: baseStyles.title,
        message: baseStyles.message,
        iconContainer: { backgroundColor: "#f3f4f6" },
      };
  }
}

/**
 * Get size-specific styles
 */
function getSizeStyles(size: AlertSize) {
  switch (size) {
    case "sm":
      return {
        container: {
          padding: getResponsiveValue(12, 14, 16),
          borderRadius: getResponsiveValue(6, 8, 10),
        },
        title: {
          fontSize: getResponsiveFontSize(14),
          marginBottom: 4,
        },
        message: {
          fontSize: getResponsiveFontSize(12),
        },
      };

    case "lg":
      return {
        container: {
          padding: getResponsiveValue(20, 24, 28),
          borderRadius: getResponsiveValue(10, 12, 14),
        },
        title: {
          fontSize: getResponsiveFontSize(20),
          marginBottom: 8,
        },
        message: {
          fontSize: getResponsiveFontSize(16),
        },
      };

    default: // md
      return {
        container: {
          padding: getResponsiveValue(16, 18, 20),
          borderRadius: getResponsiveValue(8, 10, 12),
        },
        title: {
          fontSize: getResponsiveFontSize(16),
          marginBottom: 6,
        },
        message: {
          fontSize: getResponsiveFontSize(14),
        },
      };
  }
}

/**
 * Get button-specific styles
 */
function getButtonStyles(style: string, preferred?: boolean) {
  const baseButton = {
    container: {
      backgroundColor: preferred ? "#4f46e5" : "#f3f4f6",
      borderRadius: 6,
    },
    text: {
      color: preferred ? "#ffffff" : "#374151",
      fontWeight: preferred ? ("600" as const) : ("500" as const),
    },
  };

  switch (style) {
    case "cancel":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 6,
        },
        text: {
          color: "#6b7280",
          fontWeight: "500" as const,
        },
      };

    case "destructive":
      return {
        container: {
          backgroundColor: "#ef4444",
          borderRadius: 6,
        },
        text: {
          color: "#ffffff",
          fontWeight: "600" as const,
        },
      };

    default:
      return baseButton;
  }
}

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // Toast styles
  toastOverlay: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 1000,
  },

  // Container styles
  container: {
    maxWidth: Math.min(screenWidth - 40, 400),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  toastContainer: {
    width: "100%",
  },

  inlineContainer: {
    width: "100%",
    shadowOpacity: 0,
    elevation: 0,
  },

  // Header styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  contentContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "flex-start",
  },

  iconContainer: {
    width: getResponsiveValue(32, 36, 40),
    height: getResponsiveValue(32, 36, 40),
    borderRadius: getResponsiveValue(16, 18, 20),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  defaultIcon: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: "bold",
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontWeight: "600",
  },

  message: {
    lineHeight: getResponsiveFontSize(20),
  },

  messageOnly: {
    marginTop: 0,
  },

  closeButton: {
    padding: 4,
    marginLeft: 12,
  },

  closeButtonText: {
    fontSize: 18,
    color: "#6b7280",
  },

  // Button styles
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 8,
  },

  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
    alignItems: "center",
  },

  buttonText: {
    fontSize: getResponsiveFontSize(14),
  },
});

// Static methods for imperative usage
export const AlertManager = {
  /**
   * Show a simple alert
   */
  alert: (title: string, message?: string, buttons?: AlertButton[]) => {
    // Implementation would depend on your app's alert management system
    console.log("Alert:", { title, message, buttons });
  },

  /**
   * Show a success toast
   */
  success: (message: string, duration?: number) => {
    // Implementation for success toast
    console.log("Success:", { message, duration });
  },

  /**
   * Show an error toast
   */
  error: (message: string, duration?: number) => {
    // Implementation for error toast
    console.log("Error:", { message, duration });
  },

  /**
   * Show an info toast
   */
  info: (message: string, duration?: number) => {
    // Implementation for info toast
    console.log("Info:", { message, duration });
  },

  /**
   * Show a warning toast
   */
  warning: (message: string, duration?: number) => {
    // Implementation for warning toast
    console.log("Warning:", { message, duration });
  },
};

export default Alert;
