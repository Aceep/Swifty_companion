import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProjectItem({ project }) {
  // project = { name, status, final_mark, validated? }

  return (
    <View style={styles.container}>
      <Text style={styles.name}>{project.name}</Text>
      <Text>Status: {project.status}</Text>
      <Text>Final mark: {project.final_mark ?? "N/A"}</Text>
      <Text>Validated: {project.validated ? "✅" : "❌"}</Text>
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
