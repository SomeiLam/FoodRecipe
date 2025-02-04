import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    const storedRecipes = await AsyncStorage.getItem("customRecipes");
    if (storedRecipes) {
      setRecipes(JSON.parse(storedRecipes));
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecipes();
    }, [])
  );

  const handleAddRecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };

  const handleRecipeClick = (recipe) => {

  };
  const deleteRecipe = async (index) => {
    const storedRecipes = await AsyncStorage.getItem("customRecipes");
    const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
    recipes.splice(index, 1);
    await AsyncStorage.setItem("customRecipes", JSON.stringify(recipes));
    setRecipes(recipes);
  };

  const editRecipe = (recipe, index) => {
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
      onRecipeEdited: fetchRecipes,
    });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"Back"}</Text>
      </TouchableOpacity>

      <View style={styles.addBtnContainer}>
        <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New recipe</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes?.length === 0 ? (
            <Text style={styles.norecipesText}>No recipes added yet.</Text>
          ) : (
            recipes.map((recipe, index) => (
              <View key={index} style={styles.recipeCard} testID="recipeCard">
                <TouchableOpacity testID="handlerecipeBtn" onPress={() => handleRecipeClick(recipe)}>
                  <Image source={{ uri: recipe.recipeImage }} style={styles.recipeImage} />
                  <Text style={styles.recipeTitle}>{recipe.recipeName}</Text>
                  <Text style={styles.recipeDescription} testID="recipeDescp">
                    {recipe.cookingDescription?.length > 40 ? recipe.cookingDescription.slice(0, 40) + "..." : recipe.cookingDescription}
                  </Text>
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle} testID="sectionTitle">Ingredients</Text>
                    <View>
                      {recipe.ingredients.map((ingredient, index) => (
                        <View key={index} style={styles.ingredientItem}>
                          <View style={styles.ingredientBullet} />
                          <Text style={styles.ingredientText}>{ingredient.ingredientName} {ingredient.measure}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  <View style={styles.sectionContainer} testID="sectionContainer">
                    <Text style={styles.sectionTitle} testID="sectionTitle">Instructions</Text>
                    <Text style={styles.instructionsText} testID="instructionsText">{recipe.recipeInstructions}</Text>
                  </View>
                </TouchableOpacity>

                {/* Edit and Delete Buttons */}
                <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                  <TouchableOpacity
                    onPress={() => editRecipe(recipe, index)}
                    style={styles.editButton}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteRecipe(index)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>

                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    marginBottom: hp(1.5),
  },
  backButtonText: {
    fontSize: hp(2.2),
    color: "#4F75FF",
  },
  addBtnContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.7),
    alignItems: "center",
    borderRadius: 5,
    width: 300,
    // marginLeft: 500
    // marginBottom: hp(2),
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(2.2),
  },
  scrollContainer: {
    paddingTop: hp(2),
    paddingBottom: hp(2),
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  norecipesText: {
    textAlign: "center",
    fontSize: hp(2),
    color: "#6B7280",
    marginTop: hp(5),
  },
  recipeCard: {
    width: 400, // Make recipe card width more compact
    height: 'fit-content', // Adjust the height of the card to fit content
    backgroundColor: "#fff",
    padding: wp(3),
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, // for Android shadow
  },
  recipeImage: {
    width: 300, // Set width for recipe image
    height: 150, // Adjust height of the image
    borderRadius: 8,
    marginBottom: hp(1),
  },
  recipeTitle: {
    fontSize: hp(2),
    fontWeight: "600",
    color: "#111827",
    marginBottom: hp(0.5),
  },
  recipeDescription: {
    fontSize: hp(1.8),
    color: "#6B7280",
    marginBottom: hp(1.5),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },
  editButton: {
    backgroundColor: "#34D399",
    padding: wp(.5),
    borderRadius: 5,
    width: 100, // Adjust width of buttons to be more compact
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    padding: wp(.5),
    borderRadius: 5,
    width: 100, // Adjust width of buttons to be more compact
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.8),
  },
  sectionContainer: {
    // marginHorizontal: wp(5),
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: hp(1.8),
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    fontFamily: "Lato",
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(1),
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#FFF9E1",
    borderRadius: 8,
    elevation: 2,
  },
  ingredientBullet: {
    backgroundColor: "#FFD700",
    borderRadius: 50,
    height: hp(1.5),
    width: hp(1.5),
    marginRight: wp(2),
  },
  ingredientText: {
    fontSize: hp(1.9),
    color: "#333",
    fontFamily: "Lato",
  },
  instructionsText: {
    fontSize: hp(2),
    color: "#444",
    lineHeight: hp(3),
    textAlign: "justify",
    fontFamily: "Lato",
    marginBottom: 20,
  },
});
