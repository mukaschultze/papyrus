import { createAction, props } from "@ngrx/store";

export const undo = createAction("[Editor] Undo");

export const redo = createAction("[Editor] Redo");

export const registerUndo = createAction(
  "[Editor] RegisterUndo",
  props<{ label: string }>(),
);

export const moveAbove = createAction(
  "[Editor Tree] Move Above",
  props<{ moving: Element, newSibling: Element }>(),
);

export const moveBelow = createAction(
  "[Editor Tree] Move Below",
  props<{ moving: Element, newSibling: Element }>(),
);

export const moveInside = createAction(
  "[Editor Tree] Move Inside",
  props<{ moving: Element, newParent: Element }>(),
);
