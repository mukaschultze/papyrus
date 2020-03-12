import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { Action, createReducer, on } from "@ngrx/store";
import * as PdfTreeActions from "./pdf-tree.actions";
export const reducerKey = "editor";

export type PdfTreeItemId = string;

function asNumberArray(v: any): number[] {
    return v;
}

export interface PdfTreeItem {
    id: PdfTreeItemId;
    key: string;
    childrenIds: PdfTreeItemId[];
    parentId?: PdfTreeItemId;
}

export interface PdfTreeState extends EntityState<PdfTreeItem> {
    // additional entities state properties
}

export const adapter = createEntityAdapter<PdfTreeItem>({
    selectId: (entity) => {
        console.log("entity", entity);
        return entity.id;
    }
});

export const initialState = adapter.getInitialState({
});

const treeReducer = createReducer(
    initialState,

    on(PdfTreeActions.setPdf, (state, { pdf }) =>
        state = adapter.setAll(pdf.items, state)
    ),

    on(PdfTreeActions.addPdfItem, (state, { item, parent }) => {

        if (parent === item.id) {
            console.warn(`Item "${parent}" cannot be its own parent`);
            return state;
        }

        const parentItem = state.entities[parent];

        if (!parentItem) {
            console.warn(`Parent "${parent}" not found`);
            return state;
        }

        state = adapter.addOne({
            ...item,
            parentId: parent,
        }, state);
        state = adapter.setOne({
            ...parentItem,
            childrenIds: parentItem.childrenIds.concat(item.id)
        }, state);

        return state;
    }),

    on(PdfTreeActions.moveAsSibling, (state, { moving, newSibling, where }) => {

        const movingItem = state.entities[moving];
        const newSiblingItem = state.entities[newSibling];

        if (!movingItem) {
            console.warn(`Item "${moving}" not found`);
            return state;
        }

        if (!newSiblingItem) {
            console.warn(`Item "${newSibling}" not found`);
            return state;
        }

        const oldParentItem = state.entities[movingItem.parentId ?? -1];
        const newParentItem = state.entities[newSiblingItem.parentId ?? -1];

        if (!newParentItem) {
            console.warn(`Target parent "${newSiblingItem.parentId}" not found`);
            return state;
        }

        if (oldParentItem) {
            // Remove reference from old parent
            state = adapter.setOne({
                ...oldParentItem,
                childrenIds: oldParentItem.childrenIds.filter((c) => c !== moving)
            }, state);
        }

        const indexOfTargetSibling = newParentItem.childrenIds.indexOf(newSibling) +
            (where === "before" ? 0 : 1);

        const updatedChildrenIds = [
            ...newParentItem.childrenIds.slice(undefined, indexOfTargetSibling),
            moving,
            ...newParentItem.childrenIds.slice(indexOfTargetSibling, undefined),
        ];

        console.log("WUT", updatedChildrenIds);

        // Add reference to new parent
        state = adapter.setOne({
            ...newParentItem,
            childrenIds: updatedChildrenIds
        }, state);

        // Update self parent reference
        state = adapter.setOne({
            ...movingItem,
            parentId: newParentItem.id,
        }, state);

        return state;
    }),

    // on(PdfTreeActions.moveAsSibling, (state, props) => deepClone(state)),
    // on(PdfTreeActions.treeChanged, (state, props) => ({ ...deepClone(state), tree: props.tree })),
    // on(PdfTreeActions.moveAsSibling, (state, props) => {

    //     if (props.newSibling.parentId === undefined) {
    //         console.warn(`Target sibling "${props.newSibling.id}" has no parent id`);
    //         return state;
    //     }

    //     state = deepClone(state);

    //     const children = PdfTreeSelectors.selectElementChildren(state, { id: props.newSibling.parentId });

    //     const targetIndex = props.newSibling.siblingIndex + (props.where === "after" ? 0 : -1);

    //     children
    //         .filter((c) => c.siblingIndex >= targetIndex)
    //         .map((c) => ({ ...c, siblingIndex: c.siblingIndex + 1 }));

    //     state.tree[props.moving.id].parentId = props.newSibling.parentId;

    //     return state;
    // }),

    // on(PdfTreeActions.moveInside, (state, props) => {
    //     state = deepClone(state);
    //     state.tree[props.moving.id].parentId = props.newParent.id;
    //     return state;
    // }),

    // on(PdfTreeActions.treeChanged, (state, props) => {
    //     state = deepClone(state);
    //     state.tree = deepClone(props.tree);
    //     console.log("REDUCE?", props.tree);
    //     return state;
    // }),

);

export function reducer(state: PdfTreeState | undefined, action: Action) {
    return treeReducer(state, action);
}
