import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* PrimeNG UI */
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { Router } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ErrorsService } from 'app/shared/services/errors.service';
import { Role } from '@app/types';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { AuthAPIService } from '../auth-api.service';

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
    DialogModule,
    SharedModule,
    ProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [Document] // <-- provide MessageService here (or globally)
})
export class LoginComponent {
   constructor(
    private router: Router,
    private http: HttpClient,
    private auth: AuthService,
    private authAPIService: AuthAPIService
  ) {}

  // Let the user explicitly select one of these:
  user: boolean = false;   // jobseeker
  admin: boolean = false;  // employer

  errors = inject(ErrorsService);

  phone: string = '';
  password: string = '';

  ngOnInit(): void {
    // If token already exists, skip login
    if (this.auth.isLoggedIn()) {
      const role = this.auth.role ?? 'jobseeker';
      this.router.navigateByUrl(role === 'employer' ? '/companies' : '/jobseeker');
    }
  }

  // Optional: stricter 9-digit check (or use /^7\d{8}$/ if needed)
  isInvalidPhone(): boolean {
    if (!this.phone) return false;
    const phoneRegex = /^[0-9]{9}$/;
    return !phoneRegex.test(this.phone);
  }

  private selectedRole(): Role | null {
    if (this.user && !this.admin) return 'jobseeker';
    if (this.admin && !this.user) return 'employer';
    return null; // none or both selected
  }

  private mapBackendRole(user_type: string | undefined | null): Role | null {
    // Adjust mapping if your backend uses different strings
    // e.g., 'job_seeker' | 'employer'
    if (!user_type) return null;
    const norm = String(user_type).toLowerCase();
    if (norm === 'job_seeker' || norm === 'jobseeker') return 'jobseeker';
    if (norm === 'employer' || norm === 'company' || norm === 'recruiter') return 'employer';
    return null;
  }

  login(): void {
    
    // 1) Must choose a role
    const chosen = this.selectedRole();
    if (!chosen) {
      this.errors.error('الرجاء اختيار نوع الحساب (باحث عن عمل أو صاحب عمل) قبل تسجيل الدخول.');
      return;
    }

    // 2) Validate inputs
    if (this.isInvalidPhone()) {
      this.errors.error('رقم الهاتف يجب أن يتكون من 9 أرقام فقط');
      return;
    }
    if (!this.password?.trim()) {
      this.errors.error('الرجاء إدخال كلمة المرور');
      return;
    }

    // 3) Attempt login
    const payload = { phone: this.phone, password: this.password };

    this.http.post(environment.getUrl('login'), payload).subscribe({
  next: (res: any) => {
    const access = res?.data?.token as string | undefined;
    const refresh = res?.refresh as string | undefined;
    if (!access) { this.errors.error('لا يوجد رمز دخول'); return; }

    this.auth.setTokens(access, refresh);
    console.log('token set, fetching profile…');

    this.getProfile().subscribe({
      next: (data: any) => {
        const backendType = data?.data?.user?.user_type as string | undefined;
        const backendRole = this.mapBackendRole(backendType);

        if (!backendRole) { this.errors.error('نوع الحساب غير معروف'); this.authAPIService.logout(); return; }

        if (backendRole !== chosen) {
          this.errors.error('نوع الحساب المختار لا يطابق حسابك'); 
          this.authAPIService.logout(); 
          return;
        }

        this.auth.setRole(backendRole);
        this.router.navigateByUrl(backendRole === 'employer' ? '/companies' : '/jobseeker');
      },
      error: (err) => {
        console.error('profile error', err);
        this.errors.error(err, { join: true });
        this.authAPIService.logout();
      },
    });
  },
  error: (err) => { console.error('login error', err); this.errors.error(err, { join: true }); },
});

  }

  getProfile(): Observable<any> {
    // Adjust second argument if your environment.getUrl accepts a namespace
    // In your snippet: environment.getUrl('profile', 'accounts')
    return this.http.get(environment.getUrl('profile', 'accounts'));
  }

  loginWithLinkedIn() {
    this.errors.messages.add({ severity: 'info', summary: 'تسجيل الدخول عبر LinkedIn قيد التطوير' });
  }

  loginWithGoogle() {
    this.errors.messages.add({ severity: 'info', summary: 'تسجيل الدخول عبر Google قيد التطوير' });
  }

  selectType(type: 'jobseeker' | 'employer') {
    this.user = type === 'jobseeker';
    this.admin = type === 'employer';
  }
}
