import { Component, OnInit } from "@angular/core";
import { SafeResourceUrl } from "@angular/platform-browser";
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { merge, NEVER, Observable, Observer, zip } from "rxjs";
import { debounceTime, filter, map, mapTo, pairwise, shareReplay, startWith, switchMap, take, tap } from "rxjs/operators";
import { payload } from "../payload.json";
import { report } from "../report.json";
import { RootPDF } from "./elements/band";
import { CacheService } from "./services/cache.service";
import { ImageCacheService } from "./services/image-cache.service";
import { PdfBuilder } from "./services/pdf-builder.service";
import { ReportsService } from "./services/reports.service";
import { localStorageSubject } from "./util";

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs; // Fixes "File 'Roboto-Regular.ttf' not found in virtual file system"

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {

    public pdfTemplate: Observable<RootPDF> = NEVER;
    public pdfDefinition: Observable<pdfMake.TDocumentDefinitions> = NEVER;
    public pdfBlob: Observable<Blob> = NEVER;
    public pdfUrl: Observable<SafeResourceUrl> = NEVER;
    public buildTime: Observable<number> = NEVER;
    public building: Observable<boolean> = NEVER;

    public viewer = localStorageSubject<"iframe" | "pdf-viewer" | "ng2-pdfjs-viewer">("pdf-viewer", "iframe");
    public theme = localStorageSubject<"dark-theme" | "light-theme">("app-theme", "dark-theme");

    constructor(
        private pdfBuilder: PdfBuilder,
        private reports: ReportsService,
        private cache: CacheService,
        private imageCache: ImageCacheService,
    ) {
        this.theme.pipe(
            startWith(undefined as any),
            pairwise(),
        ).subscribe(([oldTheme, newTheme]) => {
            const body = document.getElementsByTagName("body").item(0);

            if (body == null) {
                console.error("Could not find page body");
            } else {
                body.classList.remove(oldTheme);
                body.classList.add(newTheme);
            }
        });
    }

    public ngOnInit() {

        this.pdfBuilder.setCurrentPdf(report as any);

        this.pdfTemplate = this.pdfBuilder.outputTemplate;

        this.pdfDefinition = this.pdfTemplate.pipe(
            debounceTime(150),
            switchMap((template) => this.reports.generateReport(template, payload)),
            shareReplay(1),
        );

        this.pdfBlob = this.pdfDefinition.pipe(
            switchMap((def) => this.buildPdf(def)),
            shareReplay(1),
        );

        this.pdfUrl = this.pdfBlob.pipe(
            map((blob) => URL.createObjectURL(blob)),
            startWith(undefined as any),
            pairwise(),
            tap(([prev, current]) => URL.revokeObjectURL(prev)), // Release the URL to prevent memory leaks
            filter(([prev, current]) => !!current),
            map(([prev, current]) => current),
            shareReplay(1),
        );

        this.buildTime = zip(
            this.pdfTemplate.pipe(map(() => +new Date())),
            this.pdfBlob.pipe(map(() => +new Date())),
        ).pipe(
            map(([start, end]) => end - start),
            shareReplay(1),
        );

        this.building = merge(
            this.pdfTemplate.pipe(mapTo(true)),
            this.pdfBlob.pipe(mapTo(false)),
        ).pipe(
            shareReplay(1),
        );

    }

    public buildPdf(definition: pdfMake.TDocumentDefinitions): Observable<Blob> {
        return new Observable((observer: Observer<Blob>) => {

            definition = {
                ...definition,
                footer: (currentPage, pageCount) => `${currentPage} of ${pageCount}`,
            };

            const pdf = pdfMake.createPdf(definition);

            pdf.getBuffer((buffer) => {
                const blob = new Blob([buffer], { type: "application/pdf" });

                observer.next(blob);
                observer.complete();
            });
        });
    }

    public changeTheme() {
        this.theme.next(
            this.theme.value === "dark-theme" ? "light-theme" : "dark-theme",
        );
    }

    public log(obs: Observable<any>, prefix?: string) {
        obs.pipe(
            take(1),
        ).subscribe((val) => console.log(prefix || val, prefix && val));
    }

    public rebuildPdf() {
        this.pdfBuilder.rebuildPdf();
    }

    public clearCaches() {
        this.imageCache.clearCache();
        this.cache.deleteCaches("all").subscribe((c) => console.log("Caches cleared", c));
    }
}
