import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";
import { measure } from "react-native-reanimated";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onRecipeEdited } = route.params || {};
  const [recipeName, setRecipeName] = useState(recipeToEdit ? recipeToEdit.recipeName : "");
  const [recipeImage, setRecipeImage] = useState(recipeToEdit ? recipeToEdit.recipeImage : "");
  const [cookingDescription, setCookingDescription] = useState(
    recipeToEdit ? recipeToEdit.cookingDescription : ""
  );
  const [ingredient, setIngredient] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [ingredients, setIngredients] = useState(recipeToEdit ? recipeToEdit.ingredients : []);
  const [recipeInstructions, setRecipeInstructions] = useState(recipeToEdit ? recipeToEdit.recipeInstructions : "");

  const saveRecipe = async () => {
    const newRecipe = { recipeName, recipeImage, cookingDescription, ingredients, recipeInstructions };
    try {
      const existingRecipes = await AsyncStorage.getItem("customRecipes");
      const recipes = existingRecipes ? JSON.parse(existingRecipes) : [];

      // If editing a recipe, update it; otherwise, add it
      if (recipeToEdit !== undefined) {
        recipes[recipeIndex] = newRecipe;
        await AsyncStorage.setItem("customRecipes", JSON.stringify(recipes));
        if (onRecipeEdited) onRecipeEdited();
      } else {
        recipes.push(newRecipe);
        await AsyncStorage.setItem("customRecipes", JSON.stringify(recipes));
      }

      navigation.goBack();
    } catch (error) {
      console.error("Failed to save recipe:", error);
    }
  };
  console.log(ingredients, ingredient)
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"Back"}</Text>
      </TouchableOpacity>
      <TextInput
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={recipeImage}
        onChangeText={setRecipeImage}
        style={styles.input}
      />
      {recipeImage ? (
        <Image source={{ uri: recipeImage }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Cooking Description"
        value={cookingDescription}
        onChangeText={setCookingDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <View style={{ display: 'flex', flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-start", gap: 20 }}>
        <TextInput
          placeholder="Ingredient"
          value={ingredient}
          onChangeText={setIngredient}
          style={styles.input}
        />
        <TextInput
          placeholder="Measurement"
          value={measurement}
          onChangeText={setMeasurement}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => {
          setIngredients([...ingredients, { ingredientName: ingredient, measure: measurement }])
          setIngredient("");
          setMeasurement("");
        }} style={styles.backButton}>
          <Text style={styles.backButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <View style={{ display: 'flex', flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", gap: 10, marginTop: 10 }}>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={{ display: 'flex', flexDirection: "row", alignItems: "flex-end", justifyContent: "flex-start", gap: 20 }}>
            <Text>{ingredient.ingredientName} {ingredient.measure}</Text>
            <TouchableOpacity onPress={() => {
              const newIngredients = [...ingredients];
              newIngredients.splice(index, 1);
              setIngredients(newIngredients)
            }}>
              <Text style={{ color: 'red' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TextInput
        placeholder="Step-by-step instructions"
        value={recipeInstructions}
        onChangeText={setRecipeInstructions}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TouchableOpacity onPress={saveRecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  backButton: {
    marginBottom: hp(1.5),
  },
  backButtonText: {
    fontSize: hp(2.2),
    color: "#4F75FF",
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height: 200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
