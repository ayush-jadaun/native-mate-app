import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { Carousel, CarouselItem } from "../components/Carousel";
import { Progress } from "../components/progress";
import { Toast, ToastProvider, useToast, toast } from "../components/Toast";
import { Tabs, TabItem } from "../components/Tabs";

const TestComponents = () => {
  const { showToast } = useToast();
  const [progress, setProgress] = useState(25);
  const [toastVisible, setToastVisible] = useState(false);

  // Sample carousel data
  const carouselData: CarouselItem[] = [
    {
      id: "1",
      content: (
        <View style={styles.carouselItem}>
          <Text style={styles.carouselText}>Slide 1</Text>
          <Text style={styles.carouselSubtext}>
            Beautiful carousel component
          </Text>
        </View>
      ),
    },
    {
      id: "2",
      content: (
        <View style={[styles.carouselItem, { backgroundColor: "#e7f3ff" }]}>
          <Text style={styles.carouselText}>Slide 2</Text>
          <Text style={styles.carouselSubtext}>Auto-play and pagination</Text>
        </View>
      ),
    },
    {
      id: "3",
      content: (
        <View style={[styles.carouselItem, { backgroundColor: "#f0f9ff" }]}>
          <Text style={styles.carouselText}>Slide 3</Text>
          <Text style={styles.carouselSubtext}>Swipe to navigate</Text>
        </View>
      ),
    },
  ];

  // Sample tabs data
  const tabsData: TabItem[] = [
    {
      id: "overview",
      label: "Overview",
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Overview Content</Text>
          <Text style={styles.tabDescription}>
            This is the overview tab showcasing our component library.
          </Text>

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Progress Examples:</Text>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Linear Progress (25%)</Text>
              <Progress value={25} showText />
            </View>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Success Progress (75%)</Text>
              <Progress value={75} color="#10b981" showText />
            </View>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Large Progress (50%)</Text>
              <Progress value={50} size="lg" color="#f59e0b" showText />
            </View>
          </View>
        </View>
      ),
    },
    {
      id: "components",
      label: "Components",
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Component Gallery</Text>
          <Text style={styles.tabDescription}>
            Test different toast notifications:
          </Text>

          <View style={styles.buttonGrid}>
            <View style={styles.buttonRow}>
              <View
                style={[styles.button, styles.successButton]}
                onTouchEnd={() =>
                  showToast({
                    message: "Success! Operation completed.",
                    type: "success",
                  })
                }
              >
                <Text style={styles.buttonText}>Success Toast</Text>
              </View>

              <View
                style={[styles.button, styles.errorButton]}
                onTouchEnd={() =>
                  showToast({
                    message: "Error! Something went wrong.",
                    type: "error",
                  })
                }
              >
                <Text style={styles.buttonText}>Error Toast</Text>
              </View>
            </View>

            <View style={styles.buttonRow}>
              <View
                style={[styles.button, styles.warningButton]}
                onTouchEnd={() =>
                  showToast({
                    message: "Warning! Please check this.",
                    type: "warning",
                  })
                }
              >
                <Text style={styles.buttonText}>Warning Toast</Text>
              </View>

              <View
                style={[styles.button, styles.infoButton]}
                onTouchEnd={() =>
                  showToast({
                    message: "Info: Here is some information.",
                    type: "info",
                  })
                }
              >
                <Text style={styles.buttonText}>Info Toast</Text>
              </View>
            </View>
          </View>
        </View>
      ),
    },
    {
      id: "progress",
      label: "Progress",
      content: (
        <View style={styles.tabContent}>
          <Text style={styles.tabTitle}>Progress Variants</Text>

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Different Sizes:</Text>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Small (sm)</Text>
              <Progress value={30} size="sm" />
            </View>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Medium (md) - Default</Text>
              <Progress value={60} size="md" />
            </View>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Large (lg)</Text>
              <Progress value={80} size="lg" />
            </View>

            <View style={styles.progressItem}>
              <Text style={styles.progressLabel}>Extra Large (xl)</Text>
              <Progress value={45} size="xl" />
            </View>
          </View>

          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Circular Progress:</Text>
            <View style={styles.circularContainer}>
              <Progress value={75} variant="circular" showText />
            </View>
          </View>
        </View>
      ),
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>UI Component Library</Text>
        <Text style={styles.subtitle}>
          Testing Carousel, Progress, Toast & Tabs
        </Text>
      </View>

      {/* Carousel Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Carousel Component</Text>
        <Carousel
          data={carouselData}
          autoPlay
          autoPlayInterval={4000}
          showPagination
          showArrows
          itemHeight={150}
          onSlideChange={(index) => console.log("Slide changed to:", index)}
        />
      </View>

      {/* Tabs Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tabs Component</Text>
        <Tabs
          items={tabsData}
          variant="underline"
          size="md"
          onTabChange={(tabId) => console.log("Tab changed to:", tabId)}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🎉 All components are working perfectly!
        </Text>
      </View>
    </ScrollView>
  );
};

const index = () => {
  return (
    <ToastProvider>
      <TestComponents />
      <Toast visible={false} message="" onDismiss={() => {}} />
    </ToastProvider>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 12,
  },

  // Carousel Styles
  carouselItem: {
    flex: 1,
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  carouselText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  carouselSubtext: {
    fontSize: 16,
    color: "#3730a3",
    textAlign: "center",
  },

  // Tab Styles
  tabContent: {
    padding: 16,
  },
  tabTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  tabDescription: {
    fontSize: 16,
    color: "#64748b",
    marginBottom: 20,
    lineHeight: 24,
  },

  // Progress Styles
  progressSection: {
    marginBottom: 24,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  circularContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },

  // Button Styles
  buttonGrid: {
    gap: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  successButton: {
    backgroundColor: "#10b981",
  },
  errorButton: {
    backgroundColor: "#ef4444",
  },
  warningButton: {
    backgroundColor: "#f59e0b",
  },
  infoButton: {
    backgroundColor: "#3b82f6",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    color: "#059669",
    fontWeight: "500",
  },
});
