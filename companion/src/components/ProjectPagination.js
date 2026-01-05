// Display all the projects of a user with pagination
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import ProjectItem from './ProjectItem';

const PROJECTS_PER_PAGE = 10;

export default function ProjectPagination({ user }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentProjects, setCurrentProjects] = useState([]);

  useEffect(() => {
    const projects = user.projects_users?.filter(p => p.project) || [];
    const pages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
    setTotalPages(pages);
    setCurrentProjects(projects.slice(0, PROJECTS_PER_PAGE));
  }, [user]);

  const goToPage = (page) => {
    const projects = user.projects_users?.filter(p => p.project) || [];
    const startIndex = (page - 1) * PROJECTS_PER_PAGE;
    const endIndex = startIndex + PROJECTS_PER_PAGE;
    setCurrentProjects(projects.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

    return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>🚀 Projects</Text>
      {currentProjects.map(project => (
        <ProjectItem key={project.id} project={project} />
      ))}
      
      <View style={styles.pagination}>
        <Button
          title="Previous"
          onPress={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        />
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          title="Next"
          onPress={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1F2937',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  pageInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
}); 