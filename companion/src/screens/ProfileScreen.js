import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, useWindowDimensions, SafeAreaView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import SkillProgress from '../components/SkillProgress';
import ProjectItem from '../components/ProjectItem';

export default function ProfileScreen({ route }) {
  const { user } = route.params;
  const cursus = user.cursus_users[0];
  const level = cursus?.level || 0;
  const { width, height } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const isLandscape = width > height;
  const avatarSize = isSmallScreen ? 100 : isLandscape ? 100 : 120;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#00babc', '#1e3a8a']}
          style={[styles.header, isLandscape && styles.headerLandscape]}
        >
          <Image 
            source={{ uri: user.image?.link || user.image_url }} 
            style={[
              styles.avatar,
              { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }
            ]} 
          />
          <Text style={[styles.name, isSmallScreen && styles.nameSmall]}>{user.login}</Text>
          <Text style={styles.displayName}>{user.displayname || user.usual_full_name}</Text>
        </LinearGradient>

        <View style={[styles.content, isLandscape && styles.contentLandscape]}>
          <View style={[styles.statsCard, isLandscape && styles.statsCardLandscape]}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>{level.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>{user.wallet || 0} ₳</Text>
              <Text style={styles.statLabel}>Wallet</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statValue, isSmallScreen && styles.statValueSmall]}>{user.correction_point || 0}</Text>
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
          <View style={isLandscape ? styles.projectsGrid : null}>
            {user.projects_users?.filter(p => p.project).slice(0, 20).map(project => (
              <View key={project.id} style={isLandscape ? styles.projectGridItem : null}>
                <ProjectItem project={project} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: { 
    flex: 1, 
    backgroundColor: '#F3F4F6',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 20 : 40,
    paddingBottom: 32,
    paddingHorizontal: '5%',
  },
  headerLandscape: {
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  avatar: { 
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
  nameSmall: {
    fontSize: 24,
  },
  displayName: {
    fontSize: 16,
    color: '#E5E7EB',
  },
  content: {
    paddingHorizontal: '4%',
    paddingVertical: 16,
    marginTop: -20,
  },
  contentLandscape: {
    paddingHorizontal: '8%',
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
  statsCardLandscape: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '100%',
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
  statValueSmall: {
    fontSize: 20,
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
  projectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  projectGridItem: {
    width: '48%',
  },
});
