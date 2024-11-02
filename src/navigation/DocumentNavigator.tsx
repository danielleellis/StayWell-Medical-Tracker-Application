import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Documents from "../screens/documents/Documents";
import NewDocument from "../screens/documents/NewDocument";
import LoadDocument from "../screens/documents/LoadDocument";
import ImageViewer from "../screens/documents/ImageViewer";

export type DocumentStackParamList = {
    Documents: undefined;
    NewDocument: undefined;
    LoadDocument: { documentID: string; documentName: string };
    ImageViewer: { imageUri: string };
};

const DocumentStack = createStackNavigator<DocumentStackParamList>();

const DocumentNavigator: React.FC = () => {
    return (
        <DocumentStack.Navigator>
            <DocumentStack.Screen
                name="Documents"
                component={Documents}
                options={{ headerShown: false, title: "Documents" }}
            />
            <DocumentStack.Screen
                name="NewDocument"
                component={NewDocument}
                options={{ headerShown: false }} // Disable default header for NewDocument
            />
            <DocumentStack.Screen
                name="LoadDocument"
                component={LoadDocument}
                options={{ headerShown: true, title: "Document" }}
            />
            <DocumentStack.Screen
                name="ImageViewer"
                component={ImageViewer}
                options={{ headerShown: true, title: "Image" }}
            />
        </DocumentStack.Navigator>
    );
};

export default DocumentNavigator;
