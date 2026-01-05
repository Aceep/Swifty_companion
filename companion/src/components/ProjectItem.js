import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ProjectItem({ project }) {
  const { final_mark, status } = project;
  const validated = project["validated?"];
  const projectName = project.project?.name || "Unknown Project";
  
  const getStatusColor = () => {
    if (validated) return '#10B981';
    if (status === 'finished') return '#F59E0B';
    if (status === 'in_progress') return '#3B82F6';
    return '#6B7280';
  };

  const getStatusIcon = () => {
    if (validated) return '✅';
    if (status === 'finished') return '⏳';
    if (status === 'in_progress') return '🔄';
    return '📝';
  };

  const getMarkColor = (mark) => {
    if (mark >= 100) return '#00babc';
    if (mark >= 80) return '#10B981';
    if (mark >= 60) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={[styles.container, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{getStatusIcon()}</Text>
        <Text style={styles.name} numberOfLines={2}>{projectName}</Text>
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Status</Text>
          <Text style={[styles.detailValue, { color: getStatusColor() }]}>
            {status?.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        
        {final_mark !== null && final_mark !== undefined && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Score</Text>
            <Text style={[styles.score, { color: getMarkColor(final_mark) }]}>
              {final_mark}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  name: {
    fontWeight: '700',
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
  },
  score: {
    fontSize: 20,
    fontWeight: '800',
  },
});
