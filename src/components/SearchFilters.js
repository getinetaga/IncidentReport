import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchFilters({ onSearch }){
  const [q, setQ] = useState('');

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search incidents..." style={styles.search} value={q} onChangeText={setQ} onSubmitEditing={()=>onSearch && onSearch(q)} />
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filter}><Text>All Categories</Text></TouchableOpacity>
        <TouchableOpacity style={styles.filter}><Text>All Urgency</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop:12 },
  search: { borderWidth:1, borderColor:'#eee', padding:10, borderRadius:8 },
  filterRow: { flexDirection:'row', marginTop:10 },
  filter: { padding:10, borderWidth:1, borderColor:'#eee', borderRadius:8, marginRight:8 }
});
