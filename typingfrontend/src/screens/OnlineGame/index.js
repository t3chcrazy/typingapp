import { useEffect } from 'react'
import { View } from "react-native";
import Text from "../../components/Text";
import endpoints from "../../api/endpoints";
import { useMutation } from "@tanstack/react-query";
import fetcher from "../../api/fetcher";

export default function OnlineGame() {
    const recordCreator = useMutation({
        mutationKey: ["createRecord"],
        mutationFn: body => fetcher(endpoints.SAVE_RUN, { method: "POST", body: JSON.stringify(body) })
    })

    useEffect(() => {
        recordCreator.mutate({
            wpm: 89,
            correctKeyStrokes: 200,
            wrongKeystrokes: 18,
            accuracy: 200/(200+18)*100,
        })
    }, [])

    return (
        <View>
            <Text>Hello online game world!</Text>
        </View>
    )
}