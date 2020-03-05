import { TestBed } from "@angular/core/testing";
import { DomSanitizer } from "@angular/platform-browser";
import { SafePipe } from "./safe.pipe";

describe("SafePipe", () => {

    let pipe: SafePipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [DomSanitizer]
        });
        const sanitized = TestBed.inject(DomSanitizer);
        pipe = new SafePipe(sanitized);
    });

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    it("should return sanitized resource", () => {
        const resource = "http://www.africau.edu/images/default/sample.pdf";
        expect(pipe.transform(resource)).toBeTruthy();
    });

    it("should return sanitized resource when passing empty string", () => {
        const resource = "";
        expect(pipe.transform(resource)).toBeTruthy();
    });

    it("should return the passed argument when not a string", () => {
        expect(pipe.transform(123)).toEqual(123);
    });

    it("should return undefined when passing a undefined", () => {
        expect(pipe.transform(undefined)).toBeUndefined();
    });

    it("should return null when passing a null", () => {
        expect(pipe.transform(null)).toBeNull();
    });

});
