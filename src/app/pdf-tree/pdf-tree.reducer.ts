import { Action, createReducer } from "@ngrx/store";
import { Element } from "../elements/band";

export const reducerKey = "editor";

export interface PdfTree {
    [id: string]: Element;
}

export interface PdfTreeState {
    tree: PdfTree;
}

export const initialState: PdfTreeState = {
    tree: {
        // 1: { id: "1", siblingIndex: 1, key: "root" },
        // 2: { id: "2", siblingIndex: 2, key: "root", parentId: "1" },
        // 3: { id: "3", siblingIndex: 3, key: "root", parentId: "1" },
        // 4: { id: "4", siblingIndex: 4, key: "root", parentId: "2" },
        // 5: { id: "5", siblingIndex: 5, key: "root", parentId: "3" },
    },
};

const treeReducer = createReducer(
    initialState,

    // on(PdfTreeActions.moveAsSibling, (state, props) => deepClone(state)),
    // on(PdfTreeActions.treeChanged, (state, props) => ({ ...deepClone(state), tree: props.tree })),
    // on(PdfTreeActions.moveAsSibling, (state, props) => {

    //     if (props.newSibling.parentId === undefined) {
    //         console.warn(`Target sibling "${props.newSibling.id}" has no parent id`);
    //         return state;
    //     }

    //     state = deepClone(state);

    //     const children = PdfTreeSelectors.selectElementChildren(state, { id: props.newSibling.parentId });

    //     const targetIndex = props.newSibling.siblingIndex + (props.where === "below" ? 0 : -1);

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
