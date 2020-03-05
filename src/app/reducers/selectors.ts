import { createSelector } from "@ngrx/store";
import { EditorState } from ".";

export const selectState = (state: EditorState) => state;

export const pdfTree = createSelector(
    selectState,
    (state: EditorState) => state.tree,
);

export const peekUndo = createSelector(
    selectState,
    (state: EditorState) => state.undoStack[state.undoStack.length - 1],
);

export const peekRedo = createSelector(
    selectState,
    (state: EditorState) => state.redoStack[state.redoStack.length - 1],
);
