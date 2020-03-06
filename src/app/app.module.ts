import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { PdfViewerModule } from "ng2-pdf-viewer";
import { PdfJsViewerModule } from "ng2-pdfjs-viewer";
import { environment } from "../environments/environment";
import { AppComponent } from "./app.component";
import { AppEffects } from "./app.effects";
import { DevDirective } from "./dev-mode.directive";
import { PdfTreeComponent } from "./pdf-tree/pdf-tree.component";
import { reducer, reducerKey } from "./reducers";
import { SafePipe } from "./safe.pipe";

const reducers = {
    [reducerKey]: reducer,
};

@NgModule({
    declarations: [
        AppComponent,
        PdfTreeComponent,
        SafePipe,
        DevDirective,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        PdfJsViewerModule,
        PdfViewerModule,

        MatTreeModule,
        MatToolbarModule,
        MatMenuModule,
        MatTooltipModule,
        MatButtonModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatIconModule,

        EffectsModule.forRoot([AppEffects]),

        StoreModule.forRoot(reducers, {
            runtimeChecks: {
                strictStateImmutability: true,
                strictActionImmutability: true,
            },
        }),

        !environment.production ?
            StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }) :
            [],

    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
