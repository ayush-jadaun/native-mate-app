import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
  View,
  Dimensions,
} from "react-native";

// Get screen dimensions
const { width: screenWidth } = Dimensions.get("window");

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
 * Get responsive padding
 */
function getResponsivePadding(
  vertical: number,
  horizontal: number
): { paddingVertical: number; paddingHorizontal: number } {
  const verticalMultiplier = getResponsiveValue(0.8, 1, 1.2);
  const horizontalMultiplier = getResponsiveValue(0.9, 1, 1.1);

  return {
    paddingVertical: Math.round(vertical * verticalMultiplier),
    paddingHorizontal: Math.round(horizontal * horizontalMultiplier),
  };
}

/**
 * Button variant types for different visual styles
 */
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "filled"
  | "destructive"
  | "success"
  | "warning";

/**
 * Button size types for different dimensions
 */
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

/**
 * Button width types
 */
export type ButtonWidth = "auto" | "full" | "fit";

/**
 * Icon position within the button
 */
export type IconPosition = "left" | "right" | "top" | "bottom";

/**
 * Props for the Button component
 */
export interface ButtonProps {
  /**
   * Button text content
   */
  title: string;

  /**
   * Function called when button is pressed
   */
  onPress: (event: GestureResponderEvent) => void;

  /**
   * Button visual variant
   * @default 'primary'
   */
  variant?: ButtonVariant;

  /**
   * Button size
   * @default 'md'
   */
  size?: ButtonSize;

  /**
   * Button width behavior
   * @default 'auto'
   */
  width?: ButtonWidth;

  /**
   * Custom border radius
   */
  borderRadius?: number;

  /**
   * Whether the button is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether to show loading indicator
   * @default false
   */
  loading?: boolean;

  /**
   * Loading text to show when loading is true
   */
  loadingText?: string;

  /**
   * Icon component to display (React element)
   */
  icon?: React.ReactNode;

  /**
   * Position of the icon relative to text
   * @default 'left'
   */
  iconPosition?: IconPosition;

  /**
   * Spacing between icon and text
   * @default 8
   */
  iconSpacing?: number;

  /**
   * Custom container style
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Custom text style
   */
  textStyle?: TextStyle;

  /**
   * Custom icon container style
   */
  iconStyle?: ViewStyle;

  /**
   * Custom loading indicator color
   */
  loadingColor?: string;

  /**
   * Custom active opacity when pressed
   * @default 0.8
   */
  activeOpacity?: number;

  /**
   * Whether to add haptic feedback on press
   * @default false
   */
  hapticFeedback?: boolean;

  /**
   * Minimum touch target size for accessibility
   * @default 44
   */
  minTouchTarget?: number;

  /**
   * Test ID for testing purposes
   */
  testID?: string;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Accessibility hint
   */
  accessibilityHint?: string;

  /**
   * Function called when button is long pressed
   */
  onLongPress?: (event: GestureResponderEvent) => void;

  /**
   * Function called when press starts
   */
  onPressIn?: (event: GestureResponderEvent) => void;

  /**
   * Function called when press ends
   */
  onPressOut?: (event: GestureResponderEvent) => void;
}

/**
 * A comprehensive Button component for React Native
 *
 * Features:
 * - Multiple variants (primary, secondary, outline, ghost, filled, destructive, success, warning)
 * - Responsive sizing and typography
 * - Icon support with flexible positioning
 * - Loading states with customizable indicators
 * - Full accessibility support
 * - Comprehensive styling options
 * - Touch feedback and haptics
 * - Professional design system integration
 *
 * @param title - Text content of the button
 * @param onPress - Callback function when button is pressed
 * @param variant - Visual style variant
 * @param size - Button size (affects padding and font size)
 * @param width - Width behavior (auto, full, or fit content)
 * @param disabled - Whether button is disabled
 * @param loading - Whether to show loading state
 * @param icon - Icon element to display
 * @param iconPosition - Position of icon relative to text
 * @param style - Custom styling for container
 * @param textStyle - Custom styling for text
 */
export function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  width = "auto",
  borderRadius,
  disabled = false,
  loading = false,
  loadingText,
  icon,
  iconPosition = "left",
  iconSpacing = 8,
  style,
  textStyle,
  iconStyle,
  loadingColor,
  activeOpacity = 0.8,
  hapticFeedback = false,
  minTouchTarget = 44,
  testID,
  accessibilityLabel,
  accessibilityHint,
  onLongPress,
  onPressIn,
  onPressOut,
}: ButtonProps) {
  // Get responsive border radius if not provided
  const responsiveBorderRadius = borderRadius ?? getResponsiveValue(6, 8, 10);

  // Handle press with haptic feedback
  const handlePress = (event: GestureResponderEvent) => {
    if (hapticFeedback && !disabled && !loading) {
      // Note: In a real app, you'd import and use react-native-haptic-feedback
      // HapticFeedback.trigger('impactLight');
    }
    onPress(event);
  };

  // Get variant-specific styles
  const variantStyles = getVariantStyles(variant, disabled);
  const sizeStyles = getSizeStyles(size);
  const widthStyles = getWidthStyles(width);

  // Combine all styles
  const containerStyles = [
    styles.container,
    variantStyles.container,
    sizeStyles.container,
    widthStyles,
    {
      borderRadius: responsiveBorderRadius,
      minHeight: Math.max(
        (typeof sizeStyles.container.paddingVertical === "number"
          ? sizeStyles.container.paddingVertical * 2
          : 0) +
          (typeof sizeStyles.text.fontSize === "number"
            ? sizeStyles.text.fontSize * 1.2
            : 0),
        minTouchTarget
      ),
    },
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    variantStyles.text,
    sizeStyles.text,
    textStyle,
  ];

  // Render content based on state and configuration
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color={loadingColor || variantStyles.text.color}
            size={size === "xs" || size === "sm" ? "small" : "small"}
            testID={testID ? `${testID}-loading` : undefined}
          />
          {loadingText && (
            <Text style={[textStyles, { marginLeft: iconSpacing }]}>
              {loadingText}
            </Text>
          )}
        </View>
      );
    }

    if (!icon) {
      return <Text style={textStyles}>{title}</Text>;
    }

    // Render button with icon
    const iconElement = (
      <View style={[styles.iconContainer, iconStyle]}>{icon}</View>
    );

    const textElement = <Text style={textStyles}>{title}</Text>;

    switch (iconPosition) {
      case "right":
        return (
          <View style={styles.horizontalContent}>
            {textElement}
            <View style={{ width: iconSpacing }} />
            {iconElement}
          </View>
        );
      case "top":
        return (
          <View style={styles.verticalContent}>
            {iconElement}
            <View style={{ height: iconSpacing }} />
            {textElement}
          </View>
        );
      case "bottom":
        return (
          <View style={styles.verticalContent}>
            {textElement}
            <View style={{ height: iconSpacing }} />
            {iconElement}
          </View>
        );
      case "left":
      default:
        return (
          <View style={styles.horizontalContent}>
            {iconElement}
            <View style={{ width: iconSpacing }} />
            {textElement}
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled || loading}
      activeOpacity={activeOpacity}
      style={containerStyles}
      testID={testID}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

/**
 * Get variant-specific styles
 * @param variant - Button variant type
 * @param disabled - Whether button is disabled
 * @returns Style objects for container and text
 */
function getVariantStyles(
  variant: ButtonVariant,
  disabled: boolean
): {
  container: ViewStyle;
  text: TextStyle;
} {
  const alpha = disabled ? 0.6 : 1;

  switch (variant) {
    case "secondary":
      return {
        container: {
          backgroundColor: `rgba(107, 114, 128, ${alpha})`,
          borderWidth: 0,
        },
        text: { color: "#ffffff" },
      };

    case "outline":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: getResponsiveValue(1, 1.5, 2),
          borderColor: `rgba(79, 70, 229, ${alpha})`,
        },
        text: { color: `rgba(79, 70, 229, ${alpha})` },
      };

    case "ghost":
      return {
        container: {
          backgroundColor: "transparent",
          borderWidth: 0,
        },
        text: { color: `rgba(79, 70, 229, ${alpha})` },
      };

    case "filled":
      return {
        container: {
          backgroundColor: `rgba(243, 244, 246, ${alpha})`,
          borderWidth: 0,
        },
        text: { color: `rgba(55, 65, 81, ${alpha})` },
      };

    case "destructive":
      return {
        container: {
          backgroundColor: `rgba(239, 68, 68, ${alpha})`,
          borderWidth: 0,
        },
        text: { color: "#ffffff" },
      };

    case "success":
      return {
        container: {
          backgroundColor: `rgba(34, 197, 94, ${alpha})`,
          borderWidth: 0,
        },
        text: { color: "#ffffff" },
      };

    case "warning":
      return {
        container: {
          backgroundColor: `rgba(245, 158, 11, ${alpha})`,
          borderWidth: 0,
        },
        text: { color: "#ffffff" },
      };

    case "primary":
    default:
      return {
        container: {
          backgroundColor: `rgba(79, 70, 229, ${alpha})`,
          borderWidth: 0,
        },
        text: { color: "#ffffff" },
      };
  }
}

/**
 * Get size-specific styles
 * @param size - Button size type
 * @returns Style objects for container and text
 */
function getSizeStyles(size: ButtonSize): {
  container: ViewStyle;
  text: TextStyle;
} {
  switch (size) {
    case "xs":
      return {
        container: getResponsivePadding(6, 12),
        text: {
          fontSize: getResponsiveFontSize(12),
          fontWeight: "500" as const,
        },
      };

    case "sm":
      return {
        container: getResponsivePadding(8, 16),
        text: {
          fontSize: getResponsiveFontSize(14),
          fontWeight: "500" as const,
        },
      };

    case "lg":
      return {
        container: getResponsivePadding(16, 32),
        text: {
          fontSize: getResponsiveFontSize(18),
          fontWeight: "600" as const,
        },
      };

    case "xl":
      return {
        container: getResponsivePadding(20, 40),
        text: {
          fontSize: getResponsiveFontSize(20),
          fontWeight: "600" as const,
        },
      };

    case "md":
    default:
      return {
        container: getResponsivePadding(12, 24),
        text: {
          fontSize: getResponsiveFontSize(16),
          fontWeight: "600" as const,
        },
      };
  }
}

/**
 * Get width-specific styles
 * @param width - Button width type
 * @returns Style object for width behavior
 */
function getWidthStyles(width: ButtonWidth): ViewStyle {
  switch (width) {
    case "full":
      return { width: "100%" };
    case "fit":
      return { alignSelf: "flex-start" };
    case "auto":
    default:
      return {};
  }
}

// Stylesheet for the Button component
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  text: {
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },

  disabled: {
    opacity: 0.6,
  },

  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  horizontalContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  verticalContent: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

// Export the Button component as default
export default Button;
