import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import { sendGuardianAlert } from '../services/guardian';
import { getCurrentLocation } from '../services/location';
import { addIncident } from '../services/storage';

export default function GuardianAlertScreen({ navigation }){
  const [loading, setLoading] = useState(false);

  async function sendAlert(){
    setLoading(true);
    try{
      const loc = await getCurrentLocation();
      const coords = loc ? loc.coords : { latitude:0, longitude:0 };

      const alertItem = {
        id: uuid.v4(),
        title: 'Guardian Alert',
        description: 'Guardian alert triggered by user',
        category: 'Emergency',
        urgency: 'Critical',
        priority: 4,
        status: 'active',
        coords,
        media: [],
        timestamp: Date.now(),
        guardian: true
      };

      // Save locally for audit
      await addIncident(alertItem);
      // Send to backend (best-effort)
      await sendGuardianAlert(alertItem);

      Alert.alert('Alert sent', 'Guardian Alert was sent to responders. Help is on the way.');
      navigation.goBack();
    }catch(e){
      Alert.alert('Error','Unable to send alert. Try again.');
    }finally{ setLoading(false); }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Guardian Alert</Text>
      <Text style={styles.subtitle}>Sending an alert will notify your selected guardians and authorities with your current location.</Text>

      <View style={{height:22}} />
      <TouchableOpacity style={styles.bigButton} onPress={sendAlert} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.bigButtonText}>Send Guardian Alert</Text>}
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancel} onPress={()=>navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, justifyContent:'center', backgroundColor:'#fff' },
  title: { fontSize:22, fontWeight:'800', marginBottom:8 },
  subtitle: { color:'#666', fontSize:14 },
  bigButton: { marginTop:18, backgroundColor:'#ff3b30', paddingVertical:18, borderRadius:14, alignItems:'center' },
  bigButtonText: { color:'#fff', fontWeight:'800', fontSize:16 },
  cancel: { marginTop:12, alignItems:'center' },
  cancelText: { color:'#666' }
});
