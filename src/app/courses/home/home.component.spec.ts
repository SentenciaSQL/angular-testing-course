import {async, waitForAsync, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { click } from '../common/test-utils';




describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let courseService: any;

  const beginnerCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancesCourses = setupCourses().filter(course => course.category == 'ADVANCED');

  beforeEach(waitForAsync(() => {

    const courseServiceSpy = jasmine.createSpyObj('CoursesService', ['findAllCourses']);

    TestBed.configureTestingModule({
      imports: [CoursesModule, NoopAnimationsModule],
      providers: [
        {provide: CoursesService, useValue: courseServiceSpy}
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        el = fixture.debugElement;
        courseService = TestBed.inject(CoursesService);
      });

  }));

  it("should create the component", () => {

    expect(component).toBeTruthy();

  });


  it("should display only beginner courses", () => {

    courseService.findAllCourses.and.returnValue(of(beginnerCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs founs");

  });


  it("should display only advanced courses", () => {

    courseService.findAllCourses.and.returnValue(of(advancesCourses));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");


  });


  it("should display both tabs", () => {

    courseService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    expect(tabs.length).toBe(2, "Expected two tabs");

  });


  it("should display advanced courses when tab clicked", fakeAsync(() => {

    courseService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    //el.nativeElement.click();
    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const carTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

    expect(carTitles.length).toBeGreaterThan(0, "Could not fnd card titles");

    expect(carTitles[0].nativeElement.textContent).toContain("Angular Security Course");


  }));

  it("should display advanced courses when tab clicked", waitForAsync(() => {

    courseService.findAllCourses.and.returnValue(of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css(".mat-tab-label"));

    //el.nativeElement.click();
    click(tabs[1]);

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const carTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title'));

      expect(carTitles.length).toBeGreaterThan(0, "Could not fnd card titles");

      expect(carTitles[0].nativeElement.textContent).toContain("Angular Security Course");
    });

  }));

});


