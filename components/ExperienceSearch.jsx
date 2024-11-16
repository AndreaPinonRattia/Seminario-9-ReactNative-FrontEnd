import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet } from "react-native";
import { fetchExperiences } from "../services/experienceService";  // Asegúrate de importar la función

const ExperiencesSearch = () => {
  const [searchText, setSearchText] = useState("");  // Texto de búsqueda
  const [experiences, setExperiences] = useState([]);  // Experiencias obtenidas de la base de datos
  const [results, setResults] = useState([]);  // Resultados de la búsqueda

  useEffect(() => {
    // Llamada a la API para cargar las experiencias
    const loadExperiences = async () => {
      try {
        const data = await fetchExperiences();  // Obtener las experiencias de la base de datos
        setExperiences(data);  // Guardar las experiencias
        setResults(data);  // Inicialmente, mostrar todas las experiencias
      } catch (error) {
        console.error("Error al cargar las experiencias:", error);
      }
    };

    loadExperiences();  // Cargar las experiencias cuando el componente se monta
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    // Filtra las experiencias basadas en el nombre introducido
    const filtered = experiences.filter((exp) =>
      exp.participants.some((participant) =>
        participant.toLowerCase().includes(text.toLowerCase())
      )
    );
    setResults(filtered);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Introduce el nombre del usuario"
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}  // Asegúrate de que cada item tenga un ID único
        renderItem={({ item }) => (
          <View style={styles.resultItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.participants}>
              Participantes: {item.participants.join(", ")}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchText ? "No se encontraron experiencias." : "Comienza a buscar."}
          </Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  participants: {
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});

export default ExperiencesSearch;
