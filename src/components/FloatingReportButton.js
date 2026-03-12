import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function FloatingReportButton({ onPress }){
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={()=>{ if(onPress) onPress(); navigation.navigate('Report'); }}
      onLongPress={()=>navigation.navigate('Guardian')}
      delayLongPress={400}
    >
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position:'absolute',
    right:18,
    bottom:28,
    backgroundColor:'#ff3b30',
    width:64,
    height:64,
    borderRadius:32,
    alignItems:'center',
    justifyContent:'center',
    elevation:6
  },
  plus: { color:'#fff', fontSize:34, lineHeight:38 }
});
