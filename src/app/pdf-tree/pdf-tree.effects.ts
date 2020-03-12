import { Injectable } from "@angular/core";
import { Actions } from "@ngrx/effects";
import { PdfBuilder } from "../services/pdf-builder.service";

@Injectable()
export class PdfTreeEffects {

    // moved$ = createEffect(
    //     () => this.actions$.pipe(
    //         ofType(PdfTreeActions.moveInside),
    //         map((payload) => ({
    //             from: this.database.getParent(payload.moving),
    //             to: payload.newParent,
    //             which: this.database.moveItem(payload.moving, payload.newParent)
    //         })),
    //         map((data) => PdfTreeActions.nodeMoved(data))
    //     ),
    //     { dispatch: true }
    // );

    // movedSibling$ = createEffect(
    //     () => this.actions$.pipe(
    //         ofType(PdfTreeActions.moveAsSibling),
    //         map((payload) => ({
    //             from: this.database.getParent(payload.moving),
    //             to: this.database.getParent(payload.newSibling),
    //             which: this.database.moveItemSibling(payload.moving, payload.newSibling, payload.where)
    //         })),
    //         map((data) => PdfTreeActions.nodeMoved(data))
    //     ),
    //     { dispatch: true }
    // );

    constructor(
        private database: PdfBuilder,
        private actions$: Actions,
    ) { }

}
