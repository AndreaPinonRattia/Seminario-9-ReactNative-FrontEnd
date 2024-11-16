import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchExperiences } from "../services/experienceService";
import { fetchUsers } from "../services/userService";

export default function ExperiencesSearchScreen() {
  const [experiences, setExperiences] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [searchText, setSearchText] = useState("");

  const loadExperiencesAndUsers = async () => {
    try {
      const [experiencesData, usersData] = await Promise.all([
        fetchExperiences(),
        fetchUsers(),
      ]);
      console.log("Experiencias recibidas:", experiencesData);
      console.log("Usuarios recibidos:", usersData);
      setExperiences(experiencesData);
      setUsers(usersData);
      setFilteredExperiences(experiencesData); // Inicialmente mostramos todas las experiencias
    } catch (error) {
      console.error("Error al cargar experiencias y usuarios:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadExperiencesAndUsers();
    }, [])
  );

  useEffect(() => {
    console.log("Texto de búsqueda:", searchText);
    console.log("Experiencias actuales:", experiences);

    const filtered = experiences.filter((experience) => {
      return experience.participants.some((participantId) => {
        const participant = users.find((user) => user._id === participantId);
        const participantName = participant ? participant.name.toLowerCase() : '';
        return participantName.includes(searchText.toLowerCase());
      });
    });

    console.log("Experiencias filtradas:", filtered);
    setFilteredExperiences(filtered);
  }, [searchText, experiences, users]);

  const renderExperienceItem = ({ item }) => (
    <View style={styles.experienceItem}>
      <Text style={styles.experienceDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Experiencias por Participante</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por nombre de participante"
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredExperiences}
        keyExtractor={(item) => item._id}
        renderItem={renderExperienceItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText ? "No se encontraron experiencias." : "Escribe para buscar."}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#8B0000",
  },
  title: {
    fontSize: 24,
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
  },
  experienceItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  experienceDescription: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
