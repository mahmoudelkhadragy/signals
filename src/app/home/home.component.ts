import {
  Component,
  computed,
  effect,
  inject,
  Injector,
  signal,
} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Course, sortCoursesBySeqNo } from '../models/course.model';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { CoursesCardListComponent } from '../courses-card-list/courses-card-list.component';
import { MatDialog } from '@angular/material/dialog';
import { MessagesService } from '../messages/messages.service';
import { catchError, from, interval, startWith, throwError } from 'rxjs';
import {
  toObservable,
  toSignal,
  outputToObservable,
  outputFromObservable,
} from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CoursesServiceWithFetch } from '../services/courses-fetch.service';
import { CourseCategoryEnum } from '../enums/category.emun';
import { openEditCourseDialog } from '../edit-course-dialog/edit-course-dialog.component';
import { LoadingService } from '../loading/loading.service';

@Component({
  standalone: true,
  selector: 'home',
  imports: [MatTabGroup, MatTab, CoursesCardListComponent, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  #courses = signal<Course[]>([]);
  beginnersCourses = computed(() => {
    return this.#courses().filter(
      (course) => course.category === CourseCategoryEnum.BEGINNER
    );
  });
  advancedCourses = computed(() => {
    return this.#courses().filter(
      (course) => course.category === CourseCategoryEnum.ADVANCED
    );
  });

  #coursesService = inject(CoursesService);
  #messagesService = inject(MessagesService);

  dialog = inject(MatDialog);

  // courses$ = toObservable(this.#courses);

  constructor() {
    // this.courses$.subscribe((courses) => {
    //   console.log('courses$', courses);
    // });

    this.loadCourses();
  }

  injector = inject(Injector);
  courses$ = from(this.#coursesService.loadAllCourses());

  onToSignal() {
    const number$ = interval(1000).pipe(
      startWith(0)
    );
    const number = toSignal(number$,
      {
        injector: this.injector,
        // initialValue: 0,
        requireSync: true
      });

    effect(() => {
      console.log('numbers: ', number());
    }, {
      injector: this.injector
    });
  }

  onToObservable() {
    const numbers = signal(0);
    numbers.set(1);
    const numbers$ = toObservable(numbers, { injector: this.injector });
    numbers.set(2);
    numbers.set(3);
    numbers$.subscribe((num) => console.log('num', num));
    numbers.set(4);

  }

  async loadCourses() {
    try {
      const courses = await this.#coursesService.loadAllCourses();
      this.#courses.set(courses.sort(sortCoursesBySeqNo));
    } catch (error) {
      this.#messagesService.showMessage('Error loading courses', 'info');
    }
  }

  async onAddCourse() {
    const newCourse = await openEditCourseDialog(this.dialog, {
      mode: 'create',
      title: 'Create New Course',
    });
    if (!newCourse) {
      return;
    }
    this.#courses.set([newCourse, ...this.#courses()]);
  }

  onCourseUpdated(updatedCourse: Course) {
    const courses = this.#courses();
    const newCourses = courses.map((course) =>
      course.id === updatedCourse.id ? updatedCourse : course
    );
    this.#courses.set(newCourses);
  }

  async onCourseDeleted(courseId: string) {
    try {
      await this.#coursesService.deleteCourse(courseId);
      const courses = this.#courses();
      const newCourses = courses.filter((course) => course.id !== courseId);
      this.#courses.set(newCourses);
    } catch (error) {
      console.error(error);
    }
  }



}
