import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SkillProgress from '../components/SkillProgress';
import ProjectItem from '../components/ProjectItem';

export default function ProfileScreen({ route }) {
  const { user } = route.params;
  const cursus = user.cursus_users[0];
  const level = cursus?.level || 0;

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#00babc', '#1e3a8a']}
        style={styles.header}
      >
        <Image source={{ uri: user.image?.link || user.image_url }} style={styles.avatar} />
        <Text style={styles.name}>{user.login}</Text>
        <Text style={styles.displayName}>{user.displayname || user.usual_full_name}</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{level.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Level</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.wallet || 0} ₳</Text>
            <Text style={styles.statLabel}>Wallet</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.correction_point || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📧 Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Campus</Text>
            <Text style={styles.infoValue}>{user.campus?.[0]?.name || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🎓 Pool</Text>
            <Text style={styles.infoValue}>{user.pool_month} {user.pool_year}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>💪 Skills</Text>
        <View style={styles.card}>
          {cursus?.skills?.slice(0, 10).map(skill => (
            <SkillProgress key={skill.name} skill={skill.name} level={skill.level} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>🚀 Projects</Text>
        {user.projects_users?.filter(p => p.project).slice(0, 20).map(project => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6' 
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  avatar: { 
    width: 120, 
    height: 120, 
    borderRadius: 60, 
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  name: { 
    fontSize: 28, 
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  displayName: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  content: {
    padding: 16,
    marginTop: -20,
  },
  statsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00babc',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
});
