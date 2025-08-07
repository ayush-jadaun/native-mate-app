import React from "react";
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

/**
 * Card variant types for different visual styles
 */
export type CardVariant = "default" | "outlined" | "elevated" | "filled";

/**
 * Card size types for different dimensions
 */
export type CardSize = "sm" | "md" | "lg";

/**
 * Image position within the card
 */
export type ImagePosition = "top" | "bottom" | "left" | "right" | "background";

/**
 * Props for the Card component
 */
export interface CardProps {
  /**
   * Card visual variant
   * @default 'default'
   */
  variant?: CardVariant;

  /**
   * Card size
   * @default 'md'
   */
  size?: CardSize;

  /**
   * Main title text
   */
  title?: string;

  /**
   * Subtitle or secondary text
   */
  subtitle?: string;

  /**
   * Main content text
   */
  content?: string;

  /**
   * Image source for the card
   */
  image?: ImageSourcePropType;

  /**
   * Position of the image within the card
   * @default 'top'
   */
  imagePosition?: ImagePosition;

  /**
   * Custom image style
   */
  imageStyle?: ImageStyle;

  /**
   * Custom header content (replaces title/subtitle)
   */
  header?: React.ReactNode;

  /**
   * Custom footer content
   */
  footer?: React.ReactNode;

  /**
   * Child components to render in the card body
   */
  children?: React.ReactNode;

  /**
   * Makes the entire card touchable
   */
  onPress?: () => void;

  /**
   * Custom container style
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Custom title style
   */
  titleStyle?: TextStyle;

  /**
   * Custom subtitle style
   */
  subtitleStyle?: TextStyle;

  /**
   * Custom content style
   */
  contentStyle?: TextStyle;

  /**
   * Custom header container style
   */
  headerStyle?: ViewStyle;

  /**
   * Custom body container style
   */
  bodyStyle?: ViewStyle;

  /**
   * Custom footer container style
   */
  footerStyle?: ViewStyle;

  /**
   * Whether the card should be disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Test ID for testing purposes
   */
  testID?: string;
}

/**
 * A flexible Card component for React Native
 *
 * Supports various layouts, images, custom content, and styling options.
 * Can be used for displaying content in an organized, visually appealing container.
 *
 * @param variant - Visual style variant of the card
 * @param size - Size of the card (affects padding and dimensions)
 * @param title - Main title text displayed in the header
 * @param subtitle - Secondary text displayed below the title
 * @param content - Main body content text
 * @param image - Image to display in the card
 * @param imagePosition - Where to position the image within the card
 * @param header - Custom header content (overrides title/subtitle)
 * @param footer - Custom footer content
 * @param children - Custom body content
 * @param onPress - Callback when card is pressed (makes card touchable)
 * @param style - Custom container styling
 * @param disabled - Whether the card interaction is disabled
 */
export function Card({
  variant = "default",
  size = "md",
  title,
  subtitle,
  content,
  image,
  imagePosition = "top",
  imageStyle,
  header,
  footer,
  children,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
  contentStyle,
  headerStyle,
  bodyStyle,
  footerStyle,
  disabled = false,
  testID,
}: CardProps) {
  // Get variant-specific styles
  const variantStyle = getVariantStyle(variant);
  const sizeStyle = getSizeStyle(size);

  // Combine base styles with custom styles
  const containerStyle = [
    styles.container,
    variantStyle,
    sizeStyle,
    disabled && styles.disabled,
    style,
  ];

  // Render image based on position
  const renderImage = () => {
    if (!image) return null;

    const imageStyles = [
      styles.image,
      getImagePositionStyle(imagePosition, size),
      imageStyle,
    ];

    return (
      <Image
        source={image}
        style={imageStyles}
        resizeMode="cover"
        testID={testID ? `${testID}-image` : undefined}
      />
    );
  };

  // Render header section
  const renderHeader = () => {
    // Use custom header if provided
    if (header) {
      return (
        <View
          style={[styles.header, headerStyle]}
          testID={testID ? `${testID}-header` : undefined}
        >
          {header}
        </View>
      );
    }

    // Render default header with title/subtitle
    if (title || subtitle) {
      return (
        <View
          style={[styles.header, headerStyle]}
          testID={testID ? `${testID}-header` : undefined}
        >
          {title && (
            <Text
              style={[styles.title, getSizeTitleStyle(size), titleStyle]}
              testID={testID ? `${testID}-title` : undefined}
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                getSizeSubtitleStyle(size),
                subtitleStyle,
              ]}
              testID={testID ? `${testID}-subtitle` : undefined}
            >
              {subtitle}
            </Text>
          )}
        </View>
      );
    }

    return null;
  };

  // Render body section
  const renderBody = () => {
    if (!content && !children) return null;

    return (
      <View
        style={[styles.body, bodyStyle]}
        testID={testID ? `${testID}-body` : undefined}
      >
        {content && (
          <Text
            style={[styles.content, getSizeContentStyle(size), contentStyle]}
            testID={testID ? `${testID}-content` : undefined}
          >
            {content}
          </Text>
        )}
        {children}
      </View>
    );
  };

  // Render footer section
  const renderFooter = () => {
    if (!footer) return null;

    return (
      <View
        style={[styles.footer, footerStyle]}
        testID={testID ? `${testID}-footer` : undefined}
      >
        {footer}
      </View>
    );
  };

  // Render card content based on image position
  const renderCardContent = () => {
    const header = renderHeader();
    const body = renderBody();
    const footer = renderFooter();
    const image = renderImage();

    switch (imagePosition) {
      case "top":
        return (
          <>
            {image}
            {header}
            {body}
            {footer}
          </>
        );
      case "bottom":
        return (
          <>
            {header}
            {body}
            {image}
            {footer}
          </>
        );
      case "left":
        return (
          <View style={styles.horizontalLayout}>
            {image}
            <View style={styles.verticalContent}>
              {header}
              {body}
              {footer}
            </View>
          </View>
        );
      case "right":
        return (
          <View style={styles.horizontalLayout}>
            <View style={styles.verticalContent}>
              {header}
              {body}
              {footer}
            </View>
            {image}
          </View>
        );
      case "background":
        return (
          <>
            {image}
            <View style={styles.overlayContent}>
              {header}
              {body}
              {footer}
            </View>
          </>
        );
      default:
        return (
          <>
            {image}
            {header}
            {body}
            {footer}
          </>
        );
    }
  };

  // Render touchable card if onPress is provided
  if (onPress && !disabled) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
      >
        {renderCardContent()}
      </TouchableOpacity>
    );
  }

  // Render static card
  return (
    <View style={containerStyle} testID={testID}>
      {renderCardContent()}
    </View>
  );
}

/**
 * Get variant-specific styling
 * @param variant - Card variant type
 * @returns Style object for the variant
 */
function getVariantStyle(variant: CardVariant): ViewStyle {
  switch (variant) {
    case "outlined":
      return styles.outlined;
    case "elevated":
      return styles.elevated;
    case "filled":
      return styles.filled;
    case "default":
    default:
      return styles.default;
  }
}

/**
 * Get size-specific styling
 * @param size - Card size type
 * @returns Style object for the size
 */
function getSizeStyle(size: CardSize): ViewStyle {
  switch (size) {
    case "sm":
      return styles.small;
    case "lg":
      return styles.large;
    case "md":
    default:
      return styles.medium;
  }
}

/**
 * Get image positioning styles
 * @param position - Image position type
 * @param size - Card size for proportional sizing
 * @returns Style object for image position
 */
function getImagePositionStyle(
  position: ImagePosition,
  size: CardSize
): ImageStyle {
  const baseHeight = size === "sm" ? 120 : size === "lg" ? 200 : 160;

  switch (position) {
    case "top":
    case "bottom":
      return {
        width: "100%",
        height: baseHeight,
      };
    case "left":
    case "right":
      return {
        width: baseHeight * 0.75,
        height: baseHeight,
      };
    case "background":
      return {
        ...StyleSheet.absoluteFillObject,
        width: "100%",
        height: "100%",
      };
    default:
      return {
        width: "100%",
        height: baseHeight,
      };
  }
}

/**
 * Get size-specific title styling
 */
function getSizeTitleStyle(size: CardSize): TextStyle {
  switch (size) {
    case "sm":
      return { fontSize: 16 };
    case "lg":
      return { fontSize: 20 };
    case "md":
    default:
      return { fontSize: 18 };
  }
}

/**
 * Get size-specific subtitle styling
 */
function getSizeSubtitleStyle(size: CardSize): TextStyle {
  switch (size) {
    case "sm":
      return { fontSize: 12 };
    case "lg":
      return { fontSize: 16 };
    case "md":
    default:
      return { fontSize: 14 };
  }
}

/**
 * Get size-specific content styling
 */
function getSizeContentStyle(size: CardSize): TextStyle {
  switch (size) {
    case "sm":
      return { fontSize: 13 };
    case "lg":
      return { fontSize: 15 };
    case "md":
    default:
      return { fontSize: 14 };
  }
}

// Stylesheet for the Card component
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },

  // Variant styles
  default: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  outlined: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  elevated: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filled: {
    backgroundColor: "#f9fafb",
    borderWidth: 0,
  },

  // Size styles
  small: {
    padding: 12,
  },
  medium: {
    padding: 16,
  },
  large: {
    padding: 20,
  },

  // Layout styles
  header: {
    marginBottom: 8,
  },
  body: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 8,
  },

  // Text styles
  title: {
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    color: "#6b7280",
    fontWeight: "400",
  },
  content: {
    color: "#374151",
    lineHeight: 20,
  },

  // Image styles
  image: {
    borderRadius: 8,
  },

  // Layout helpers
  horizontalLayout: {
    flexDirection: "row",
  },
  verticalContent: {
    flex: 1,
    paddingLeft: 12,
  },
  overlayContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 16,
    justifyContent: "flex-end",
  },

  // State styles
  disabled: {
    opacity: 0.6,
  },
});

// Export additional components for granular control
export default Card;
