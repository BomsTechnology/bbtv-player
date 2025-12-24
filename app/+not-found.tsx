import { Colors } from '@/constants/theme';
import { Image } from "expo-image";
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

const NotFoundScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
      <Image
              source={require("@/assets/images/bbtp-logo.png")}
              contentFit="contain"
              style={styles.image}
            />
        <Link href="/" style={styles.button}>
          Go back to Home screen!
        </Link>
      </View>
    </>
  )
}

export default NotFoundScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.background,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    button: {
      fontSize: 20,
      textDecorationLine: 'underline',
      color: Colors.text,
    },
    image: {
      width: 200,
      height: 50,
      marginBottom: 10,
    },
  });