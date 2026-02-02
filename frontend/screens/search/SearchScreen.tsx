import api from '@/lib/api';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput,FlatList,Image, Pressable } from 'react-native';

export default function SearchScreen() {
  type EventType = {
  id: number;
  title: string;
  category: string;
  startDate:string;
  location:string;
  image?: {
    imageUrl: string;
  }[]

};
  const [search,setSearch] = useState("")
  const [results, setResults] = useState<EventType[]>([]);
  async function handleSearch() {
    try{
      console.log("inside handle search");
      
      const res =await api.get(`/event/search?event=${search}`)
      console.log(res.data)
      setResults(res.data.events);

    }catch(err){
      console.log(err);
    }
    
  }
  useEffect(()=>{
    if(search.trim().length<2) return;
   const setT =  setTimeout(()=>{
        handleSearch()
    },500)

    return ()=> clearTimeout(setT)

  },[search])
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search events, people, places…"
          placeholderTextColor="#6b7280"
          style={styles.input}
          onChangeText={(text)=>{setSearch(text)}}
        />
      </View>


      <View style={styles.section}>
        <View>
          <FlatList
  data={results}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{ gap: 12 }}
  renderItem={({ item }) => (
    <Pressable onPress={() => router.push(`/(tabs)/events/${item.id}`)} style={styles.card}>
      

      <Image
        source={{ uri: item.image?.[0]?.imageUrl }}
        style={styles.image}
      />

     
      <View style={styles.cardContent}>
        <Text style={styles.eventTitle}>
          {item.title}
        </Text>

        <Text style={styles.meta}>
          \ {new Date(item.startDate).toDateString()}
        </Text>

        <Text style={styles.meta}>
           {item.location}
        </Text>

        <Text style={styles.category}>
          {item.category}
        </Text>
      </View>

    </Pressable>
  )}
/>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  searchBox: {
    height: 44,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginBottom: 24,
  },
  input: {
    fontSize: 14,
    color: '#111827',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  placeholder: {
    fontSize: 14,
    color: '#6b7280',
  },
  card: {
  backgroundColor: "#fff",
  borderRadius: 12,
  overflow: "hidden",
  elevation: 3, // Android shadow
  shadowColor: "#000",
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

image: {
  width: "100%",
  height: 150,
},

cardContent: {
  padding: 12,
  gap: 4,
},

eventTitle: {
  fontSize: 16,
  fontWeight: "700",
},

meta: {
  fontSize: 13,
  color: "#6b7280",
},

category: {
  marginTop: 6,
  alignSelf: "flex-start",
  backgroundColor: "#e5e7eb",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
  fontSize: 12,
  fontWeight: "600",
},

});
