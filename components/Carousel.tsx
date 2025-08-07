import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  ViewStyle,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
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

function getResponsiveValue<T>(small: T, medium: T, large: T): T {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
}

export interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

export interface CarouselProps {
  /**
   * Array of items to display
   */
  data: CarouselItem[];

  /**
   * Item width (auto-calculated if not provided)
   */
  itemWidth?: number;

  /**
   * Item height
   */
  itemHeight?: number;

  /**
   * Enable auto-play
   * @default false
   */
  autoPlay?: boolean;

  /**
   * Auto-play interval in milliseconds
   * @default 3000
   */
  autoPlayInterval?: number;

  /**
   * Enable infinite scroll
   * @default true
   */
  infinite?: boolean;

  /**
   * Show pagination dots
   * @default true
   */
  showPagination?: boolean;

  /**
   * Show navigation arrows
   * @default false
   */
  showArrows?: boolean;

  /**
   * Current slide index
   */
  initialIndex?: number;

  /**
   * Callback when slide changes
   */
  onSlideChange?: (index: number) => void;

  /**
   * Custom container style
   */
  style?: ViewStyle;

  /**
   * Pagination container style
   */
  paginationStyle?: ViewStyle;

  /**
   * Active dot style
   */
  activeDotStyle?: ViewStyle;

  /**
   * Inactive dot style
   */
  inactiveDotStyle?: ViewStyle;

  /**
   * Test ID
   */
  testID?: string;
}

export function Carousel({
  data,
  itemWidth = screenWidth * 0.8,
  itemHeight = 200,
  autoPlay = false,
  autoPlayInterval = 3000,
  infinite = true,
  showPagination = true,
  showArrows = false,
  initialIndex = 0,
  onSlideChange,
  style,
  paginationStyle,
  activeDotStyle,
  inactiveDotStyle,
  testID,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayRef = useRef<number | null>(null);

  const itemSpacing = getResponsiveValue(10, 15, 20);
  const totalItemWidth = itemWidth + itemSpacing;

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && data.length > 1) {
      autoPlayRef.current = setInterval(() => {
        const nextIndex = infinite
          ? (currentIndex + 1) % data.length
          : Math.min(currentIndex + 1, data.length - 1);

        if (nextIndex !== currentIndex) {
          goToSlide(nextIndex);
        }
      }, autoPlayInterval);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, currentIndex, data.length, infinite, autoPlayInterval]);

  const goToSlide = useCallback(
    (index: number) => {
      const targetIndex = Math.max(0, Math.min(index, data.length - 1));
      setCurrentIndex(targetIndex);
      onSlideChange?.(targetIndex);

      scrollViewRef.current?.scrollTo({
        x: targetIndex * totalItemWidth,
        animated: true,
      });
    },
    [data.length, totalItemWidth, onSlideChange]
  );

  const handleScroll = useCallback(
    (event: any) => {
      const contentOffsetX = event.nativeEvent.contentOffset.x;
      const newIndex = Math.round(contentOffsetX / totalItemWidth);

      if (
        newIndex !== currentIndex &&
        newIndex >= 0 &&
        newIndex < data.length
      ) {
        setCurrentIndex(newIndex);
        onSlideChange?.(newIndex);
      }
    },
    [currentIndex, data.length, totalItemWidth, onSlideChange]
  );

  const renderPagination = () => {
    if (!showPagination) return null;

    return (
      <View style={[styles.carouselPagination, paginationStyle]}>
        {data.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.carouselDot,
              index === currentIndex
                ? { ...styles.carouselActiveDot, ...activeDotStyle }
                : { ...styles.carouselInactiveDot, ...inactiveDotStyle },
            ]}
            onPress={() => goToSlide(index)}
            testID={`${testID}-dot-${index}`}
          />
        ))}
      </View>
    );
  };

  const renderArrows = () => {
    if (!showArrows) return null;

    return (
      <>
        <TouchableOpacity
          style={[styles.carouselArrow, styles.carouselArrowLeft]}
          onPress={() => goToSlide(currentIndex - 1)}
          disabled={!infinite && currentIndex === 0}
        >
          <Text style={styles.carouselArrowText}>‹</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.carouselArrow, styles.carouselArrowRight]}
          onPress={() => goToSlide(currentIndex + 1)}
          disabled={!infinite && currentIndex === data.length - 1}
        >
          <Text style={styles.carouselArrowText}>›</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={[styles.carouselContainer, style]} testID={testID}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        contentContainerStyle={styles.carouselContent}
        style={{ height: itemHeight }}
      >
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.carouselItem,
              {
                width: itemWidth,
                height: itemHeight,
                marginRight: index < data.length - 1 ? itemSpacing : 0,
              },
            ]}
          >
            {item.content}
          </View>
        ))}
      </ScrollView>
      {renderPagination()}
      {renderArrows()}
    </View>
  );
}

const styles = StyleSheet.create({
  carouselContainer: {
    position: "relative",
  },
  carouselContent: {
    paddingHorizontal: getResponsiveValue(10, 15, 20),
  },
  carouselItem: {
    borderRadius: getResponsiveValue(8, 10, 12),
    overflow: "hidden",
  },
  carouselPagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: getResponsiveValue(12, 16, 20),
  },
  carouselDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  carouselActiveDot: {
    backgroundColor: "#3b82f6",
    transform: [{ scale: 1.2 }],
  },
  carouselInactiveDot: {
    backgroundColor: "#d1d5db",
  },
  carouselArrow: {
    position: "absolute",
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    transform: [{ translateY: -20 }],
  },
  carouselArrowLeft: {
    left: 10,
  },
  carouselArrowRight: {
    right: 10,
  },
  carouselArrowText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#374151",
  },
});
