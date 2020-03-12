
export const undo = createAction("[Editor] Undo");

export const redo = createAction("[Editor] Redo");

export const registerUndo = createAction(
    "[Editor] Register Undo",
    props<{ label: string }>(),
);

on(PdfTreeActions.undo, (state) => {
    state = deepClone(state);

    const undo = state.undoStack.pop();

    if (!undo) {
        console.warn("Nothing to undo");
        return state;
    }

    state.redoStack.push({
        label: undo.label,
        elements: state.tree,
    });
    state.tree = undo.elements;

    return state;
}),

    on(PdfTreeActions.redo, (state) => {
        state = deepClone(state);

        const redo = state.redoStack.pop();

        if (!redo) {
            console.warn("Nothing to redo");
            return state;
        }

        state.undoStack.push({
            label: redo.label,
            elements: state.tree,
        });
        state.tree = redo.elements;

        return state;
    }),

    on(PdfTreeActions.registerUndo, (state, props) => {
        state = deepClone(state);
        state.undoStack.push({
            label: props.label,
            elements: deepClone(state.tree),
        });
        return state;
    }),


    export const peekUndo = createSelector(
        selectState,
        (state: PdfTreeState) => state.undoStack[state.undoStack.length - 1],
    );

export const peekRedo = createSelector(
    selectState,
    (state: PdfTreeState) => state.redoStack[state.redoStack.length - 1],
);
