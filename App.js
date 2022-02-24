import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons'; 

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const API_KEY = "4b5cad5b8587b0ff457780bfa389e7d0";
const icons = {
  Clouds : "cloudy",
  Clear : "day-sunny",
  Rain: "rains",
  Thunderstorm:"lightning",
  Drizzle: "rain", 
  Snow: "snow",
  Atmosphere: "cloudy-gusts",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async()=>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false})
    setCity(location[0].city); 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  };

  useEffect(()=>{
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator ={false}
        pagingEnabled 
        contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems:"center"}}>
            <ActivityIndicator color="red" style={{marginTop:10}} size="large" />
          </View>
          ) : (
          days.map((day, index) =>
          <View key={index} style={styles.day}>
            <Text style={styles.date}>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
            <View style={{flexDirection:"row", alignItems:"center", width:"100%", justifyContent:"space-between"}}>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}ºC</Text>
              
              <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
            </View>
            <Text style={styles.maxmin}>({parseFloat(day.temp.min).toFixed(1)} / {parseFloat(day.temp.max).toFixed(1)})</Text>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>)
          )}
        

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex:1, 
    backgroundColor:"teal"
  },
  city : {
    flex : 1,
    justifyContent:"center",
    alignItems : "center",
  },
  cityName : {
    fontSize : 68,
    fontWeight : "500",
    color:"white",
  },
  weather : {
    
  },
  day : {
    width : SCREEN_WIDTH,
    alignItems : "flex-start",
    paddingHorizontal:20,
  },
  date:{
    marginTop : -10,
    fontSize : 40,
    color:"white",
  },
  temp : {
    marginTop : 50,
    fontSize : 100,
    color:"white",
  },
  maxmin : {
    marginTop : -20,
    fontSize : 40,
    color:"white",
  },
  description : {
    marginTop : 10,
    fontSize : 30,
    color:"white",
    fontWeight:"500",
  },
  tinyText : {
    fontSize : 25,
    marginTop: -5,
    color:"white",
    fontWeight:"500",
  },
})
