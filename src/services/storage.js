import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const KEY = 'INCIDENTS_V1';

export async function loadIncidents(){
  try{
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}

export async function saveIncidents(list){
  try{ await AsyncStorage.setItem(KEY, JSON.stringify(list)); }catch(e){}
}

export async function addIncident(item){
  // If reporter contact provided, store it securely and remove from saved incident
  try{
    if(item.reporter && item.reporter.contact){
      const key = `reporter_${item.id}`;
      await SecureStore.setItemAsync(key, item.reporter.contact);
      // mark that contact stored separately
      item.reporter.contact = null;
      item.reporterContactStored = true;
    }
  }catch(e){ /* ignore secure store errors */ }

  const list = await loadIncidents();
  list.push(item);
  await saveIncidents(list);
}

export async function getReporterContact(incidentId){
  try{
    const key = `reporter_${incidentId}`;
    return await SecureStore.getItemAsync(key);
  }catch(e){ return null; }
}
