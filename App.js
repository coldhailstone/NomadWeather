import { useEffect, useState } from 'react';
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const API_KEY = '6fd31c8c57c906bebc67e772cf640908';

const icons = {
    Clear: 'day-sunny',
    Clouds: 'cloudy',
    Rain: 'rain',
    Atmosphere: 'cloudy-gusts',
    Snow: 'snow',
    Drizzle: 'day-rain',
    Thunderstorm: 'lightning',
};

export default function App() {
    const [city, setCity] = useState('Loading...');
    const [days, setDays] = useState([]);
    const [ok, setOk] = useState(true);
    const getWeather = async () => {
        const { granted } = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }

        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });
        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        setCity(location[0].city);

        const { list } = await (
            await fetch(
                `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            )
        ).json();
        setDays(list.filter(({ dt_txt }) => dt_txt.endsWith('00:00:00')));
    };
    useEffect(() => {
        getWeather();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false}>
                {!days.length ? (
                    <View style={{ ...styles.day, alignItems: 'center' }}>
                        <ActivityIndicator color='white' size='large' style={{ marginTop: 10 }} />
                    </View>
                ) : (
                    days.map((day, index) => (
                        <View key={index} style={styles.day}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%',
                                }}
                            >
                                <Text style={styles.temp}>
                                    {parseFloat(day.main.temp).toFixed(1)}
                                </Text>
                                <Fontisto
                                    name={icons[day.weather[0].main]}
                                    size={68}
                                    color='white'
                                    style={{ marginTop: -70 }}
                                />
                            </View>
                            <Text style={styles.description}>{day.weather[0].main}</Text>
                            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <StatusBar barStyle='default' />
        </View>
    );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'tomato',
    },
    city: {
        flex: 1.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cityName: {
        fontSize: 68,
        fontWeight: '500',
        color: 'white',
    },
    day: {
        width: SCREEN_WIDTH,
        alignItems: 'flex-start',
        paddingLeft: 20,
        paddingRight: 20,
    },
    temp: {
        marginTop: 50,
        fontSize: 178,
        color: 'white',
    },
    description: {
        marginTop: -30,
        fontSize: 50,
        color: 'white',
    },
    tinyText: {
        fontSize: 30,
        color: 'white',
    },
});
