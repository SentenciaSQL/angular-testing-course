import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

describe("Async Testing Examples", () => {

    it("Asyncronous test example with Jasmine done", (done: DoneFn) => {

        let test = false;

        setTimeout(() => {
            test = true;

            expect(test).toBeTruthy();

            done();
        }, 1000);

    });

    it("Asyncronous test example - setTimeout()", fakeAsync(() => {

        let test = false;

        setTimeout(() => {
            console.log("Running assertions");
            
            test = true;

        }, 1000);

        //tick(1000);

        flush();

        expect(test).toBeTruthy();

    }));

    it("Asyncronous test example - plain Promise", fakeAsync(() => {
        let test = false;

        console.log("Creating Promise");

        Promise.resolve().then(() => {
            test = true;
            Promise.resolve();
        }).then(() => {
            console.log("Then");
        });

        flushMicrotasks();

        console.log("Running assertions");

        expect(test).toBeTruthy();
    }));

    it("Asyncronous test example with Promises + setTimeout", fakeAsync(() => {
        let counter = 0;

        Promise.resolve().then(() => {
            counter += 10;

            setTimeout(() => {
                counter += 1;
            }, 1000);
        });

        expect(counter).toBe(0);

        flushMicrotasks();

        tick(500);

        expect(counter).toBe(10);

        tick(500);

        expect(counter).toBe(11);
    }));

    it("Asyncronous test example - Observable", fakeAsync(() => {

        let test = false;

        const test$ = of(test).pipe(delay(1000));

        test$.subscribe(() => {
            test = true;
        });

        tick(1000);

        expect(test).toBe(true);

    }));

});