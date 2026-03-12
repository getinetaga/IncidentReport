import { ScrollView, StyleSheet, Text, View } from 'react-native';
import IncidentForm from '../components/IncidentForm';

export default function ReportScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Report Incident</Text>
        <Text style={styles.subtitle}>Provide details below</Text>
      </View>
      <IncidentForm
        onSaved={() => navigation.navigate('List')}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  header: { marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { color: '#666', marginTop: 4 }
});
