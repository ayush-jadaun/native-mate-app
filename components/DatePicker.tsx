import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
  ScrollView,
  Pressable,
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
 * DatePicker mode types
 */
export type DatePickerMode = "date" | "time" | "datetime" | "month" | "year";

/**
 * DatePicker size types
 */
export type DatePickerSize = "sm" | "md" | "lg";

/**
 * DatePicker variant types
 */
export type DatePickerVariant = "default" | "outlined" | "filled" | "minimal";

/**
 * Date format types
 */
export type DateFormat =
  | "DD/MM/YYYY"
  | "MM/DD/YYYY"
  | "YYYY-MM-DD"
  | "DD MMM YYYY"
  | "MMM DD, YYYY"
  | "custom";

/**
 * Props for the DatePicker component
 */
export interface DatePickerProps {
  /**
   * Currently selected date
   */
  value?: Date;

  /**
   * Callback when date is selected
   */
  onChange: (date: Date) => void;

  /**
   * DatePicker mode
   * @default 'date'
   */
  mode?: DatePickerMode;

  /**
   * DatePicker size
   * @default 'md'
   */
  size?: DatePickerSize;

  /**
   * DatePicker variant
   * @default 'default'
   */
  variant?: DatePickerVariant;

  /**
   * Date display format
   * @default 'DD/MM/YYYY'
   */
  format?: DateFormat;

  /**
   * Custom date format string (when format is 'custom')
   */
  customFormat?: string;

  /**
   * Placeholder text when no date is selected
   * @default 'Select date'
   */
  placeholder?: string;

  /**
   * Minimum selectable date
   */
  minDate?: Date;

  /**
   * Maximum selectable date
   */
  maxDate?: Date;

  /**
   * Whether the picker is disabled
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the picker is required
   * @default false
   */
  required?: boolean;

  /**
   * Label text
   */
  label?: string;

  /**
   * Helper text below the picker
   */
  helperText?: string;

  /**
   * Error text (shows error state)
   */
  error?: string;

  /**
   * Icon component to display
   */
  icon?: React.ReactNode;

  /**
   * Whether to show clear button when date is selected
   * @default true
   */
  showClear?: boolean;

  /**
   * Whether to show today button in modal
   * @default true
   */
  showToday?: boolean;

  /**
   * Custom container style
   */
  style?: ViewStyle | ViewStyle[];

  /**
   * Custom input container style
   */
  inputStyle?: ViewStyle;

  /**
   * Custom text style
   */
  textStyle?: TextStyle;

  /**
   * Custom label style
   */
  labelStyle?: TextStyle;

  /**
   * Custom helper text style
   */
  helperTextStyle?: TextStyle;

  /**
   * Custom error text style
   */
  errorTextStyle?: TextStyle;

  /**
   * Custom modal style
   */
  modalStyle?: ViewStyle;

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
   * Callback when picker is opened
   */
  onOpen?: () => void;

  /**
   * Callback when picker is closed
   */
  onClose?: () => void;
}

/**
 * A comprehensive DatePicker component for React Native
 *
 * Features:
 * - Multiple modes (date, time, datetime, month, year)
 * - Responsive design across all screen sizes
 * - Multiple variants and sizes
 * - Flexible date formatting options
 * - Min/max date constraints
 * - Error and validation states
 * - Full accessibility support
 * - Customizable styling
 * - Professional calendar interface
 *
 * @param value - Currently selected date
 * @param onChange - Callback when date changes
 * @param mode - Picker mode (date, time, datetime, etc.)
 * @param variant - Visual style variant
 * @param format - Date display format
 * @param placeholder - Placeholder text
 * @param disabled - Whether picker is disabled
 * @param label - Label text above picker
 * @param error - Error message (enables error state)
 */
export function DatePicker({
  value,
  onChange,
  mode = "date",
  size = "md",
  variant = "default",
  format = "DD/MM/YYYY",
  customFormat,
  placeholder = "Select date",
  minDate,
  maxDate,
  disabled = false,
  required = false,
  label,
  helperText,
  error,
  icon,
  showClear = true,
  showToday = true,
  style,
  inputStyle,
  textStyle,
  labelStyle,
  helperTextStyle,
  errorTextStyle,
  modalStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  onOpen,
  onClose,
}: DatePickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value || new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());

  // Get responsive styles
  const variantStyles = getVariantStyles(variant, !!error, disabled);
  const sizeStyles = getSizeStyles(size);

  // Format date for display
  const formatDate = useCallback(
    (date: Date): string => {
      if (!date) return "";

      switch (format) {
        case "DD/MM/YYYY":
          return `${date.getDate().toString().padStart(2, "0")}/${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        case "MM/DD/YYYY":
          return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
        case "YYYY-MM-DD":
          return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        case "DD MMM YYYY":
          return `${date.getDate().toString().padStart(2, "0")} ${getMonthName(
            date.getMonth(),
            true
          )} ${date.getFullYear()}`;
        case "MMM DD, YYYY":
          return `${getMonthName(date.getMonth(), true)} ${date
            .getDate()
            .toString()
            .padStart(2, "0")}, ${date.getFullYear()}`;
        case "custom":
          return customFormat
            ? formatCustomDate(date, customFormat)
            : date.toLocaleDateString();
        default:
          return date.toLocaleDateString();
      }
    },
    [format, customFormat]
  );

  // Get month name
  const getMonthName = (monthIndex: number, short: boolean = false): string => {
    const months = short
      ? [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ]
      : [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
    return months[monthIndex];
  };

  // Custom date formatting
  const formatCustomDate = (date: Date, formatString: string): string => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return formatString
      .replace(/YYYY/g, year.toString())
      .replace(/YY/g, year.toString().slice(-2))
      .replace(/MM/g, month.toString().padStart(2, "0"))
      .replace(/M/g, month.toString())
      .replace(/DD/g, day.toString().padStart(2, "0"))
      .replace(/D/g, day.toString());
  };

  // Generate calendar days
  const generateCalendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentMonth]);

  // Check if date is selectable
  const isDateSelectable = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (!isDateSelectable(date)) return;

    setSelectedDate(date);
    onChange(date);
    setIsModalVisible(false);
    onClose?.();
  };

  // Handle clear
  const handleClear = () => {
    setSelectedDate(new Date());
    onChange(new Date());
  };

  // Handle today
  const handleToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    onChange(today);
    setIsModalVisible(false);
    onClose?.();
  };

  // Open modal
  const openModal = () => {
    if (disabled) return;
    setIsModalVisible(true);
    onOpen?.();
  };

  // Render calendar header
  const renderCalendarHeader = () => (
    <View style={styles.calendarHeader}>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() =>
          setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
          )
        }
      >
        <Text style={styles.navButtonText}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.monthYearText}>
        {getMonthName(currentMonth.getMonth())} {currentMonth.getFullYear()}
      </Text>

      <TouchableOpacity
        style={styles.navButton}
        onPress={() =>
          setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
          )
        }
      >
        <Text style={styles.navButtonText}>›</Text>
      </TouchableOpacity>
    </View>
  );

  // Render weekday headers
  const renderWeekdayHeaders = () => (
    <View style={styles.weekdayHeader}>
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <Text key={day} style={styles.weekdayText}>
          {day}
        </Text>
      ))}
    </View>
  );

  // Render calendar days
  const renderCalendarDays = () => {
    const weeks = [];
    for (let i = 0; i < generateCalendarDays.length; i += 7) {
      const week = generateCalendarDays.slice(i, i + 7);
      weeks.push(
        <View key={i} style={styles.weekRow}>
          {week.map((day, index) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isSelected =
              value && day.toDateString() === value.toDateString();
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelectable = isDateSelectable(day);

            return (
              <TouchableOpacity
                key={`${i}-${index}`}
                style={[
                  styles.dayButton,
                  isSelected && styles.selectedDay,
                  isToday && !isSelected && styles.todayDay,
                  !isCurrentMonth && styles.otherMonthDay,
                  !isSelectable && styles.disabledDay,
                ]}
                onPress={() => handleDateSelect(day)}
                disabled={!isSelectable}
              >
                <Text
                  style={[
                    styles.dayText,
                    isSelected && styles.selectedDayText,
                    !isCurrentMonth && styles.otherMonthText,
                    !isSelectable && styles.disabledDayText,
                  ]}
                >
                  {day.getDate()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
    }
    return weeks;
  };

  // Render modal content
  const renderModalContent = () => (
    <View style={[styles.modalContent, modalStyle]}>
      <View style={styles.modalHeader}>
        <Text style={styles.modalTitle}>Select Date</Text>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setIsModalVisible(false)}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>

      {renderCalendarHeader()}
      {renderWeekdayHeaders()}

      <ScrollView style={styles.calendarContainer}>
        {renderCalendarDays()}
      </ScrollView>

      <View style={styles.modalFooter}>
        {showToday && (
          <TouchableOpacity style={styles.todayButton} onPress={handleToday}>
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setIsModalVisible(false)}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Combine container styles
  const containerStyles = [styles.container, style];

  const inputContainerStyles = [
    styles.inputContainer,
    variantStyles.container,
    sizeStyles.container,
    inputStyle,
  ];

  const displayTextStyles = [
    styles.text,
    variantStyles.text,
    sizeStyles.text,
    !value && styles.placeholderText,
    textStyle,
  ];

  return (
    <View style={containerStyles} testID={testID}>
      {label && (
        <Text
          style={[
            styles.label,
            sizeStyles.label,
            error && styles.errorLabel,
            labelStyle,
          ]}
          testID={testID ? `${testID}-label` : undefined}
        >
          {label}
          {required && <Text style={styles.requiredStar}> *</Text>}
        </Text>
      )}

      <TouchableOpacity
        style={inputContainerStyles}
        onPress={openModal}
        disabled={disabled}
        activeOpacity={0.7}
        accessibilityLabel={accessibilityLabel || placeholder}
        accessibilityHint={accessibilityHint || "Tap to select date"}
        accessibilityRole="button"
        testID={testID ? `${testID}-input` : undefined}
      >
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <Text style={displayTextStyles}>
          {value ? formatDate(value) : placeholder}
        </Text>

        {showClear && value && !disabled && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClear}
            testID={testID ? `${testID}-clear` : undefined}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {(helperText || error) && (
        <Text
          style={[
            styles.helperText,
            sizeStyles.helperText,
            error ? styles.errorText : {},
            error ? errorTextStyle : helperTextStyle,
          ]}
          testID={
            testID ? `${testID}-${error ? "error" : "helper"}` : undefined
          }
        >
          {error || helperText}
        </Text>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsModalVisible(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            {renderModalContent()}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

/**
 * Get variant-specific styles
 */
function getVariantStyles(
  variant: DatePickerVariant,
  hasError: boolean,
  disabled: boolean
) {
  const baseStyles = {
    container: {
      borderWidth: 1,
      backgroundColor: "#ffffff",
      borderColor: "#e5e7eb", // Add default borderColor
    },
    text: {
      color: "#374151",
    },
  };

  if (hasError) {
    baseStyles.container.borderColor = "#ef4444";
    return baseStyles;
  }

  if (disabled) {
    baseStyles.container.backgroundColor = "#f3f4f6";
    baseStyles.container.borderColor = "#d1d5db";
    baseStyles.text.color = "#9ca3af";
    return baseStyles;
  }

  switch (variant) {
    case "outlined":
      return {
        container: {
          ...baseStyles.container,
          borderColor: "#d1d5db",
          backgroundColor: "transparent",
        },
        text: baseStyles.text,
      };
    case "filled":
      return {
        container: {
          ...baseStyles.container,
          borderColor: "transparent",
          backgroundColor: "#f9fafb",
        },
        text: baseStyles.text,
      };
    case "minimal":
      return {
        container: {
          ...baseStyles.container,
          borderWidth: 0,
          borderBottomWidth: 1,
          borderColor: "#d1d5db",
          backgroundColor: "transparent",
          borderRadius: 0,
        },
        text: baseStyles.text,
      };
    default:
      return {
        container: {
          ...baseStyles.container,
          borderColor: "#e5e7eb",
        },
        text: baseStyles.text,
      };
  }
}

/**
 * Get size-specific styles
 */
function getSizeStyles(size: DatePickerSize) {
  switch (size) {
    case "sm":
      return {
        container: {
          paddingVertical: getResponsiveValue(8, 10, 12),
          paddingHorizontal: getResponsiveValue(12, 14, 16),
          borderRadius: getResponsiveValue(4, 6, 8),
        },
        text: {
          fontSize: getResponsiveFontSize(14),
        },
        label: {
          fontSize: getResponsiveFontSize(12),
          marginBottom: 4,
        },
        helperText: {
          fontSize: getResponsiveFontSize(11),
          marginTop: 4,
        },
      };
    case "lg":
      return {
        container: {
          paddingVertical: getResponsiveValue(16, 18, 20),
          paddingHorizontal: getResponsiveValue(16, 18, 20),
          borderRadius: getResponsiveValue(8, 10, 12),
        },
        text: {
          fontSize: getResponsiveFontSize(18),
        },
        label: {
          fontSize: getResponsiveFontSize(16),
          marginBottom: 8,
        },
        helperText: {
          fontSize: getResponsiveFontSize(14),
          marginTop: 6,
        },
      };
    default:
      return {
        container: {
          paddingVertical: getResponsiveValue(12, 14, 16),
          paddingHorizontal: getResponsiveValue(14, 16, 18),
          borderRadius: getResponsiveValue(6, 8, 10),
        },
        text: {
          fontSize: getResponsiveFontSize(16),
        },
        label: {
          fontSize: getResponsiveFontSize(14),
          marginBottom: 6,
        },
        helperText: {
          fontSize: getResponsiveFontSize(12),
          marginTop: 5,
        },
      };
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    flex: 1,
    includeFontPadding: false,
  },
  placeholderText: {
    color: "#9ca3af",
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearButtonText: {
    color: "#6b7280",
    fontSize: 16,
  },
  label: {
    fontWeight: "500",
    color: "#374151",
  },
  requiredStar: {
    color: "#ef4444",
  },
  errorLabel: {
    color: "#ef4444",
  },
  helperText: {
    color: "#6b7280",
  },
  errorText: {
    color: "#ef4444",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: screenHeight * 0.8,
    width: Math.min(screenWidth - 40, 400),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#6b7280",
  },

  // Calendar styles
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: "#4f46e5",
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  weekdayHeader: {
    flexDirection: "row",
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "500",
    color: "#6b7280",
    paddingVertical: 8,
  },
  calendarContainer: {
    maxHeight: 300,
  },
  weekRow: {
    flexDirection: "row",
  },
  dayButton: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
  },
  selectedDay: {
    backgroundColor: "#4f46e5",
  },
  todayDay: {
    backgroundColor: "#e0e7ff",
  },
  otherMonthDay: {
    opacity: 0.3,
  },
  disabledDay: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 14,
    color: "#374151",
  },
  selectedDayText: {
    color: "#ffffff",
    fontWeight: "600",
  },
  otherMonthText: {
    color: "#9ca3af",
  },
  disabledDayText: {
    color: "#d1d5db",
  },

  // Modal footer
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  todayButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#f3f4f6",
  },
  todayButtonText: {
    color: "#4f46e5",
    fontWeight: "500",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: "#6b7280",
    fontWeight: "500",
  },
});

export default DatePicker;
