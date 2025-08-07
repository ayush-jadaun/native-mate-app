import React, { useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  ScrollView,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";

// Get screen dimensions
const { width: screenWidth } = Dimensions.get("window");

// Responsive utility functions
const getResponsiveValue = <T,>(small: T, medium: T, large: T): T => {
  if (screenWidth < 480) return small;
  if (screenWidth < 768) return medium;
  return large;
};

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface TabsProps {
  /**
   * Array of tab items
   */
  items: TabItem[];

  /**
   * Initial active tab ID
   */
  initialTab?: string;

  /**
   * Callback when tab changes
   */
  onTabChange?: (tabId: string) => void;

  /**
   * Tab variant
   * @default 'default'
   */
  variant?: "default" | "pills" | "underline" | "buttons";

  /**
   * Tab size
   * @default 'md'
   */
  size?: "sm" | "md" | "lg";

  /**
   * Enable scrollable tabs
   * @default false
   */
  scrollable?: boolean;

  /**
   * Tab alignment (when not scrollable)
   * @default 'start'
   */
  alignment?: "start" | "center" | "end" | "stretch";

  /**
   * Active tab color
   * @default '#3b82f6'
   */
  activeColor?: string;

  /**
   * Inactive tab color
   * @default '#6b7280'
   */
  inactiveColor?: string;

  /**
   * Custom container style
   */
  style?: ViewStyle;

  /**
   * Custom tab bar style
   */
  tabBarStyle?: ViewStyle;

  /**
   * Custom content container style
   */
  contentStyle?: ViewStyle;

  /**
   * Test ID
   */
  testID?: string;
}

export function Tabs({
  items,
  initialTab,
  onTabChange,
  variant = "default",
  size = "md",
  scrollable = false,
  alignment = "start",
  activeColor = "#3b82f6",
  inactiveColor = "#6b7280",
  style,
  tabBarStyle,
  contentStyle,
  testID,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab || items[0]?.id);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabPress = useCallback(
    (tabId: string) => {
      const tab = items.find((item) => item.id === tabId);
      if (tab?.disabled) return;

      setActiveTab(tabId);
      onTabChange?.(tabId);
    },
    [items, onTabChange]
  );

  const getSizeStyles = () => {
    const sizeMap = {
      sm: { fontSize: 12, padding: 8, minHeight: 32 },
      md: { fontSize: 14, padding: 12, minHeight: 40 },
      lg: { fontSize: 16, padding: 16, minHeight: 48 },
    };
    return sizeMap[size];
  };

  const sizeStyles = getSizeStyles();

  const getTabStyles = (isActive: boolean, disabled?: boolean) => {
    const baseStyles = [styles.tab, { minHeight: sizeStyles.minHeight }];

    if (disabled) {
      baseStyles.push(styles.tabDisabled);
    }

    switch (variant) {
      case "pills":
        baseStyles.push(
          styles.tabPill,
          isActive ? styles.tabPillActive : styles.tabPillInactive
        );
        break;
      case "underline":
        baseStyles.push(
          styles.tabUnderline,
          isActive ? styles.tabUnderlineActive : styles.tabUnderlineInactive
        );
        break;
      case "buttons":
        baseStyles.push(
          {
            ...styles.tabButton,
            ...(isActive ? styles.tabButtonActive : styles.tabButtonInactive),
          }
        );
        break;
      default:
        baseStyles.push(
          styles.tabDefault,
          isActive ? styles.tabDefaultActive : styles.tabDefaultInactive
        );
    }

    return baseStyles;
  };

  const getAlignmentStyle = () => {
    if (scrollable) return {};

    const alignmentMap = {
      start: { justifyContent: "flex-start" as const },
      center: { justifyContent: "center" as const },
      end: { justifyContent: "flex-end" as const },
      stretch: { flex: 1 },
    };

    return alignmentMap[alignment];
  };

  const renderTabBar = () => {
    const TabContainer = scrollable ? ScrollView : View;
    const containerProps = scrollable
      ? {
          horizontal: true,
          showsHorizontalScrollIndicator: false,
          ref: scrollViewRef,
        }
      : {};

    return (
      <TabContainer
        {...containerProps}
        style={[styles.tabBar, tabBarStyle]}
        contentContainerStyle={
          scrollable ? undefined : [styles.tabBarContent, getAlignmentStyle()]
        }
      >
        {items.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                ...getTabStyles(isActive, item.disabled),
                alignment === "stretch" && !scrollable ? { flex: 1 } : {},
                { padding: sizeStyles.padding },
              ]}
              onPress={() => handleTabPress(item.id)}
              disabled={item.disabled}
              testID={`${testID}-tab-${item.id}`}
            >
              <View style={styles.tabContent}>
                {item.icon && <View style={styles.tabIcon}>{item.icon}</View>}
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      fontSize: sizeStyles.fontSize,
                      color: isActive ? activeColor : inactiveColor,
                    },
                    item.disabled && styles.tabLabelDisabled,
                  ]}
                >
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </TabContainer>
    );
  };

  const renderContent = () => {
    const activeItem = items.find((item) => item.id === activeTab);
    if (!activeItem) return null;

    return (
      <View style={[styles.tabContentContainer, contentStyle]}>
        {activeItem.content}
      </View>
    );
  };

  return (
    <View style={[styles.tabsContainer, style]} testID={testID}>
      {renderTabBar()}
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    flex: 1,
  },
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tabBarContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tab: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
  },
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontWeight: "500",
    textAlign: "center",
  },
  tabDisabled: {
    opacity: 0.5,
  },
  tabLabelDisabled: {
    color: "#9ca3af",
  },

  // Tab Variants
  tabDefault: {
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabDefaultActive: {
    borderBottomColor: "#3b82f6",
  },
  tabDefaultInactive: {},

  tabPill: {
    borderRadius: 20,
    marginHorizontal: 4,
  },
  tabPillActive: {
    backgroundColor: "#3b82f6",
  },
  tabPillInactive: {
    backgroundColor: "transparent",
  },

  tabUnderline: {
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabUnderlineActive: {
    borderBottomColor: "#3b82f6",
  },
  tabUnderlineInactive: {},

  tabButton: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    marginHorizontal: 2,
    borderRadius: 6,
  },
  tabButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  tabButtonInactive: {
    backgroundColor: "transparent",
  },

  // Tab Content
  tabContentContainer: {
    flex: 1,
    padding: getResponsiveValue(12, 16, 20),
  },
} as { [key: string]: ViewStyle | any });
