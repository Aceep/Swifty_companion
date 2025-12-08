import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SkillProgress({ skill, level }) {
  return (
    <View style={styles.container}>
      <Text>{skill} - {level}%</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${level}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 5 },
  barBackground: { height: 8, backgroundColor: '#ccc', borderRadius: 4 },
  barFill: { height: 8, backgroundColor: '#4CAF50', borderRadius: 4 },
});
