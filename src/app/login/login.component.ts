import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessagesService } from '../messages/messages.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  messageService = inject(MessagesService);

  form = this.fb.group({
    email: [''],
    password: [''],
  });

  async onLogin() {
    try {
      const { email, password } = this.form.value;
      if (!email || !password) {
        this.messageService.showMessage(
          'Please enter email and password',
          'error'
        );
        return;
      }
      await this.authService.login(email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.log(error);
      this.messageService.showMessage(
        'Login Faild, please try again.',
        'error'
      );
    }
  }
}
