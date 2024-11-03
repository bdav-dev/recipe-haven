import { useAppTheme } from "@/hooks/useAppTheme";
import { View, ViewProps } from "react-native";


export default function Page({
    children,
    style,
    ...rest
}: ViewProps) {
    const backgroundColor = useAppTheme().background;

    return (
        <View style={[style, { flex: 1, backgroundColor: backgroundColor }]} {...rest}>
            {children}
        </View>
    );
}
