import { StyleSheet, Text, View } from 'react-native';

export default function StatCard({ label, value, color }){
  return (
    <View style={[styles.card, {backgroundColor: color || '#fff'}]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex:1, padding:14, marginRight:8, borderRadius:12, alignItems:'center', shadowColor:'#000', shadowOpacity:0.03, shadowRadius:6, elevation:1 },
  label: { color:'#6b7280', fontSize:12 },
  value: { fontSize:22, fontWeight:'800', marginTop:6 }
});
