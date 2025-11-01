import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* PrimeNG UI */
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

/* PrimeNG services */
import { MessageService } from 'primeng/api';

import { User } from '../../../core/model/user.model';
import { AuthAPIService } from '../authAPI.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    ButtonModule,
    MessageModule,
    ToastModule,
    DialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService] // <-- provide MessageService here (or globally)
})
export class LoginComponent {
  private authService = inject(AuthAPIService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  // loading/dialog
  isLoading = false;
  visible = false;
  formModel: any = {
    userType: 'ADMIN',
    username: '',
    password: ''
  };
  // dropdown options
  userTypes = [
    { label: 'Admin',  value: 'ADMIN' },
    { label: 'طالب',   value: 'STUDENT' },
    { label: 'معلم',   value: 'TEACHER' },
    { label: 'ولي أمر', value: 'GUARDIAN' },
    { label: 'مدير',   value: 'MANAGER' }
  ];

  showDialog() {
    this.isLoading = true;
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.isLoading = false;
  }

  login(user: User): void {
    if (!user?.userType) {
      this.messageService.add({
        severity: 'warn',
        summary: 'تحقق',
        detail: 'يرجى اختيار نوع المستخدم',
        life: 3500
      });
      return;
    }
    this.router.navigateByUrl('/layout');

    this.showDialog();

    this.authService.login(user).subscribe({
      next: (response: any) => {
        this.hideDialog();

        if (response?.token) {
          if (user.userType === 'ADMIN') {
            this.authService.router.navigateByUrl('admin');
          } else {
            this.authService.router.navigateByUrl('school');
            this.messageService.add({
              severity: 'success',
              summary: 'تم تسجيل الدخول',
              detail: `مرحبا بك : ${response.managerName ?? ''}`,
              life: 4000
            });
          }
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'استجابة غير متوقعة من الخادم',
            life: 4000
          });
        }
      },
      error: () => {
        this.hideDialog();
        this.messageService.add({
          severity: 'error',
          summary: 'فشل',
          detail: 'فشل تسجيل الدخول',
          life: 4000
        });
      }
    });
  }

  openRegisterDialog(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'معلومة',
      detail: 'فتح نافذة التسجيل',
      life: 3000
    });
  }
}
