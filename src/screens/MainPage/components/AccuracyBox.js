import Text from "../../../components/Text";
import StatBox from "./StatBox";

export default function AccuracyBox({ showColumnLayout }) {
    return (
        <StatBox
            colors = {["#0083B0", "#fdcb6e"]}
            end = {{ x: 1, y: 1 }}
            style = {{ width: showColumnLayout? "100%": "50%" }}
        >
            <Text>Accuracy box</Text>
        </StatBox>
    )
}