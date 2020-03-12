import { createAction, props } from "@ngrx/store";
import { PdfTreeItem, PdfTreeItemId } from "./pdf-tree.reducer";

export interface Pdf {
    items: PdfTreeItem[];
}

// export const treeChanged = createAction(
//     "[Editor Tree] Tree changed",
//     props<{ tree: PdfTree }>(),
// );

export const moveAsSibling = createAction(
    "[Editor Tree] Move As Sibling",
    props<{ moving: PdfTreeItemId, newSibling: PdfTreeItemId, where: "before" | "after" }>(),
);

export const moveInside = createAction(
    "[Editor Tree] Move Inside",
    props<{ moving: PdfTreeItemId, newParent: PdfTreeItemId }>(),
);

export const setPdf = createAction("[Editor Tree] Set PDF Tree", props<{ pdf: Pdf }>());

export const addPdfItem = createAction("[Editor Tree] Add PDF Item", props<{ item: PdfTreeItem, parent: PdfTreeItemId }>());
