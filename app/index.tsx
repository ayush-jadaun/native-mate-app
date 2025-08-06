import { Text, View, StyleSheet } from "react-native";
import React from "react";
import Button from "@/components/Button";

const Index = () => {

    const handlePress = () => {
        console.log("Button pressed");
      };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>index</Text>
      <Button title="Primary" onPress={handlePress} />

      <Button title="Outline" onPress={handlePress} variant="outline" />

      <Button title="Ghost" onPress={handlePress} variant="ghost" />

      <Button title="Loading..." onPress={handlePress} loading />

      <Button title="Disabled" onPress={handlePress} disabled />
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // vertical center
    alignItems: "center", // horizontal center
    backgroundColor: "#fff", // optional
  },
  text: {
    marginBottom: 20, // spacing between text and button
    fontSize: 18,
  },
});
