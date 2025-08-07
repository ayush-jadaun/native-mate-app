import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  Animated,
  Dimensions,
} from "react-native";

// Get screen dimensions
const { width: screenWidth } = Dimensions.get('window');

// Responsive breakpoints
const BREAKPOINTS = {
  small: 480,
  medium: 768,
  large: 1024,
};

// Responsive utility functions
const isSmallScreen = screenWidth < BREAKPOINTS.small;
const isMediumScreen = screenWidth >= BREAKPOINTS.small && screenWidth < BREAKPOINTS.medium;
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
 * Skeleton variant types for different visual styles
 */
export type SkeletonVariant = "text" | "circular" | "rectangular" | "rounded" | "wave";

/**
 * Skeleton size types
 */
export type SkeletonSize = "xs" | "sm" | "md" | "lg" | "xl" | "custom";

/**
 * Skeleton animation types
 */
export type SkeletonAnimation = "pulse" | "shimmer" | "wave" | "none";

/**
 * Props for the Skeleton component
 */
export interface SkeletonProps {
  /**
   * Skeleton variant
   * @default 'rectangular'
   */
  variant?: SkeletonVariant;

  /**
   * Skeleton size
   * @default 'md'
   */
  size?: SkeletonSize;

  /**
   * Custom width (overrides size-based width)
   */
  width?: number | string;

  /**
   * Custom height (overrides size-based height)
   */
  height?: number | string;

  /**
   * Animation type
   * @default 'shimmer'
   */
  animation?: SkeletonAnimation;

  /**
   * Animation duration in milliseconds
   * @default 1500
   */
  animationDuration?: number;

  /**
   * Whether skeleton is active (animated)
   * @default true
   */
  active?: boolean;

  /**
   * Number of skeleton lines (for text variant)
   * @default 1
   */
  lines?: number;

  /**
   * Spacing between lines (for text variant)
   * @default 8
   */
  lineSpacing?: number;

  /**
   * Last line width percentage (for text variant)
   * @default 60
   */
  lastLineWidth?: number;

  /**
   * Border radius for rectangular variant
   */
  borderRadius?: number;

  /**
   * Base color of the skeleton
   * @default '#e5e7eb'
   */
  baseColor?: string;

  /**
   * Highlight color for animation
   * @default '#f3f4f6'
   */
  highlightColor?: string;

  /**
   * Custom container style
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Test ID for testing purposes
   */
  testID?: string;

  /**
   * Child components (renders when active is false)
   */
  children?: React.ReactNode;
}

/**
 * Individual skeleton item props
 */
interface SkeletonItemProps {
  width?: number | string;
  height?: number | string;
  variant: SkeletonVariant;
  borderRadius?: number;
  baseColor: string;
  highlightColor: string;
  animation: SkeletonAnimation;
  animationDuration: number;
  active: boolean;
  style?: ViewStyle;
  testID?: string;
}

/**
 * Individual Skeleton Item Component
 */
function SkeletonItem({
  width,
  height,
  variant,
  borderRadius,
  baseColor,
  highlightColor,
  animation,
  animationDuration,
  active,
  style,
  testID,
}: SkeletonItemProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Setup animations
  useEffect(() => {
    if (!active || animation === "none") return;

    let animationLoop: Animated.CompositeAnimation;

    switch (animation) {
      case "shimmer":
      case "wave":
        animationLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnim, {
              toValue: 1,
              duration: animationDuration,
              useNativeDriver: true,
            }),
            Animated.timing(shimmerAnim, {
              toValue: 0,
              duration: animationDuration,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case "pulse":
        animationLoop = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 0.7,
              duration: animationDuration / 2,
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: animationDuration / 2,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      default:
        return;
    }

    animationLoop.start();

    return () => {
      animationLoop.stop();
    };
  }, [active, animation, animationDuration, shimmerAnim, pulseAnim]);

  // Get variant-specific styles
  const getVariantStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      backgroundColor: baseColor,
      width: typeof width === "number" ? width : typeof width === "string" && width.endsWith('%') ? (width as import("react-native").DimensionValue) : undefined,
      height: typeof height === "number" ? height : typeof height === "string" && height.endsWith('%') ? (height as import("react-native").DimensionValue) : undefined,
    };

    switch (variant) {
      case "circular":
        return {
          ...baseStyle,
          borderRadius: Math.max(
            typeof width === "number" ? width / 2 : 25,
            typeof height === "number" ? height / 2 : 25
          ),
        };

      case "rounded":
        return {
          ...baseStyle,
          borderRadius: borderRadius || getResponsiveValue(8, 10, 12),
        };

      case "text":
        return {
          ...baseStyle,
          borderRadius: getResponsiveValue(2, 3, 4),
        };

      case "wave":
        return {
          ...baseStyle,
          borderRadius: getResponsiveValue(4, 6, 8),
        };

      case "rectangular":
      default:
        return {
          ...baseStyle,
          borderRadius: borderRadius || 0,
        };
    }
  };

  // Get animation styles
  const getAnimationStyles = (): ViewStyle => {
    switch (animation) {
      case "shimmer":
        return {
          opacity: shimmerAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [1, 0.5, 1],
          }),
        };

      case "wave":
        return {
          transform: [
            {
              translateX: shimmerAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 100],
              }),
            },
          ],
        };

      case "pulse":
        return {
          opacity: pulseAnim,
        };

      default:
        return {};
    }
  };

  // Render shimmer overlay for shimmer animation
  const renderShimmerOverlay = () => {
    if (animation !== "shimmer") return null;

    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: highlightColor,
            opacity: shimmerAnim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 0.8, 0],
            }),
          },
          getVariantStyles(),
        ]}
      />
    );
  };

  if (!active) return null;

  return (
    <View style={[getVariantStyles(), style]} testID={testID}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          getVariantStyles(),
          getAnimationStyles(),
        ]}
      />
      {renderShimmerOverlay()}
    </View>
  );
}

/**
 * A comprehensive Skeleton component for React Native
 *
 * Features:
 * - Multiple variants (text, circular, rectangular, rounded, wave)
 * - Multiple animation types (pulse, shimmer, wave, none)
 * - Responsive sizing across all screen sizes
 * - Multiple lines support for text skeletons
 * - Customizable colors and styling
 * - Professional loading states
 * - Full accessibility support
 * - Performance optimized animations
 * - Flexible sizing options
 *
 * @param variant - Skeleton shape variant
 * @param size - Predefined size option
 * @param animation - Animation type
 * @param active - Whether skeleton is active/visible
 * @param lines - Number of text lines (for text variant)
 * @param children - Content to show when not active
 */
export function Skeleton({
  variant = "rectangular",
  size = "md",
  width,
  height,
  animation = "shimmer",
  animationDuration = 1500,
  active = true,
  lines = 1,
  lineSpacing = 8,
  lastLineWidth = 60,
  borderRadius,
  baseColor = "#e5e7eb",
  highlightColor = "#f3f4f6",
  style,
  testID,
  children,
}: SkeletonProps) {
  // Get size-based dimensions
  const getSizeDimensions = () => {
    if (width !== undefined && height !== undefined) {
      return { width, height };
    }

    const sizeMap = {
      xs: { width: getResponsiveValue(40, 50, 60), height: getResponsiveValue(12, 14, 16) },
      sm: { width: getResponsiveValue(60, 75, 90), height: getResponsiveValue(16, 18, 20) },
      md: { width: getResponsiveValue(100, 125, 150), height: getResponsiveValue(20, 24, 28) },
      lg: { width: getResponsiveValue(150, 200, 250), height: getResponsiveValue(28, 32, 36) },
      xl: { width: getResponsiveValue(200, 300, 400), height: getResponsiveValue(36, 42, 48) },
      custom: { width: width || "100%", height: height || 20 },
    };

    const dimensions = sizeMap[size];

    // Special handling for different variants
    switch (variant) {
      case "circular":
        const circularSize = Math.min(
          typeof dimensions.width === "number" ? dimensions.width : 40,
          typeof dimensions.height === "number" ? dimensions.height : 40
        );
        return { width: circularSize, height: circularSize };

      case "text":
        return {
          width: width || dimensions.width,
          height: height || getResponsiveValue(14, 16, 18),
        };

      default:
        return {
          width: width || dimensions.width,
          height: height || dimensions.height,
        };
    }
  };

  // Render multiple lines for text variant
  const renderTextLines = () => {
    if (variant !== "text" || lines <= 1) {
      const dimensions = getSizeDimensions();
      return (
        <SkeletonItem
          {...dimensions}
          variant={variant}
          borderRadius={borderRadius}
          baseColor={baseColor}
          highlightColor={highlightColor}
          animation={animation}
          animationDuration={animationDuration}
          active={active}
          testID={testID}
        />
      );
    }

    const dimensions = getSizeDimensions();
    const items = [];

    for (let i = 0; i < lines; i++) {
      const isLastLine = i === lines - 1;
      const lineWidth = isLastLine
        ? typeof dimensions.width === "number"
          ? (dimensions.width * lastLineWidth) / 100
          : `${lastLineWidth}%`
        : dimensions.width;

      items.push(
        <View key={i} style={{ marginBottom: i < lines - 1 ? lineSpacing : 0 }}>
          <SkeletonItem
            width={lineWidth}
            height={dimensions.height}
            variant={variant}
            borderRadius={borderRadius}
            baseColor={baseColor}
            highlightColor={highlightColor}
            animation={animation}
            animationDuration={animationDuration}
            active={active}
            testID={testID ? `${testID}-line-${i}` : undefined}
          />
        </View>
      );
    }

    return items;
  };

  // Return children when skeleton is not active
  if (!active && children) {
    return <>{children}</>;
  }

  // Return null when skeleton is not active and no children
  if (!active) {
    return null;
  }

  return (
    <View style={[styles.container, style]} testID={testID}>
      {renderTextLines()}
    </View>
  );
}

/**
 * Skeleton component styles
 */
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
});

/**
 * Skeleton Group component for rendering multiple skeletons together
 */
export interface SkeletonGroupProps {
  /**
   * Number of skeleton items to render
   */
  count: number;

  /**
   * Spacing between skeleton items
   */
  spacing?: number;

  /**
   * Direction of skeleton items
   */
  direction?: 'row' | 'column';

  /**
   * Props to pass to each skeleton item
   */
  skeletonProps?: Partial<SkeletonProps>;

  /**
   * Custom container style
   */
  style?: ViewStyle;

  /**
   * Test ID for testing purposes
   */
  testID?: string;
}

/**
 * Skeleton Group component for rendering multiple skeleton items
 */
export function SkeletonGroup({
  count,
  spacing = 12,
  direction = 'column',
  skeletonProps = {},
  style,
  testID,
}: SkeletonGroupProps) {
  const items = [];

  for (let i = 0; i < count; i++) {
    const marginStyle = 
      direction === 'row' 
        ? { marginRight: i < count - 1 ? spacing : 0 }
        : { marginBottom: i < count - 1 ? spacing : 0 };

    items.push(
      <View key={i} style={marginStyle}>
        <Skeleton
          {...skeletonProps}
          testID={testID ? `${testID}-item-${i}` : undefined}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          flexDirection: direction,
          alignItems: direction === 'row' ? 'center' : 'stretch',
        },
        style,
      ]}
      testID={testID}
    >
      {items}
    </View>
  );
}

// Export default
export default Skeleton;