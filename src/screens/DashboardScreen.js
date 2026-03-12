import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SearchFilters from '../components/SearchFilters';
import StatCard from '../components/StatCard';
import { loadIncidents } from '../services/storage';

export default function DashboardScreen({ navigation }){
  const [incidents, setIncidents] = useState([]);

  useEffect(()=>{
    const unsub = navigation.addListener('focus', ()=>{ loadIncidents().then(list=>setIncidents(list||[])); });
    return unsub;
  }, [navigation]);

  const total = incidents.length;
  const critical = incidents.filter(i=>i.priority>=3).length;
  const active = incidents.filter(i=>i.status!=='resolved').length || 0;
  const resolved = incidents.filter(i=>i.status==='resolved').length;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Incidents</Text>
        <Text style={styles.subtitle}>Real-time community reporting</Text>
      </View>

      <View style={styles.statsRow}>
        <StatCard label="Total" value={total} color="#eef2ff" />
        <StatCard label="Critical" value={critical} color="#fff3f3" />
        <StatCard label="Active" value={active} color="#fff9ec" />
        <StatCard label="Resolved" value={resolved} color="#f0fff4" />
      </View>

      <SearchFilters onSearch={(q)=>{ /* TODO filter list */ }} />

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No incidents found</Text>
        <Text style={styles.emptyHint}>Try adjusting your filters</Text>
        <TouchableOpacity style={styles.reportButton} onPress={()=>navigation.navigate('Report')}>
          <Text style={styles.reportText}>+ Report</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding:16, backgroundColor:'#fff', minHeight:'100%' },
  headerRow: { marginBottom:12 },
  title: { fontSize:22, fontWeight:'700' },
  subtitle: { color:'#666', marginTop:4 },
  statsRow: { flexDirection:'row', justifyContent:'space-between', marginVertical:12 },
  emptyContainer: { alignItems:'center', marginTop:60 },
  emptyTitle: { fontSize:18, color:'#333', marginBottom:6 },
  emptyHint: { color:'#888' },
  reportButton: { marginTop:18, backgroundColor:'#ff3b30', paddingHorizontal:18, paddingVertical:10, borderRadius:8 },
  reportText: { color:'#fff', fontWeight:'700' }
});
