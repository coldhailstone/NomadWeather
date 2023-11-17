import { StyleSheet, Text, View, StatusBar } from 'react-native';

export default function App() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello</Text>
            <StatusBar barStyle='dark-content' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 28,
        color: 'black',
    },
});
