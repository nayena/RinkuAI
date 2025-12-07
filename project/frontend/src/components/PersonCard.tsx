import { View, Text } from "react-native";
import { Person } from "../types/domain";

export default function PersonCard({ person }: { person: Person }) {
  return (
    <View style={{ padding: 12, borderBottomWidth: 1, borderColor: "#eee" }}>
      <Text style={{ fontSize: 16, fontWeight: "700" }}>
        {person.familiarName || person.displayName}
      </Text>
      <Text>{person.relationship}</Text>
    </View>
  );
}