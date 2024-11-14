// globalStyles.ts
import { StyleSheet } from "react-native";
import { colors } from "../../constants/constants";

export const buttonStyles = StyleSheet.create({
    editButton: {
        marginRight: 10,
        padding: 5,
    },
    editButtonText: {
        color: "#007AFF",
        fontWeight: "bold",
    },
    saveButton: {
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        margin: 10,
        padding: 10,
    },
    saveButtonText: {
        fontSize: 18,
        color: "#45A6FF",
        fontWeight: "bold",
    },
    cancelButton: {
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        margin: 10,
        padding: 10,
    },
    cancelButtonText: {
        color: "gray",
        fontWeight: "bold",
    },
    deleteButton: {
        padding: 5,
    },
    deleteButtonText: {
        color: "red",
        fontWeight: "bold",
    },
});
