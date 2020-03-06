import { Directive, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";
import { environment } from "../environments/environment";

// tslint:disable-next-line: directive-selector
@Directive({ selector: "[devMode]" })
export class DevDirective implements OnInit {

    private hasView = false;

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
    ) { }

    public ngOnInit() {
        if (environment.production && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (!environment.production && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }

}
