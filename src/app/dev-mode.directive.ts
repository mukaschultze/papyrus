import { Directive, isDevMode, OnInit, TemplateRef, ViewContainerRef } from "@angular/core";

// tslint:disable-next-line: directive-selector
@Directive({ selector: "[devMode]" })
export class DevDirective implements OnInit {

    private hasView = false;

    constructor(
        private viewContainer: ViewContainerRef,
        private templateRef: TemplateRef<any>,
    ) { }

    public ngOnInit() {
        if (isDevMode() && !this.hasView) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.hasView = true;
        } else if (!isDevMode() && this.hasView) {
            this.viewContainer.clear();
            this.hasView = false;
        }
    }

}
