import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DocumentState {
    documentID: string | null;
    documentName: string | null;
}

const initialState: DocumentState = {
    documentID: null,
    documentName: null,
};

const forgotDocumentPasscodeSlice = createSlice({
    name: 'forgotDocumentPasscode',
    initialState,
    reducers: {
        setDocumentInfo: (state, action: PayloadAction<{ documentID: string; documentName: string }>) => {
            state.documentID = action.payload.documentID;
            state.documentName = action.payload.documentName;
        },
        clearDocumentInfo: (state) => {
            state.documentID = null;
            state.documentName = null;
        },
    },
});

export const { setDocumentInfo, clearDocumentInfo } = forgotDocumentPasscodeSlice.actions;

export default forgotDocumentPasscodeSlice.reducer;
