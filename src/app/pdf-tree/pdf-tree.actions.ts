import { createAction, props } from "@ngrx/store";
import { Element } from "../elements/band";
import { PdfTree } from "./pdf-tree.reducer";

export const treeChanged = createAction(
    "[Editor Tree] Tree changed",
    props<{ tree: PdfTree }>(),
);

export const moveAsSibling = createAction(
    "[Editor Tree] Move As Sibling",
    props<{ moving: Element, newSibling: Element, where: "above" | "below" }>(),
);

export const moveInside = createAction(
    "[Editor Tree] Move Inside",
    props<{ moving: Element, newParent: Element }>(),
);
