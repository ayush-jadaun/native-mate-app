import { Text, View, StyleSheet, ScrollView, Alert } from "react-native";
import React from "react";
import Button from "@/components/Button";
import { Card } from "@/components/Card";

const Index = () => {

  const handleCardPress = (cardType: string) => {
    Alert.alert("Card Pressed", `You pressed the ${cardType} card!`);
  };

  const handleLikePress = () => {
    Alert.alert("Liked!", "You liked this post");
  };

  const handleSharePress = () => {
    Alert.alert("Share", "Sharing this content...");
  };

  const handleBookmarkPress = () => {
    Alert.alert("Bookmarked", "Added to your bookmarks");
  };

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <Button
        title="Like"
        onPress={handleLikePress}
        style={styles.actionButton}
        variant="outline"
        size="sm"
      />
      <Button
        title="Share"
        onPress={handleSharePress}
        style={styles.actionButton}
        variant="outline"
        size="sm"
      />
      <Button
        title="Save"
        onPress={handleBookmarkPress}
        style={styles.actionButton}
        variant="filled"
        size="sm"
      />
    </View>
  );

  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.avatar} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileName}>John Doe</Text>
        <Text style={styles.profileHandle}>@johndoe</Text>
      </View>
      <Text style={styles.timestamp}>2h ago</Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Card Component Examples</Text>

        {/* Basic Card */}
        <Card
          title="Welcome to Native-Mate"
          content="This is a basic card component with title and content. Perfect for displaying simple information."
          style={styles.cardSpacing}
        />

        {/* Card with Image */}
        <Card
          variant="elevated"
          title="Beautiful Landscape"
          subtitle="Nature Photography"
          content="Captured this amazing sunset during my hiking trip last weekend. The colors were absolutely breathtaking!"
          image={{ uri: "https://picsum.photos/400/200?random=1" }}
          imagePosition="top"
          footer={renderActionButtons()}
          style={styles.cardSpacing}
        />

        {/* Social Media Style Card */}
        <Card
          variant="default"
          header={renderProfileHeader()}
          content="Just finished building my first React Native app with Native-Mate components! The development experience has been amazing. Highly recommend checking it out! 🚀 #ReactNative #MobileDev"
          footer={renderActionButtons()}
          style={styles.cardSpacing}
        />

        {/* Product Card */}
        <Card
          variant="outlined"
          size="lg"
          title="Premium Headphones"
          subtitle="$199.99"
          content="High-quality wireless headphones with noise cancellation and 30-hour battery life."
          image={{ uri: "https://picsum.photos/400/200?random=2" }}
          imagePosition="left"
          footer={
            <View style={styles.productActions}>
              <Button
                title="Add to Cart"
                onPress={() => handleCardPress("product")}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="♡"
                onPress={handleLikePress}
                variant="outline"
                style={{ width: 50 }}
              />
            </View>
          }
          style={styles.cardSpacing}
        />

        {/* Touchable Card */}
        <Card
          variant="filled"
          title="Settings"
          subtitle="Tap to open"
          content="Configure your app preferences and account settings."
          onPress={() => handleCardPress("settings")}
          style={[styles.cardSpacing, styles.touchableCard]}
        >
          <View style={styles.settingsIcons}>
            <Text style={styles.icon}>⚙️</Text>
            <Text style={styles.icon}>🔔</Text>
            <Text style={styles.icon}>🔒</Text>
          </View>
        </Card>

        {/* Background Image Card */}
        <Card
          variant="elevated"
          title="Adventure Awaits"
          content="Discover new places and create unforgettable memories."
          image={{ uri: "https://picsum.photos/400/300?random=3" }}
          imagePosition="background"
          titleStyle={{ color: "white", fontWeight: "bold" }}
          contentStyle={{ color: "white" }}
          style={[styles.cardSpacing, { height: 200 }]}
          footer={
            <Button
              title="Explore Now"
              onPress={() => handleCardPress("adventure")}
              variant="filled"
              style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
            />
          }
        />

        {/* Notification Card */}
        <Card
          variant="outlined"
          size="sm"
          title="🎉 Congratulations!"
          content="You've successfully added your first card component!"
          footer={
            <Button
              title="Dismiss"
              onPress={() => handleCardPress("notification")}
              variant="outline"
              size="sm"
            />
          }
          style={[
            styles.cardSpacing,
            { borderColor: "#10b981", borderWidth: 2 },
          ]}
        />

        {/* Custom Content Card */}
        <Card
          variant="elevated"
          header={
            <View style={styles.customHeader}>
              <Text style={styles.customHeaderTitle}>Custom Header</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>NEW</Text>
              </View>
            </View>
          }
          style={styles.cardSpacing}
        >
          <View style={styles.customContent}>
            <Text style={styles.customContentText}>
              This card uses custom header and children content instead of the
              built-in title/content props.
            </Text>
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>1.2k</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>85</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Comments</Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{ height: 50 }} />
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: "#f5f5f5",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#1f2937",
  },
  cardSpacing: {
    marginBottom: 16,
  },

  // Action buttons styles
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },

  // Profile header styles
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e5e7eb",
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontWeight: "600",
    fontSize: 16,
    color: "#111827",
  },
  profileHandle: {
    fontSize: 14,
    color: "#6b7280",
  },
  timestamp: {
    fontSize: 12,
    color: "#9ca3af",
  },

  // Product card styles
  productActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  // Touchable card styles - FIXED: Removed borderStyle: "dashed"
  touchableCard: {
    borderWidth: 2,
    borderColor: "transparent",
    // borderStyle: "dashed", // Removed - not supported in React Native TypeScript
  },
  settingsIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
  },
  icon: {
    fontSize: 24,
  },

  // Custom header styles
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  customHeaderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  badge: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  // Custom content styles
  customContent: {
    padding: 4,
  },
  customContentText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    marginBottom: 16,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
});
