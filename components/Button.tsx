import { useAppTheme } from "@/hooks/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps } from "react-native";


type ButtonProps = Omit<TouchableOpacityProps, 'children'> & {
    title?: string,
    ionicon?: Ionicon,
    textStyle?: TextStyle
    type?: 'normal' | 'destructive'
}

export default function Button({
    title,
    ionicon: ioniconName,
    type,
    style,
    disabled,
    textStyle,
    ...rest
}: ButtonProps) {
    const theme = useAppTheme();
    const color = (
        disabled
            ? theme.button.disabled
            : type === "destructive"
                ? theme.button.destructive
                : theme.button.default
    );

    return (
        <TouchableOpacity
            style={[styles.touchableOpacity, style]}
            disabled={disabled}
            {...rest}
        >
            {ioniconName && <Ionicons name={ioniconName} size={26} color={color} />}
            {title && <Text style={[styles.text, { color }, textStyle]}>{title}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touchableOpacity: {
        marginHorizontal: 4,
        paddingHorizontal: 4,
        paddingVertical: 3,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "center",
        gap: 3
    },
    text: {
        fontSize: 18,
        textAlign: "center"
    }
});

type Ionicon = "link" | "search" | "image" | "text" | "alert" | "checkbox" | "menu" | "radio" | "timer" | "close" | "book" | "pause" | "mail" | "home" | "laptop" | "star" | "filter" | "save" | "cloud" | "eye" | "camera" | "enter" | "heart" | "calculator" | "download" | "play" | "calendar" | "barcode" | "hourglass" | "key" | "flag" | "car" | "man" | "gift" | "wallet" | "woman" | "earth" | "wifi" | "sync" | "warning" | "archive" | "arrow-down" | "arrow-up" | "bookmark" | "bookmarks" | "briefcase" | "brush" | "bug" | "chevron-down" | "chevron-up" | "clipboard" | "code" | "cog" | "compass" | "copy" | "crop" | "document" | "documents" | "flash" | "flashlight" | "flower" | "folder" | "funnel" | "game-controller" | "globe" | "grid" | "help" | "images" | "language" | "layers" | "leaf" | "list" | "location" | "lock-open" | "log-out" | "magnet" | "map" | "medal" | "megaphone" | "mic" | "moon" | "notifications-off" | "paper-plane" | "pencil" | "pie-chart" | "pin" | "print" | "rocket" | "share" | "shield" | "shuffle" | "stopwatch" | "thermometer" | "thumbs-down" | "thumbs-up" | "ticket" | "trash" | "trophy" | "tv" | "water" | "cart" | "refresh" | "alert-circle" | "aperture" | "arrow-down-circle" | "arrow-up-circle" | "bar-chart" | "battery-charging" | "bluetooth" | "disc" | "eye-off" | "film" | "git-branch" | "git-commit" | "git-merge" | "git-pull-request" | "help-circle" | "log-in" | "mic-off" | "move" | "pause-circle" | "play-circle" | "power" | "repeat" | "send" | "server" | "settings" | "square" | "stop-circle" | "terminal" | "trending-down" | "trending-up" | "triangle" | "umbrella" | "watch" | "remove" | "volume-off" | "stop" | "ban" | "expand" | "folder-open" | "star-half" | "flask" | "cut" | "caret-down" | "caret-up" | "cloud-download" | "cloud-upload" | "medkit" | "beer" | "desktop" | "unlink" | "female" | "male" | "paw" | "cube" | "at" | "bicycle" | "bus" | "diamond" | "transgender" | "bed" | "train" | "subway" | "battery-full" | "battery-half" | "id-card" | "body" | "time" | "ellipse" | "newspaper" | "backspace" | "bowling-ball" | "dice" | "egg" | "fish" | "glasses" | "hammer" | "headset" | "ice-cream" | "receipt" | "ribbon" | "school" | "shapes" | "skull" | "volume-mute" | "bandage" | "baseball" | "basketball" | "ellipsis-vertical" | "football" | "person" | "shirt" | "volume-high" | "volume-low" | "navigate" | "cloudy" | "snow" | "pulse" | "contrast" | "male-female" | "tablet-landscape" | "tablet-portrait" | "accessibility" | "accessibility-outline" | "accessibility-sharp" | "add" | "add-circle" | "add-circle-outline" | "add-circle-sharp" | "add-outline" | "add-sharp" | "airplane" | "airplane-outline" | "airplane-sharp" | "alarm" | "alarm-outline" | "alarm-sharp" | "albums" | "albums-outline" | "albums-sharp" | "alert-circle-outline" | "alert-circle-sharp" | "alert-outline" | "alert-sharp" | "american-football" | "american-football-outline" | "american-football-sharp" | "analytics" | "analytics-outline" | "analytics-sharp" | "aperture-outline" | "aperture-sharp" | "apps" | "apps-outline" | "apps-sharp" | "archive-outline" | "archive-sharp" | "arrow-back" | "arrow-back-circle" | "arrow-back-circle-outline" | "arrow-back-circle-sharp" | "arrow-back-outline" | "arrow-back-sharp" | "arrow-down-circle-outline" | "arrow-down-circle-sharp" | "arrow-down-outline" | "arrow-down-sharp" | "arrow-forward" | "arrow-forward-circle" | "arrow-forward-circle-outline" | "arrow-forward-circle-sharp" | "arrow-forward-outline" | "arrow-forward-sharp" | "arrow-redo" | "arrow-redo-circle" | "arrow-redo-circle-outline" | "arrow-redo-circle-sharp" | "arrow-redo-outline" | "arrow-redo-sharp" | "arrow-undo" | "arrow-undo-circle" | "arrow-undo-circle-outline" | "arrow-undo-circle-sharp" | "arrow-undo-outline" | "arrow-undo-sharp" | "arrow-up-circle-outline" | "arrow-up-circle-sharp" | "arrow-up-outline" | "arrow-up-sharp" | "at-circle" | "at-circle-outline" | "at-circle-sharp" | "at-outline" | "at-sharp" | "attach" | "attach-outline" | "attach-sharp" | "backspace-outline" | "backspace-sharp" | "bag" | "bag-add" | "bag-add-outline" | "bag-add-sharp" | "bag-check" | "bag-check-outline" | "bag-check-sharp" | "bag-handle" | "bag-handle-outline" | "bag-handle-sharp" | "bag-outline" | "bag-remove" | "bag-remove-outline" | "bag-remove-sharp" | "bag-sharp" | "balloon" | "balloon-outline" | "balloon-sharp" | "ban-outline" | "ban-sharp" | "bandage-outline" | "bandage-sharp" | "bar-chart-outline" | "bar-chart-sharp" | "barbell" | "barbell-outline" | "barbell-sharp" | "barcode-outline" | "barcode-sharp" | "baseball-outline" | "baseball-sharp" | "basket" | "basket-outline" | "basket-sharp" | "basketball-outline" | "basketball-sharp" | "battery-charging-outline" | "battery-charging-sharp" | "battery-dead" | "battery-dead-outline" | "battery-dead-sharp" | "battery-full-outline" | "battery-full-sharp" | "battery-half-outline" | "battery-half-sharp" | "beaker" | "beaker-outline" | "beaker-sharp" | "bed-outline" | "bed-sharp" | "beer-outline" | "beer-sharp" | "bicycle-outline" | "bicycle-sharp" | "bluetooth-outline" | "bluetooth-sharp" | "boat" | "boat-outline" | "boat-sharp" | "body-outline" | "body-sharp" | "bonfire" | "bonfire-outline" | "bonfire-sharp" | "book-outline" | "book-sharp" | "bookmark-outline" | "bookmark-sharp" | "bookmarks-outline" | "bookmarks-sharp" | "bowling-ball-outline" | "bowling-ball-sharp" | "briefcase-outline" | "briefcase-sharp" | "browsers" | "browsers-outline" | "browsers-sharp" | "brush-outline" | "brush-sharp" | "bug-outline" | "bug-sharp" | "build" | "build-outline" | "build-sharp" | "bulb" | "bulb-outline" | "bulb-sharp" | "bus-outline" | "bus-sharp" | "business" | "business-outline" | "business-sharp" | "cafe" | "cafe-outline" | "cafe-sharp" | "calculator-outline" | "calculator-sharp" | "calendar-clear" | "calendar-clear-outline" | "calendar-clear-sharp" | "calendar-number" | "calendar-number-outline" | "calendar-number-sharp" | "calendar-outline" | "calendar-sharp" | "call" | "call-outline" | "call-sharp" | "camera-outline" | "camera-reverse" | "camera-reverse-outline" | "camera-reverse-sharp" | "camera-sharp" | "car-outline" | "car-sharp" | "car-sport" | "car-sport-outline" | "car-sport-sharp" | "card" | "card-outline" | "card-sharp" | "caret-back" | "caret-back-circle" | "caret-back-circle-outline" | "caret-back-circle-sharp" | "caret-back-outline" | "caret-back-sharp" | "caret-down-circle" | "caret-down-circle-outline" | "caret-down-circle-sharp" | "caret-down-outline" | "caret-down-sharp" | "caret-forward" | "caret-forward-circle" | "caret-forward-circle-outline" | "caret-forward-circle-sharp" | "caret-forward-outline" | "caret-forward-sharp" | "caret-up-circle" | "caret-up-circle-outline" | "caret-up-circle-sharp" | "caret-up-outline" | "caret-up-sharp" | "cart-outline" | "cart-sharp" | "cash" | "cash-outline" | "cash-sharp" | "cellular" | "cellular-outline" | "cellular-sharp" | "chatbox" | "chatbox-ellipses" | "chatbox-ellipses-outline" | "chatbox-ellipses-sharp" | "chatbox-outline" | "chatbox-sharp" | "chatbubble" | "chatbubble-ellipses" | "chatbubble-ellipses-outline" | "chatbubble-ellipses-sharp" | "chatbubble-outline" | "chatbubble-sharp" | "chatbubbles" | "chatbubbles-outline" | "chatbubbles-sharp" | "checkbox-outline" | "checkbox-sharp" | "checkmark" | "checkmark-circle" | "checkmark-circle-outline" | "checkmark-circle-sharp" | "checkmark-done" | "checkmark-done-circle" | "checkmark-done-circle-outline" | "checkmark-done-circle-sharp" | "checkmark-done-outline" | "checkmark-done-sharp" | "checkmark-outline" | "checkmark-sharp" | "chevron-back" | "chevron-back-circle" | "chevron-back-circle-outline" | "chevron-back-circle-sharp" | "chevron-back-outline" | "chevron-back-sharp" | "chevron-collapse" | "chevron-collapse-outline" | "chevron-collapse-sharp" | "chevron-down-circle" | "chevron-down-circle-outline" | "chevron-down-circle-sharp" | "chevron-down-outline" | "chevron-down-sharp" | "chevron-expand" | "chevron-expand-outline" | "chevron-expand-sharp" | "chevron-forward" | "chevron-forward-circle" | "chevron-forward-circle-outline" | "chevron-forward-circle-sharp" | "chevron-forward-outline" | "chevron-forward-sharp" | "chevron-up-circle" | "chevron-up-circle-outline" | "chevron-up-circle-sharp" | "chevron-up-outline" | "chevron-up-sharp" | "clipboard-outline" | "clipboard-sharp" | "close-circle" | "close-circle-outline" | "close-circle-sharp" | "close-outline" | "close-sharp" | "cloud-circle" | "cloud-circle-outline" | "cloud-circle-sharp" | "cloud-done" | "cloud-done-outline" | "cloud-done-sharp" | "cloud-download-outline" | "cloud-download-sharp" | "cloud-offline" | "cloud-offline-outline" | "cloud-offline-sharp" | "cloud-outline" | "cloud-sharp" | "cloud-upload-outline" | "cloud-upload-sharp" | "cloudy-night" | "cloudy-night-outline" | "cloudy-night-sharp" | "cloudy-outline" | "cloudy-sharp" | "code-download" | "code-download-outline" | "code-download-sharp" | "code-outline" | "code-sharp" | "code-slash" | "code-slash-outline" | "code-slash-sharp" | "code-working" | "code-working-outline" | "code-working-sharp" | "cog-outline" | "cog-sharp" | "color-fill" | "color-fill-outline" | "color-fill-sharp" | "color-filter" | "color-filter-outline" | "color-filter-sharp" | "color-palette" | "color-palette-outline" | "color-palette-sharp" | "color-wand" | "color-wand-outline" | "color-wand-sharp" | "compass-outline" | "compass-sharp" | "construct" | "construct-outline" | "construct-sharp" | "contract" | "contract-outline" | "contract-sharp" | "contrast-outline" | "contrast-sharp" | "copy-outline" | "copy-sharp" | "create" | "create-outline" | "create-sharp" | "crop-outline" | "crop-sharp" | "cube-outline" | "cube-sharp" | "cut-outline" | "cut-sharp" | "desktop-outline" | "desktop-sharp" | "diamond-outline" | "diamond-sharp" | "dice-outline" | "dice-sharp" | "disc-outline" | "disc-sharp" | "document-attach" | "document-attach-outline" | "document-attach-sharp" | "document-lock" | "document-lock-outline" | "document-lock-sharp" | "document-outline" | "document-sharp" | "document-text" | "document-text-outline" | "document-text-sharp" | "documents-outline" | "documents-sharp" | "download-outline" | "download-sharp" | "duplicate" | "duplicate-outline" | "duplicate-sharp" | "ear" | "ear-outline" | "ear-sharp" | "earth-outline" | "earth-sharp" | "easel" | "easel-outline" | "easel-sharp" | "egg-outline" | "egg-sharp" | "ellipse-outline" | "ellipse-sharp" | "ellipsis-horizontal" | "ellipsis-horizontal-circle" | "ellipsis-horizontal-circle-outline" | "ellipsis-horizontal-circle-sharp" | "ellipsis-horizontal-outline" | "ellipsis-horizontal-sharp" | "ellipsis-vertical-circle" | "ellipsis-vertical-circle-outline" | "ellipsis-vertical-circle-sharp" | "ellipsis-vertical-outline" | "ellipsis-vertical-sharp" | "enter-outline" | "enter-sharp" | "exit" | "exit-outline" | "exit-sharp" | "expand-outline" | "expand-sharp" | "extension-puzzle" | "extension-puzzle-outline" | "extension-puzzle-sharp" | "eye-off-outline" | "eye-off-sharp" | "eye-outline" | "eye-sharp" | "eyedrop" | "eyedrop-outline" | "eyedrop-sharp" | "fast-food" | "fast-food-outline" | "fast-food-sharp" | "female-outline" | "female-sharp" | "file-tray" | "file-tray-full" | "file-tray-full-outline" | "file-tray-full-sharp" | "file-tray-outline" | "file-tray-sharp" | "file-tray-stacked" | "file-tray-stacked-outline" | "file-tray-stacked-sharp" | "film-outline" | "film-sharp" | "filter-circle" | "filter-circle-outline" | "filter-circle-sharp" | "filter-outline" | "filter-sharp" | "finger-print" | "finger-print-outline" | "finger-print-sharp" | "fish-outline" | "fish-sharp" | "fitness" | "fitness-outline" | "fitness-sharp" | "flag-outline" | "flag-sharp" | "flame" | "flame-outline" | "flame-sharp" | "flash-off" | "flash-off-outline" | "flash-off-sharp" | "flash-outline" | "flash-sharp" | "flashlight-outline" | "flashlight-sharp" | "flask-outline" | "flask-sharp" | "flower-outline" | "flower-sharp" | "folder-open-outline" | "folder-open-sharp" | "folder-outline" | "folder-sharp" | "football-outline" | "football-sharp" | "footsteps" | "footsteps-outline" | "footsteps-sharp" | "funnel-outline" | "funnel-sharp" | "game-controller-outline" | "game-controller-sharp" | "gift-outline" | "gift-sharp" | "git-branch-outline" | "git-branch-sharp" | "git-commit-outline" | "git-commit-sharp" | "git-compare" | "git-compare-outline" | "git-compare-sharp" | "git-merge-outline" | "git-merge-sharp" | "git-network" | "git-network-outline" | "git-network-sharp" | "git-pull-request-outline" | "git-pull-request-sharp" | "glasses-outline" | "glasses-sharp" | "globe-outline" | "globe-sharp" | "golf" | "golf-outline" | "golf-sharp" | "grid-outline" | "grid-sharp" | "hammer-outline" | "hammer-sharp" | "hand-left" | "hand-left-outline" | "hand-left-sharp" | "hand-right" | "hand-right-outline" | "hand-right-sharp" | "happy" | "happy-outline" | "happy-sharp" | "hardware-chip" | "hardware-chip-outline" | "hardware-chip-sharp" | "headset-outline" | "headset-sharp" | "heart-circle" | "heart-circle-outline" | "heart-circle-sharp" | "heart-dislike" | "heart-dislike-circle" | "heart-dislike-circle-outline" | "heart-dislike-circle-sharp" | "heart-dislike-outline" | "heart-dislike-sharp" | "heart-half" | "heart-half-outline" | "heart-half-sharp" | "heart-outline" | "heart-sharp" | "help-buoy" | "help-buoy-outline" | "help-buoy-sharp" | "help-circle-outline" | "help-circle-sharp" | "help-outline" | "help-sharp" | "home-outline" | "home-sharp" | "hourglass-outline" | "hourglass-sharp" | "ice-cream-outline" | "ice-cream-sharp" | "id-card-outline" | "id-card-sharp" | "image-outline" | "image-sharp" | "images-outline" | "images-sharp" | "infinite" | "infinite-outline" | "infinite-sharp" | "information" | "information-circle" | "information-circle-outline" | "information-circle-sharp" | "information-outline" | "information-sharp" | "invert-mode" | "invert-mode-outline" | "invert-mode-sharp" | "journal" | "journal-outline" | "journal-sharp" | "key-outline" | "key-sharp" | "keypad" | "keypad-outline" | "keypad-sharp" | "language-outline" | "language-sharp" | "laptop-outline" | "laptop-sharp" | "layers-outline" | "layers-sharp" | "leaf-outline" | "leaf-sharp" | "library" | "library-outline" | "library-sharp" | "link-outline" | "link-sharp" | "list-circle" | "list-circle-outline" | "list-circle-sharp" | "list-outline" | "list-sharp" | "locate" | "locate-outline" | "locate-sharp" | "location-outline" | "location-sharp" | "lock-closed" | "lock-closed-outline" | "lock-closed-sharp" | "lock-open-outline" | "lock-open-sharp" | "log-in-outline" | "log-in-sharp" | "log-out-outline" | "log-out-sharp" | "logo-alipay" | "logo-amazon" | "logo-amplify" | "logo-android" | "logo-angular" | "logo-apple" | "logo-apple-appstore" | "logo-apple-ar" | "logo-behance" | "logo-bitbucket" | "logo-bitcoin" | "logo-buffer" | "logo-capacitor" | "logo-chrome" | "logo-closed-captioning" | "logo-codepen" | "logo-css3" | "logo-designernews" | "logo-deviantart" | "logo-discord" | "logo-docker" | "logo-dribbble" | "logo-dropbox" | "logo-edge" | "logo-electron" | "logo-euro" | "logo-facebook" | "logo-figma" | "logo-firebase" | "logo-firefox" | "logo-flickr" | "logo-foursquare" | "logo-github" | "logo-gitlab" | "logo-google" | "logo-google-playstore" | "logo-hackernews" | "logo-html5" | "logo-instagram" | "logo-ionic" | "logo-ionitron" | "logo-javascript" | "logo-laravel" | "logo-linkedin" | "logo-markdown" | "logo-mastodon" | "logo-medium" | "logo-microsoft" | "logo-no-smoking" | "logo-nodejs" | "logo-npm" | "logo-octocat" | "logo-paypal" | "logo-pinterest" | "logo-playstation" | "logo-pwa" | "logo-python" | "logo-react" | "logo-reddit" | "logo-rss" | "logo-sass" | "logo-skype" | "logo-slack" | "logo-snapchat" | "logo-soundcloud" | "logo-stackoverflow" | "logo-steam" | "logo-stencil" | "logo-tableau" | "logo-tiktok" | "logo-tumblr" | "logo-tux" | "logo-twitch" | "logo-twitter" | "logo-usd" | "logo-venmo" | "logo-vercel" | "logo-vimeo" | "logo-vk" | "logo-vue" | "logo-web-component" | "logo-wechat" | "logo-whatsapp" | "logo-windows" | "logo-wordpress" | "logo-xbox" | "logo-xing" | "logo-yahoo" | "logo-yen" | "logo-youtube" | "magnet-outline" | "magnet-sharp" | "mail-open" | "mail-open-outline" | "mail-open-sharp" | "mail-outline" | "mail-sharp" | "mail-unread" | "mail-unread-outline" | "mail-unread-sharp" | "male-female-outline" | "male-female-sharp" | "male-outline" | "male-sharp" | "man-outline" | "man-sharp" | "map-outline" | "map-sharp" | "medal-outline" | "medal-sharp" | "medical" | "medical-outline" | "medical-sharp" | "medkit-outline" | "medkit-sharp" | "megaphone-outline" | "megaphone-sharp" | "menu-outline" | "menu-sharp" | "mic-circle" | "mic-circle-outline" | "mic-circle-sharp" | "mic-off-circle" | "mic-off-circle-outline" | "mic-off-circle-sharp" | "mic-off-outline" | "mic-off-sharp" | "mic-outline" | "mic-sharp" | "moon-outline" | "moon-sharp" | "move-outline" | "move-sharp" | "musical-note" | "musical-note-outline" | "musical-note-sharp" | "musical-notes" | "musical-notes-outline" | "musical-notes-sharp" | "navigate-circle" | "navigate-circle-outline" | "navigate-circle-sharp" | "navigate-outline" | "navigate-sharp" | "newspaper-outline" | "newspaper-sharp" | "notifications" | "notifications-circle" | "notifications-circle-outline" | "notifications-circle-sharp" | "notifications-off-circle" | "notifications-off-circle-outline" | "notifications-off-circle-sharp" | "notifications-off-outline" | "notifications-off-sharp" | "notifications-outline" | "notifications-sharp" | "nuclear" | "nuclear-outline" | "nuclear-sharp" | "nutrition" | "nutrition-outline" | "nutrition-sharp" | "open" | "open-outline" | "open-sharp" | "options" | "options-outline" | "options-sharp" | "paper-plane-outline" | "paper-plane-sharp" | "partly-sunny" | "partly-sunny-outline" | "partly-sunny-sharp" | "pause-circle-outline" | "pause-circle-sharp" | "pause-outline" | "pause-sharp" | "paw-outline" | "paw-sharp" | "pencil-outline" | "pencil-sharp" | "people" | "people-circle" | "people-circle-outline" | "people-circle-sharp" | "people-outline" | "people-sharp" | "person-add" | "person-add-outline" | "person-add-sharp" | "person-circle" | "person-circle-outline" | "person-circle-sharp" | "person-outline" | "person-remove" | "person-remove-outline" | "person-remove-sharp" | "person-sharp" | "phone-landscape" | "phone-landscape-outline" | "phone-landscape-sharp" | "phone-portrait" | "phone-portrait-outline" | "phone-portrait-sharp" | "pie-chart-outline" | "pie-chart-sharp" | "pin-outline" | "pin-sharp" | "pint" | "pint-outline" | "pint-sharp" | "pizza" | "pizza-outline" | "pizza-sharp" | "planet" | "planet-outline" | "planet-sharp" | "play-back" | "play-back-circle" | "play-back-circle-outline" | "play-back-circle-sharp" | "play-back-outline" | "play-back-sharp" | "play-circle-outline" | "play-circle-sharp" | "play-forward" | "play-forward-circle" | "play-forward-circle-outline" | "play-forward-circle-sharp" | "play-forward-outline" | "play-forward-sharp" | "play-outline" | "play-sharp" | "play-skip-back" | "play-skip-back-circle" | "play-skip-back-circle-outline" | "play-skip-back-circle-sharp" | "play-skip-back-outline" | "play-skip-back-sharp" | "play-skip-forward" | "play-skip-forward-circle" | "play-skip-forward-circle-outline" | "play-skip-forward-circle-sharp" | "play-skip-forward-outline" | "play-skip-forward-sharp" | "podium" | "podium-outline" | "podium-sharp" | "power-outline" | "power-sharp" | "pricetag" | "pricetag-outline" | "pricetag-sharp" | "pricetags" | "pricetags-outline" | "pricetags-sharp" | "print-outline" | "print-sharp" | "prism" | "prism-outline" | "prism-sharp" | "pulse-outline" | "pulse-sharp" | "push" | "push-outline" | "push-sharp" | "qr-code" | "qr-code-outline" | "qr-code-sharp" | "radio-button-off" | "radio-button-off-outline" | "radio-button-off-sharp" | "radio-button-on" | "radio-button-on-outline" | "radio-button-on-sharp" | "radio-outline" | "radio-sharp" | "rainy" | "rainy-outline" | "rainy-sharp" | "reader" | "reader-outline" | "reader-sharp" | "receipt-outline" | "receipt-sharp" | "recording" | "recording-outline" | "recording-sharp" | "refresh-circle" | "refresh-circle-outline" | "refresh-circle-sharp" | "refresh-outline" | "refresh-sharp" | "reload" | "reload-circle" | "reload-circle-outline" | "reload-circle-sharp" | "reload-outline" | "reload-sharp" | "remove-circle" | "remove-circle-outline" | "remove-circle-sharp" | "remove-outline" | "remove-sharp" | "reorder-four" | "reorder-four-outline" | "reorder-four-sharp" | "reorder-three" | "reorder-three-outline" | "reorder-three-sharp" | "reorder-two" | "reorder-two-outline" | "reorder-two-sharp" | "repeat-outline" | "repeat-sharp" | "resize" | "resize-outline" | "resize-sharp" | "restaurant" | "restaurant-outline" | "restaurant-sharp" | "return-down-back" | "return-down-back-outline" | "return-down-back-sharp" | "return-down-forward" | "return-down-forward-outline" | "return-down-forward-sharp" | "return-up-back" | "return-up-back-outline" | "return-up-back-sharp" | "return-up-forward" | "return-up-forward-outline" | "return-up-forward-sharp" | "ribbon-outline" | "ribbon-sharp" | "rocket-outline" | "rocket-sharp" | "rose" | "rose-outline" | "rose-sharp" | "sad" | "sad-outline" | "sad-sharp" | "save-outline" | "save-sharp" | "scale" | "scale-outline" | "scale-sharp" | "scan" | "scan-circle" | "scan-circle-outline" | "scan-circle-sharp" | "scan-outline" | "scan-sharp" | "school-outline" | "school-sharp" | "search-circle" | "search-circle-outline" | "search-circle-sharp" | "search-outline" | "search-sharp" | "send-outline" | "send-sharp" | "server-outline" | "server-sharp" | "settings-outline" | "settings-sharp" | "shapes-outline" | "shapes-sharp" | "share-outline" | "share-sharp" | "share-social" | "share-social-outline" | "share-social-sharp" | "shield-checkmark" | "shield-checkmark-outline" | "shield-checkmark-sharp" | "shield-half" | "shield-half-outline" | "shield-half-sharp" | "shield-outline" | "shield-sharp" | "shirt-outline" | "shirt-sharp" | "shuffle-outline" | "shuffle-sharp" | "skull-outline" | "skull-sharp" | "snow-outline" | "snow-sharp" | "sparkles" | "sparkles-outline" | "sparkles-sharp" | "speedometer" | "speedometer-outline" | "speedometer-sharp" | "square-outline" | "square-sharp" | "star-half-outline" | "star-half-sharp" | "star-outline" | "star-sharp" | "stats-chart" | "stats-chart-outline" | "stats-chart-sharp" | "stop-circle-outline" | "stop-circle-sharp" | "stop-outline" | "stop-sharp" | "stopwatch-outline" | "stopwatch-sharp" | "storefront" | "storefront-outline" | "storefront-sharp" | "subway-outline" | "subway-sharp" | "sunny" | "sunny-outline" | "sunny-sharp" | "swap-horizontal" | "swap-horizontal-outline" | "swap-horizontal-sharp" | "swap-vertical" | "swap-vertical-outline" | "swap-vertical-sharp" | "sync-circle" | "sync-circle-outline" | "sync-circle-sharp" | "sync-outline" | "sync-sharp" | "tablet-landscape-outline" | "tablet-landscape-sharp" | "tablet-portrait-outline" | "tablet-portrait-sharp" | "telescope" | "telescope-outline" | "telescope-sharp" | "tennisball" | "tennisball-outline" | "tennisball-sharp" | "terminal-outline" | "terminal-sharp" | "text-outline" | "text-sharp" | "thermometer-outline" | "thermometer-sharp" | "thumbs-down-outline" | "thumbs-down-sharp" | "thumbs-up-outline" | "thumbs-up-sharp" | "thunderstorm" | "thunderstorm-outline" | "thunderstorm-sharp" | "ticket-outline" | "ticket-sharp" | "time-outline" | "time-sharp" | "timer-outline" | "timer-sharp" | "today" | "today-outline" | "today-sharp" | "toggle" | "toggle-outline" | "toggle-sharp" | "trail-sign" | "trail-sign-outline" | "trail-sign-sharp" | "train-outline" | "train-sharp" | "transgender-outline" | "transgender-sharp" | "trash-bin" | "trash-bin-outline" | "trash-bin-sharp" | "trash-outline" | "trash-sharp" | "trending-down-outline" | "trending-down-sharp" | "trending-up-outline" | "trending-up-sharp" | "triangle-outline" | "triangle-sharp" | "trophy-outline" | "trophy-sharp" | "tv-outline" | "tv-sharp" | "umbrella-outline" | "umbrella-sharp" | "unlink-outline" | "unlink-sharp" | "videocam" | "videocam-off" | "videocam-off-outline" | "videocam-off-sharp" | "videocam-outline" | "videocam-sharp" | "volume-high-outline" | "volume-high-sharp" | "volume-low-outline" | "volume-low-sharp" | "volume-medium" | "volume-medium-outline" | "volume-medium-sharp" | "volume-mute-outline" | "volume-mute-sharp" | "volume-off-outline" | "volume-off-sharp" | "walk" | "walk-outline" | "walk-sharp" | "wallet-outline" | "wallet-sharp" | "warning-outline" | "warning-sharp" | "watch-outline" | "watch-sharp" | "water-outline" | "water-sharp" | "wifi-outline" | "wifi-sharp" | "wine" | "wine-outline" | "wine-sharp" | "woman-outline" | "woman-sharp";