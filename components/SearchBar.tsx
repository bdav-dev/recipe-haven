import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import TextField from "./TextField";
import { useAppTheme } from "@/hooks/useAppTheme";


type SearchBarProps = {
    searchText: string,
    onSearchTextChange?: ((text: string) => void)
}

export default function SearchBar(props: SearchBarProps) {
    const theme = useAppTheme();

    return (
        <View style={styles.searchBar}>
            <Ionicons name='search-outline' size={25} color={theme.icon.secondary} style={styles.searchBarIcon} />
            <TextField style={{ flex: 1 }} placeholder='Suche' value={props.searchText} onChangeText={props.onSearchTextChange} />
        </View>
    );

}

const styles = StyleSheet.create({
    searchBar: {
        margin: 8,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12
    },
    searchBarIcon: {
        marginRight: 4
    }
});