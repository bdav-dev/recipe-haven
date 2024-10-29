import CustomModal from '@/components/CustomModal';
import FloatingActionButton from '@/components/FloatingActionButton';
import { ThemedText } from '@/components/ThemedText';
import { IngredientContext } from '@/context/IngredientContextProvider';
import { getAllIngredients, insertExampleIngredient, insertIngredient } from '@/database/IngredientDao';
import { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, Modal, Text, TextInput, Button } from 'react-native';


export default function IngredientsScreen() {
  const { ingredients, setIngredients } = useContext(IngredientContext);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [name, setName] = useState('');
  const [pluralName, setPluralName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [unit, setUnit] = useState('');
  const [kcalPerUnit, setKcalPerUnit] = useState('');

  function submit() {
    const ingredient: Ingredient = {
      name: name,
      pluralName: pluralName || undefined,
      imageSrc: imageSrc || undefined,
      unit: Number(unit),
      kcalPerUnit: Number(kcalPerUnit)
    };

    insertIngredient(ingredient)
      .then(() => {
        setIngredients(current => [...current, ingredient])
      });
  }

  return (
    <View style={styles.page}>
      <FloatingActionButton onPress={() => setIsModalVisible(true)}/>


      <FlatList
        data={ingredients}
        renderItem={item => (
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <ThemedText>{item.item.ingredientId}</ThemedText>
            <ThemedText>{item.item.name}</ThemedText>
            <ThemedText>{item.item.pluralName ?? "null"}</ThemedText>
            <ThemedText>{item.item.imageSrc ?? "null"}</ThemedText>
            <ThemedText>{item.item.unit}</ThemedText>
            <ThemedText>{item.item.kcalPerUnit ?? "null"}</ThemedText>
          </View>
        )}
      />

      <CustomModal
        onRequestClose={() => setIsModalVisible(false)}
        isVisible={isModalVisible}
      >
        <TextInput placeholder='name' onChangeText={setName} style={styles.textInput} />
        <TextInput placeholder='pluralName' onChangeText={setPluralName} style={styles.textInput} />
        <TextInput placeholder='imageSrc' onChangeText={setImageSrc} style={styles.textInput} />
        <TextInput placeholder='unit' onChangeText={setUnit} style={styles.textInput} />
        <TextInput placeholder='kcalPerUnit' onChangeText={setKcalPerUnit} style={styles.textInput} />

        <Button title='Submit' onPress={submit}/>
      </CustomModal>

    </View>
  );
}


const styles = StyleSheet.create({
  textInput: {
    width: 100
  },
  page: {
    flexGrow: 1
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
