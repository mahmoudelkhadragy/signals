import {
    trigger,
    transition,
    style,
    animate
  } from '@angular/animations';
  
  export const fadeSlideAnimation = trigger('fadeSlide', [
  
    transition(':enter', [
      style({
        opacity: 0,
        transform: 'translateX(20px)'
      }),
      animate('250ms ease-out', style({
        opacity: 1,
        transform: 'translateX(0)'
      }))
    ]),
  
    transition(':leave', [
      animate('200ms ease-in', style({
        opacity: 0,
        transform: 'translateX(-20px)'
      }))
    ])
  
  ]);