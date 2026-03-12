import { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, View } from 'react-native';
import IncidentItem from '../components/IncidentItem';
import { loadIncidents } from '../services/storage';

export default function ListScreen({ navigation }) {
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      loadIncidents().then(list => setIncidents(list || []));
    });
    return unsub;
  }, [navigation]);

  function renderItem({ item }) {
    return (
      <IncidentItem
        incident={item}
        onPress={() => navigation.navigate('Detail', { incident: item })}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Report Incident" onPress={() => navigation.navigate('Report')} />
      <FlatList
        data={incidents.sort((a,b)=>b.priority - a.priority)}
        keyExtractor={(i)=>i.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingTop:8}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 }
});
