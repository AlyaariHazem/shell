// errors.service.ts
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({ providedIn: 'root' })
export class ErrorsService {
  public messages: MessageService;

  constructor(messages: MessageService) {
    this.messages = messages;
  }

  // أسماء عرض لطيفة
  private readonly fieldLabel: Record<string, string> = {
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    password_confirm: 'تأكيد كلمة المرور',
    first_name: 'الاسم الأول',
    last_name: 'الاسم الأخير',
    phone: 'رقم الهاتف',
    username: 'البريد الإلكتروني',
  };

  error(
    err: any,
    opts: { join?: boolean; maxToasts?: number; title?: string; key?: string; life?: number } = {}
  ): void {
    const {
      join = false,
      maxToasts = 6,
      title = 'حدثت أخطاء',
      key = 'global',     // you can render multiple <p-toast> with different keys if needed
      life = 9000
    } = opts;

    // أخطاء الشبكة
    if (err?.status === 0) {
      this.messages.clear(key);
      this.messages.add({ key, severity: 'error', summary: 'خطأ شبكة', detail: 'تعذّر الاتصال بالخادم. تأكد من اتصال الإنترنت ثم أعد المحاولة.', life });
      return;
    }

    const messages = this.extractMessages(err);

    if (messages.length === 0) {
      this.messages.clear(key);
      this.messages.add({ key, severity: 'error', summary: 'فشل الطلب', detail: 'يرجى المحاولة لاحقًا.', life });
      return;
    }

    // اختياري: امسح السابق لمنع التكدّس
    this.messages.clear(key);

    if (join) {
      // Toast واحد مع أسطر متعددة
      this.messages.add({
        key,
        severity: 'error',
        summary: title,
        detail: messages.join('<br/>'),
        life,
        sticky: false
      });
    } else {
      // عدة Toasts
      messages.slice(0, maxToasts).forEach(m => {
        this.messages.add({ key, severity: 'error', summary: 'خطأ', detail: m, life });
      });
      const remaining = messages.length - maxToasts;
      if (remaining > 0) {
        this.messages.add({ key, severity: 'warn', summary: 'مزيد', detail: `و${remaining} رسالة أخرى…`, life });
      }
    }
  }

  private extractMessages(err: any): string[] {
    const src = err?.error?.data ?? err?.error?.errors ?? err?.error ?? err;

    const map: Record<string, string[]> = {};
    const push = (k: string, v: any) => {
      if (v == null) return;
      const arr = Array.isArray(v) ? v : [v];
      arr.forEach(x => {
        const s = String(x ?? '').trim();
        if (s) (map[k] ||= []).push(s);
      });
    };

    const consume = (obj: any) => {
      for (const k of Object.keys(obj)) {
        const v = obj[k];
        if (['detail', 'message', 'non_field_errors', '_error'].includes(k)) {
          push('_error', v);
        } else if (v && typeof v === 'object' && !Array.isArray(v)) {
          consume(v);
        } else {
          push(k, v);
        }
      }
    };

    if (typeof src === 'string') push('_error', src);
    else if (Array.isArray(src)) src.forEach(x => push('_error', x));
    else if (src && typeof src === 'object') consume(src);
    else push('_error', 'حدث خطأ غير متوقع.');

    const aliases: Record<string, string> = {
      password2: 'password_confirm',
      confirm_password: 'password_confirm',
      username: 'email',
    };
    for (const [from, to] of Object.entries(aliases)) {
      if (map[from]) {
        map[to] = (map[to] || []).concat(map[from]);
        delete map[from];
      }
    }

    const msgs: string[] = [];
    for (const [k, arr] of Object.entries(map)) {
      const unique = Array.from(new Set(arr));
      if (k === '_error') {
        msgs.push(...unique);
      } else {
        const label = this.fieldLabel[k] ?? k;
        unique.forEach(m => msgs.push(`${label}: ${m}`));
      }
    }
    return Array.from(new Set(msgs));
  }
}
