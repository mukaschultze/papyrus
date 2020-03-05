import { Action, createReducer, on } from "@ngrx/store";
import * as EditorActions from "../actions/editor.actions";
import { Element } from "../elements/band";
import { deepClone } from "../util";

export const reducerKey = "editor";

interface UndoEntry {
    label: string;
    elements: Element[];
}

export interface EditorState {
    tree: Element[];
    undoStack: UndoEntry[];
    redoStack: UndoEntry[];
}

export const initialState: EditorState = {
    tree: [],
    undoStack: [],
    redoStack: [],
};

const scoreboardReducer = createReducer(
    initialState,
    on(EditorActions.undo, (state) => {
        state = deepClone(state);

        if (state.undoStack.length === 0) {
            console.warn("Nothing to undo");
            return state;
        }

        const undo = state.undoStack.pop();
        state.redoStack.push({
            label: undo.label,
            elements: state.tree,
        });
        state.tree = undo.elements;

        return state;
    }),
    on(EditorActions.redo, (state) => {
        state = deepClone(state);

        if (state.redoStack.length === 0) {
            console.warn("Nothing to redo");
            return state;
        }

        const redo = state.redoStack.pop();
        state.undoStack.push({
            label: redo.label,
            elements: state.tree,
        });
        state.tree = redo.elements;

        return state;
    }),
    on(EditorActions.registerUndo, (state, props) => {
        state = deepClone(state);
        state.undoStack.push({
            label: props.label,
            elements: deepClone(state.tree),
        });
        return state;
    }),
);

export function reducer(state: EditorState | undefined, action: Action) {
    return scoreboardReducer(state, action);
}
