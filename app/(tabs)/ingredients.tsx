import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Image, Platform, View, Text, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function IngredientsScreen() {


  return (
    <View>

      <ThemedText>testsetset</ThemedText>


    </View>
  );
}


const styles = StyleSheet.create({
  test: {

  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
