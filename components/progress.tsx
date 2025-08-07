import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
  Text,
} from "react-native";

export type ProgressVariant = "linear" | "circular" | "semicircular";
export type ProgressSize = "sm" | "md" | "lg" | "xl";

export interface ProgressProps {
  /**
   * Progress value (0-100)
   */
  value: number;

  /**
   * Maximum value
   * @default 100
   */
  max?: number;

  /**
   * Minimum value
   * @default 0
   */
  min?: number;

  /**
   * Progress variant
   * @default 'linear'
   */
  variant?: ProgressVariant;

  /**
   * Progress size
   * @default 'md'
   */
  size?: ProgressSize;

  /**
   * Progress color
   * @default '#3b82f6'
   */
  color?: string;

  /**
   * Background color
   * @default '#e5e7eb'
   */
  backgroundColor?: string;

  /**
   * Show progress text
   * @default false
   */
  showText?: boolean;

  /**
   * Custom progress text
   */
  text?: string;

  /**
   * Text color
   * @default '#374151'
   */
  textColor?: string;

  /**
   * Animation duration
   * @default 500
   */
  animationDuration?: number;

  /**
   * Enable animation
   * @default true
   */
  animated?: boolean;

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

export function Progress({
  value,
  max = 100,
  min = 0,
  variant = "linear",
  size = "md",
  color = "#3b82f6",
  backgroundColor = "#e5e7eb",
  showText = false,
  text,
  textColor = "#374151",
  animationDuration = 500,
  animated = true,
  style,
  textStyle,
  testID,
}: ProgressProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const normalizedValue = Math.max(min, Math.min(max, value));
  const percentage = ((normalizedValue - min) / (max - min)) * 100;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: percentage,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedValue.setValue(percentage);
    }
  }, [percentage, animated, animationDuration, animatedValue]);

  const getSizeStyles = () => {
    const sizeMap = {
      sm: { height: 4, fontSize: 12, circularSize: 60 },
      md: { height: 8, fontSize: 14, circularSize: 80 },
      lg: { height: 12, fontSize: 16, circularSize: 100 },
      xl: { height: 16, fontSize: 18, circularSize: 120 },
    };
    return sizeMap[size];
  };

  const sizeStyles = getSizeStyles();

  const renderLinearProgress = () => (
    <View style={[styles.progressContainer, style]} testID={testID}>
      <View
        style={[
          styles.progressTrack,
          {
            height: sizeStyles.height,
            backgroundColor,
            borderRadius: sizeStyles.height / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressFill,
            {
              height: sizeStyles.height,
              backgroundColor: color,
              borderRadius: sizeStyles.height / 2,
              width: animatedValue.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
                extrapolate: "clamp",
              }),
            },
          ]}
        />
      </View>
      {showText && (
        <Text
          style={[
            styles.progressText,
            {
              color: textColor,
              fontSize: sizeStyles.fontSize,
            },
            textStyle,
          ]}
        >
          {text || `${Math.round(percentage)}%`}
        </Text>
      )}
    </View>
  );

  const renderCircularProgress = () => {
    const radius = (sizeStyles.circularSize - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [circumference, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.circularProgressContainer, style]} testID={testID}>
        <View
          style={{
            width: sizeStyles.circularSize,
            height: sizeStyles.circularSize,
            position: "relative",
          }}
        >
          {/* Background circle */}
          <View
            style={{
              width: sizeStyles.circularSize,
              height: sizeStyles.circularSize,
              borderRadius: sizeStyles.circularSize / 2,
              borderWidth: 10,
              borderColor: backgroundColor,
              position: "absolute",
            }}
          />

          {/* Progress circle - simplified for React Native */}
          <Animated.View
            style={{
              width: sizeStyles.circularSize,
              height: sizeStyles.circularSize,
              borderRadius: sizeStyles.circularSize / 2,
              borderWidth: 10,
              borderColor: color,
              position: "absolute",
              transform: [{ rotate: "-90deg" }],
            }}
          />

          {showText && (
            <View style={styles.circularProgressTextContainer}>
              <Text
                style={[
                  styles.circularProgressText,
                  {
                    color: textColor,
                    fontSize: sizeStyles.fontSize,
                  },
                  textStyle,
                ]}
              >
                {text || `${Math.round(percentage)}%`}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  switch (variant) {
    case "circular":
    case "semicircular":
      return renderCircularProgress();
    case "linear":
    default:
      return renderLinearProgress();
  }
}

const styles = StyleSheet.create({
  progressContainer: {
    alignItems: "center",
  },
  progressTrack: {
    width: "100%",
    overflow: "hidden",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  progressText: {
    marginTop: 8,
    fontWeight: "500",
  },
  circularProgressContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgressTextContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  circularProgressText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
