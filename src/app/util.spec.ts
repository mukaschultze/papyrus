import { from, of } from "rxjs";
import { delay, first, mapTo } from "rxjs/operators";
import * as util from "./util";

describe("util.mergeToArray", () => {

    it("shoud emit the ordered array", (done: DoneFn) => {
        from([1, 2, 3]).pipe(
            util.mergeToArray((a) => of(a).pipe(
                delay(100 - a * 30),
                mapTo(a)
            )),
        ).subscribe((arr) => {
            expect(arr).toEqual([1, 2, 3]);
            done();
        });
    });

    it("shoud not freeze when observables don't emit", (done: DoneFn) => {
        from([]).pipe(
            util.mergeToArray((a) => of(a).pipe(
                delay(100 - a * 30),
                mapTo(a)
            )),
        ).subscribe((arr) => {
            expect(arr).toEqual([]);
            done();
        });
    });

});

describe("util.deepClone", () => {

    it("shoud simple clone", () => {
        const original = { foo: "bar" };
        const clone = util.deepClone(original);
        expect(clone).toEqual(original);
    });

    it("shoud deep clone", () => {
        const original = { foo: { foo: "bar" } };
        const clone = util.deepClone(original);
        expect(clone).toEqual(original);
    });

    it("shoud not be the same refence when simple cloning", () => {
        const original = { foo: "bar" };
        const clone = util.deepClone(original);
        expect(clone).not.toBe(original);
    });

    it("shoud not be the same refence when deep cloning", () => {
        const original = { foo: { foo: "bar" } };
        const clone = util.deepClone(original);
        expect(clone.foo).not.toBe(original.foo);
    });

    it("shoud return undefined when argument is undefined", () => {
        const original = undefined;
        const clone = util.deepClone(original);
        expect(clone).toEqual(original);
    });

    it("shoud return null when argument is null", () => {
        const original = null;
        const clone = util.deepClone(original);
        expect(clone).toEqual(original);
    });

    it("shoud return primitive when argument is primitive", () => {
        const original = 123;
        const clone = util.deepClone(original);
        expect(clone).toEqual(original);
    });

});

describe("util.localStorageSubject", () => {

    const key = "localStorageSubjectTests";
    const defaultValue = { foo: { bar: 123456 } };
    const customNewValue = { foo: { bar: 654321 } };

    it("should start with previous value", (done: DoneFn) => {
        localStorage.setItem(key, JSON.stringify(customNewValue));
        const subject$ = util.localStorageSubject(key, defaultValue);
        subject$.pipe(
            first(),
        ).subscribe((val) => {
            expect(val).toEqual(customNewValue);
            done();
        });
    });

    it("should start with default value if there are no saved values", (done: DoneFn) => {
        localStorage.removeItem(key);
        const subject$ = util.localStorageSubject(key, defaultValue);
        subject$.pipe(
            first(),
        ).subscribe((val) => {
            expect(val).toEqual(defaultValue);
            done();
        });
    });

    it("should save emitted values", (done: DoneFn) => {
        localStorage.removeItem(key);

        const subjectA$ = util.localStorageSubject(key, defaultValue);
        subjectA$.next(customNewValue);

        const subjectB$ = util.localStorageSubject(key, defaultValue);
        subjectB$.pipe(
            first(),
        ).subscribe((val) => {
            expect(val).toEqual(customNewValue);
            done();
        });
    });

    it("should return default value when the saved JSON is corrupted", (done: DoneFn) => {
        spyOn(console, "error");

        localStorage.setItem(key, "nmwuioq;;z//-=[}{}{}mciowanouitn");
        const subject$ = util.localStorageSubject(key, defaultValue);
        subject$.pipe(
            first(),
        ).subscribe((val) => {
            expect(val).toEqual(defaultValue);
            expect(console.error).toHaveBeenCalled();
            done();
        });
    });

});
