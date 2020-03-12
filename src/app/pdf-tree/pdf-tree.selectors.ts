import { createSelector } from "@ngrx/store";
import { PdfTreeState, reducerKey } from "./pdf-tree.reducer";

export const selectState = (state: { [reducerKey]: PdfTreeState }) => state.editor;

export const selectTree = createSelector(
    selectState,
    (state) => state.tree,
);

export const selectAllElements = createSelector(
    selectTree,
    (tree) => Object.entries(tree || {}).map(([key, value]) => value),
);

// export const selectElementChildren = createSelector(
//     selectAllElements,
//     (elements: Element[], props: { id: string }) => elements
//         .filter((value) => value.parentId === props.id)
//         .sort((a, b) => a.siblingIndex - b.siblingIndex),
// );
