import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function IncidentItem({ incident, onPress }){
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={{flex:1}}>
        <Text style={styles.title}>{incident.category} — {incident.urgency}</Text>
        <Text style={styles.meta}>{new Date(incident.timestamp).toLocaleString()}</Text>
        <Text numberOfLines={2} style={styles.desc}>{incident.description}</Text>
      </View>
      {incident.media?.[0] ? <Image source={{uri:incident.media[0]}} style={styles.thumb} /> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection:'row', padding:10, borderBottomWidth:1, borderColor:'#eee', alignItems:'center' },
  title: { fontWeight:'700' },
  meta: { color:'#666', fontSize:12 },
  desc: { color:'#333', marginTop:6 },
  thumb: { width:72, height:54, marginLeft:10, borderRadius:6 }
});
