import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SkillProgress({ skill, level }) {
  const percentage = Math.min(level * 10, 100);
  
  const getColor = (level) => {
    if (level < 30) return '#EF4444';
    if (level < 60) return '#F59E0B';
    if (level < 80) return '#10B981';
    return '#00babc';
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.skillName}>{skill}</Text>
        <Text style={styles.levelText}>{level.toFixed(2)}</Text>
      </View>
      <View style={styles.barBackground}>
        <View 
          style={[
            styles.barFill, 
            { 
              width: `${percentage}%`,
              backgroundColor: getColor(percentage)
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  skillName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  levelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  barBackground: { 
    height: 10, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { 
    height: 10, 
    borderRadius: 5,
  },
});
