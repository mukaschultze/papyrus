import { createSelector } from "@ngrx/store";
import { adapter, PdfTreeState, reducerKey } from "./pdf-tree.reducer";

export const selectState = (state: { [reducerKey]: PdfTreeState }) => state[reducerKey];

const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = adapter.getSelectors();

export const selectPdfItemsIds = selectIds;
export const selectPdfItemsEntities = selectEntities;
export const selectAllPdfItems = selectAll;
export const selectPdfItemsCount = selectTotal;

// export const select = createSelector(
//     selectState,
//     (state) => state.entities,
// );

// export const selectAllElements = createSelector(
//     selectTree,
//     (tree) => Object.entries(tree || {}).map(([key, value]) => value),
// );

export const selectItemById = createSelector(
    selectPdfItemsEntities,
    (entities, props) => entities[props.id],
);

export const selectParent = createSelector(
    selectPdfItemsEntities,
    selectItemById,
    (item, props) => entities[props.id],
);

