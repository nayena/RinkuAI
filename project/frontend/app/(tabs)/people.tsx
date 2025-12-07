import { usePeople } from "../../src/context/PeopleContext";
import { FlatList, View } from "react-native";
import PersonCard from "../../src/components/PersonCard";

export default function PeopleList() {
    const { people } = usePeople();
    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={people}
                keyExtractor={ (p) => p._id}
            renderItem={({ item }) => <PersonCard person={item} />}
            />
        </View>
    );
}