import { useAppTheme } from "@/hooks/useAppTheme";
import { View } from "react-native";


type PageProps = {
    children?: React.ReactNode
}

export default function Page(props: PageProps) {
    const backgroundColor = useAppTheme().background;

    return (
        <View style={{ flex: 1 }}>
            {props.children}
        </View>
    );
}

//, backgroundColor: backgroundColor
