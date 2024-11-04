import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";

type DeleteButtonProps = {
    onPress?: () => void,
    children?: React.ReactNode
}

export default function DeleteButton(props: DeleteButtonProps) {
    return (
        <TouchableOpacity onPress={props.onPress} >
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="trash-outline" color={"red"} size={30} />
                <Text style={{ color: "red", fontSize: 18 }}>{props.children}</Text>
            </View>
        </TouchableOpacity>
    );
}
