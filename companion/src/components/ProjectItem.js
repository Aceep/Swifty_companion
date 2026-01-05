import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProjectItem({ project }) {
  const { final_mark, name, status, validated } = project;
  console.log('📄 [ProjectItem] Rendering project:', project.project.name, project);

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{project.project.name}</Text>
      <Text>Status: {status}</Text>
      <Text>Final mark: {final_mark ?? "N/A"}</Text>
      <Text>Validated: {validated ? "✅" : "❌"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
