import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

type Result = {
  assessment_id: number;
  skill: string;
  score: number;
  total_questions: number;
  percentage: number;
  level: string;
};

export default function ResultsScreen() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const storedResults = await AsyncStorage.getItem(
        'assessment_results'
      );

      if (storedResults) {
        setResults(JSON.parse(storedResults));
      }
    } catch (error) {
      console.log('Error loading results:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text style={styles.title}>
        Assessment Results
      </Text>

      <Text style={styles.subtitle}>
        Your skill assessment results
      </Text>

      {results.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No assessment results found.
          </Text>
        </View>
      ) : (
        results.map((result) => (
          <View
            style={styles.card}
            key={result.assessment_id}
          >
            <Text style={styles.skill}>
              {result.skill}
            </Text>

            <Text style={styles.score}>
              {result.score} / {result.total_questions}
            </Text>

            <Text style={styles.percentage}>
              {result.percentage}%
            </Text>

            <Text style={styles.level}>
              {result.level}
            </Text>
          </View>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#F5F7FB',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 30,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 24,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
  },

  skill: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  score: {
    fontSize: 16,
    color: '#475569',
    marginTop: 8,
  },

  percentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563EB',
    marginTop: 8,
  },

  level: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 5,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
  },

  emptyText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
});