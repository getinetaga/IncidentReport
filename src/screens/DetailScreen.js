import { Image, Linking, ScrollView, StyleSheet, Text } from 'react-native';

export default function DetailScreen({ route }) {
  const { incident } = route.params;

  function openMap() {
    const url = `geo:${incident.coords.latitude},${incident.coords.longitude}?q=${incident.coords.latitude},${incident.coords.longitude}`;
    Linking.openURL(url);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{incident.category} — {incident.urgency}</Text>
      <Text style={styles.meta}>Reported: {new Date(incident.timestamp).toLocaleString()}</Text>
      <Text style={styles.meta}>Location: {incident.coords.latitude.toFixed(6)}, {incident.coords.longitude.toFixed(6)}</Text>
      <Text style={styles.description}>{incident.description}</Text>
      {incident.media?.map((m, idx) => (
        <Image key={idx} source={{uri: m}} style={styles.media} />
      ))}
      <Text style={styles.link} onPress={openMap}>Open in Maps</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  meta: { color: '#444', marginBottom: 6 },
  description: { marginVertical: 10, fontSize: 16 },
  media: { width: '100%', height: 200, marginVertical: 6 },
  link: { color: '#0066cc', marginTop: 10 }
});
