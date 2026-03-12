import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import { sendReport } from '../services/api';
import { getCurrentLocation } from '../services/location';
import { addIncident } from '../services/storage';

const categories = [
  { key: 'Emergency', label: 'Emergency', icon: '🚨' },
  { key: 'Crime', label: 'Crime', icon: '🛡️' },
  { key: 'Accident', label: 'Accident', icon: '🚗' },
  { key: 'Fire', label: 'Fire', icon: '🔥' },
  { key: 'Medical', label: 'Medical', icon: '❤️' },
  { key: 'Disaster', label: 'Disaster', icon: '🌪️' },
  { key: 'Infra', label: 'Infra', icon: '🔧' },
  { key: 'Community', label: 'Community', icon: '👥' }
];

const urgencies = [
  { label: 'Critical', value: 4, hint: 'Life-threatening' },
  { label: 'High', value: 3, hint: 'Urgent response' },
  { label: 'Medium', value: 2, hint: 'Needs attention' },
  { label: 'Low', value: 1, hint: 'Non-urgent' }
];

export default function IncidentForm({ onSaved }){
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0].key);
  const [urgency, setUrgency] = useState(urgencies[2]);
  const [coords, setCoords] = useState(null);
  const [media, setMedia] = useState([]);
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');

  useEffect(()=>{
    (async ()=>{
      const loc = await getCurrentLocation();
      if(loc) setCoords(loc.coords);
    })();
  },[]);

  async function pickImage(){
    const res = await ImagePicker.launchImageLibraryAsync({mediaTypes: ImagePicker.MediaTypeOptions.All, quality:0.6});
    // Handle both legacy and new response shapes
    if(res.cancelled === false && res.uri){
      setMedia(prev=>[...prev, res.uri]);
    } else if(res.assets && res.assets.length){
      setMedia(prev=>[...prev, res.assets[0].uri]);
    }
  }

  async function takePhoto(){
    const res = await ImagePicker.launchCameraAsync({quality:0.6});
    if(res.cancelled === false && res.uri){
      setMedia(prev=>[...prev, res.uri]);
    } else if(res.assets && res.assets.length){
      setMedia(prev=>[...prev, res.assets[0].uri]);
    }
  }

  async function submit(){
    if(!title || title.trim().length<3){
      Alert.alert('Title required', 'Please provide a brief title (3+ chars).');
      return;
    }

    const item = {
      id: uuid.v4(),
      title: title.trim(),
      description,
      category,
      urgency: urgency.label,
      priority: urgency.value,
      status: 'active',
      reporter: {
        name: reporterName?.trim() || null,
        contact: reporterContact?.trim() || null
      },
      coords: coords || { latitude:0, longitude:0 },
      media,
      timestamp: Date.now()
    };
    await addIncident(item);
    // best-effort send to server
    sendReport(item).catch(()=>{});
    if(onSaved) onSaved();
  }

  return (
    <View>
      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Brief title of the incident" />

      <Text style={styles.label}>Category</Text>
      <View style={styles.grid}>
        {categories.map(c=> (
          <TouchableOpacity key={c.key} style={[styles.catBtn, category===c.key && styles.catActive]} onPress={()=>setCategory(c.key)}>
            <Text style={styles.catIcon}>{c.icon}</Text>
            <Text style={styles.catLabel}>{c.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Urgency Level</Text>
      <View style={styles.urgencyRow}>
        {urgencies.map(u=> (
          <TouchableOpacity key={u.label} style={[styles.urgencyCard, urgency.value===u.value && styles.urgencyActive]} onPress={()=>setUrgency(u)}>
            <Text style={styles.urgencyTitle}>{u.label}</Text>
            <Text style={styles.urgencyHint}>{u.hint}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description</Text>
      <TextInput style={[styles.input, {height:120, textAlignVertical:'top'}]} multiline value={description} onChangeText={setDescription} placeholder="Describe what happened in detail..." />

      <Text style={styles.label}>Location</Text>
      <TextInput style={styles.input} value={coords?`${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`:'Acquiring...'} editable={false} />
      <View style={styles.recaptureRow}>
        <TouchableOpacity style={styles.secondaryButton} onPress={async ()=>{ const loc = await getCurrentLocation(); if(loc) setCoords(loc.coords); else Alert.alert('Location','Unable to capture location. Check permissions.'); }}>
          <Text style={styles.secondaryButtonText}>Recapture</Text>
        </TouchableOpacity>
        <Text style={[styles.locationStatus, {color: coords ? '#0a8840' : '#888'}]}>{coords ? 'Location captured' : 'Location not captured'}</Text>
      </View>

      <Text style={[styles.label, {marginTop:6}]}>Evidence</Text>
      <Text style={{color:'#666', marginTop:4}}>Photos / Videos</Text>
      <View style={{flexDirection:'row', marginVertical:8}}>
        <TouchableOpacity style={styles.outlineButton} onPress={pickImage}>
          <Text style={styles.outlineButtonText}>Pick Photo/Video</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.outlineButton, {marginLeft:10}]} onPress={takePhoto}>
          <Text style={styles.outlineButtonText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      <View style={{marginBottom:12}}>
        {media.map((m,idx)=> <Image key={idx} source={{uri:m}} style={styles.thumb} />)}
      </View>

      <Text style={styles.label}>Your Information (Optional)</Text>
      <TextInput style={styles.input} value={reporterName} onChangeText={setReporterName} placeholder="Your name" />
      <TextInput style={[styles.input, {marginTop:8}]} value={reporterContact} onChangeText={setReporterContact} placeholder="Phone / Email" />

      <TouchableOpacity style={styles.primaryButton} onPress={submit}>
        <Text style={styles.primaryButtonText}>Submit Report</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>Your report will be sent to the appropriate authorities</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight:'600', marginTop:12 },
  input: { borderWidth:1, borderColor:'#eee', padding:12, borderRadius:8, marginTop:6, backgroundColor:'#fff' },
  grid: { flexDirection:'row', flexWrap:'wrap', marginTop:8 },
  catBtn: { width:'23%', padding:10, alignItems:'center', borderRadius:10, borderWidth:1, borderColor:'#f0f0f0', marginRight:'2%', marginBottom:10, backgroundColor:'#fafafa' },
  catActive: { backgroundColor:'#fff7f6', borderColor:'#ffd6d0' },
  catIcon: { fontSize:20, marginBottom:6 },
  catLabel: { fontSize:12, textAlign:'center', color:'#333' },
  urgencyRow: { flexDirection:'row', flexWrap:'wrap', marginTop:8 },
  urgencyCard: { width:'48%', padding:12, borderRadius:10, borderWidth:1, borderColor:'#f0f0f0', backgroundColor:'#fff', marginRight:'2%', marginBottom:10 },
  urgencyActive: { borderColor:'#ffd6d0', backgroundColor:'#fff7f6' },
  urgencyTitle: { fontWeight:'700' },
  urgencyHint: { color:'#666', fontSize:12, marginTop:6 }
  ,thumb: { width:100, height:80, marginTop:6 }
  ,recaptureRow: { flexDirection:'row', alignItems:'center', marginTop:8, marginBottom:6 }
  ,secondaryButton: { paddingVertical:8, paddingHorizontal:12, borderRadius:8, backgroundColor:'#fff', borderWidth:1, borderColor:'#eee' }
  ,secondaryButtonText: { color:'#333' }
  ,locationStatus: { marginLeft:12, fontSize:13 }
  ,hint: { color:'#666', marginTop:4 }
  ,outlineButton: { paddingVertical:10, paddingHorizontal:12, borderRadius:10, borderWidth:1, borderColor:'#e6e6e6', backgroundColor:'#fff' }
  ,outlineButtonText: { color:'#333' }
  ,primaryButton: { marginTop:12, backgroundColor:'#ff3b30', paddingVertical:14, borderRadius:12, alignItems:'center' }
  ,primaryButtonText: { color:'#fff', fontWeight:'700' }
  ,footerText: { color:'#666', fontSize:12, marginTop:8 }
});
