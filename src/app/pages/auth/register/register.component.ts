import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { DropdownModule } from 'primeng/dropdown';

import { ErrorsService } from 'app/shared/services/errors.service';
import { SharedModule } from 'app/shared/shared.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, DropdownModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
   user = true;      // job seeker default
  admin = false;    // employer
  errors = inject(ErrorsService);
  // Bind to template
  model = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirm: '',
  };

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {}


  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = !this.user;
  }

  register(f: NgForm) {
    // username: usually email (or generate one). Using email keeps it simple.
    if (f.invalid) {
      // علّم جميع الحقول كـ touched ليظهر التنبيه فورًا
      Object.values(f.controls).forEach(ctrl => {
        ctrl.markAsTouched();
        ctrl.updateValueAndValidity();
      });
      // رسالة عامة
      this.errors.messages.add({ severity: 'error', summary: 'خطأ', detail: 'فضلاً صحّح الأخطاء ثم أعد المحاولة' });
      return;
    }

    // تحقّق إضافي للهاتف (احتياطًا)
    if (!/^7[0-9]{8}$/.test(this.model.phone)) {
      this.errors.messages.add({ severity: 'error', summary: 'خطأ', detail: 'رقم الهاتف يجب أن يبدأ بـ 7 ويتكون من 9 أرقام' });
      return;
    }
    const payload = {
      username: this.model.email,
      email: this.model.email,
      first_name: this.model.first_name,
      last_name: this.model.last_name,
      password: this.model.password,
      password_confirm: this.model.password_confirm,
      user_type: this.user ? 'job_seeker' : 'employer', // adjust if your API expects a different value
      phone: this.model.phone
    };

    if (payload.password !== payload.password_confirm) {
      this.errors.messages.add({ severity: 'error', summary: 'خطأ', detail: 'تأكيد كلمة المرور غير مطابق' });
      return;
    }

    this.http.post(environment.getUrl('register', 'accounts'), payload).subscribe({
      next: (res: any) => {
        this.errors.messages.add({ severity: 'success', summary: 'تم التسجيل بنجاح', detail: 'يمكنك الآن تسجيل الدخول.' });
        // Option A: send user to login
        if(this.user){
          this.router.navigateByUrl('/jobseeker');
        } else {
          this.router.navigateByUrl('/companies');
        }
        // Option B: if API returns tokens, you can store and redirect directly:
        // localStorage.setItem('access', res.access); ...
      },
      error: (err) => {
        this.errors.error(err, { join: true })
      }
    });
  }
  isInvalidPhone(): boolean {
  const phoneRegex = /^7[0-9]{8}$/;
  return !phoneRegex.test(this.model.phone);
}
}
