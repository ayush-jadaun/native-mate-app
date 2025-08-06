import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  GestureResponderEvent,
  ViewStyle,
  TextStyle,
} from "react-native";

export type ButtonVariant = "primary" | "outline" | "ghost";

export interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  borderRadius?: number;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  disabled = false,
  loading = false,
  variant = "primary",
  borderRadius = 8,
}) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "outline":
      case "ghost":
        return "transparent";
      default:
        return "#4F46E5"; // primary
    }
  };

  const getBorderStyle = () => {
    if (variant === "outline") {
      return {
        borderWidth: 2,
        borderColor: "#4F46E5",
      };
    }
    return {};
  };

  const getTextColor = () => {
    switch (variant) {
      case "primary":
        return "#fff";
      case "outline":
        return "#4F46E5";
      case "ghost":
        return "#4F46E5";
      default:
        return "#fff";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        styles.base,
        {
          backgroundColor: getBackgroundColor(),
          borderRadius,
        },
        getBorderStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Button;
