import * as Location from 'expo-location';

export async function getCurrentLocation(){
  try{
    const { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
    return pos;
  }catch(e){ return null; }
}
