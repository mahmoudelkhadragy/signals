import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { LessonsService } from '../services/lessons.service';
import { Lesson } from '../models/lesson.model';
import { LessonDetailComponent } from './lesson-detail/lesson-detail.component';
import { fadeSlideAnimation } from './lesson.animation';

@Component({
  selector: 'lessons',
  imports: [LessonDetailComponent],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.scss',
  animations: [fadeSlideAnimation],
})
export class LessonsComponent {
  mode = signal<'master' | 'detial'>('master');
  lessons = signal<Lesson[]>([]);
  selectedLesson = signal<Lesson | null>(null);
  lessonsService = inject(LessonsService);

  searchInput = viewChild<ElementRef>('search');

  async onSearch() {
    const query = this.searchInput()?.nativeElement.value;
    console.log('query ', query);
    const results = await this.lessonsService.loadLessons({ query });

    this.lessons.set(results);
  }

  onLessonSelected(lesson: Lesson) {
    this.mode.set('detial');
    this.selectedLesson.set(lesson);
  }

  onCancel() {
    this.mode.set('master');
    this.selectedLesson.set(null);
  }

  onLessonUpdated(lesson: Lesson) {
    this.lessons.update((lessons => lessons.map(l => l.id === lesson.id ? lesson : l)));
    this.onCancel();
  }
}
