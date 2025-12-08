import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import SkillProgress from '../components/SkillProgress';
import ProjectItem from '../components/ProjectItem';

export default function ProfileScreen({ route }) {
  const { user } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: user.image_url }} style={styles.avatar} />
      <Text style={styles.name}>{user.login}</Text>
      <Text>Email: {user.email}</Text>
      <Text>Level: {user.cursus_users[0].level}</Text>
      <Text>Wallet: {user.wallet}</Text>

      <Text style={styles.section}>Skills</Text>
      {user.cursus_users[0].skills.map(skill => (
        <SkillProgress key={skill.name} skill={skill.name} level={skill.level * 10} />
      ))}

      <Text style={styles.section}>Projects</Text>
      {user.projects_users.map(project => (
        <ProjectItem key={project.project.id} project={project} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 10 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  section: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
});
