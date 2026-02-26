import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

type Language = 'fr' | 'de';
type TranslationKey = keyof typeof TRANSLATIONS.fr;

const TRANSLATIONS = {
  fr: {
    title: 'Invitation privée',
    subtitle: "Entrez votre code d'accès pour continuer.",
    codeLabel: "Code d'accès",
    submitIdle: 'Entrer',
    submitLoading: 'Vérification...',
    revealCode: 'Afficher',
    hideCode: 'Masquer',
    invalidCode: 'Code invalide. Veuillez réessayer.',
  },
  de: {
    title: 'Private Einladung',
    subtitle: 'Bitte gib deinen Zugangscode ein, um fortzufahren.',
    codeLabel: 'Zugangscode',
    submitIdle: 'Eintreten',
    submitLoading: 'Prüfung...',
    revealCode: 'Anzeigen',
    hideCode: 'Verbergen',
    invalidCode: 'Ungültiger Code. Bitte versuche es erneut.',
  },
} as const;

@Component({
  selector: 'app-access',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './access.html',
  styleUrl: './access.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly revealCode = signal(false);
  readonly currentLanguage = signal<Language>('fr');
  readonly form = this.formBuilder.group({
    code: ['', [Validators.required]],
  });

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const storedLanguage = localStorage.getItem('selectedLanguage');
    if (storedLanguage === 'fr' || storedLanguage === 'de') {
      this.currentLanguage.set(storedLanguage);
      document.documentElement.lang = storedLanguage;
    }
  }

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem('selectedLanguage', language);
    document.documentElement.lang = language;
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[this.currentLanguage()][key];
  }

  toggleCodeVisibility(): void {
    this.revealCode.update((value) => !value);
  }

  requestObserver = {
    next: (response: ResponseType) => {
      if (response.valid) {
        localStorage.setItem('birthday-site-access-granted', 'true');
        this.router.navigateByUrl('/home');
        return;
      }
      this.isSubmitting.set(false);
    },
    error: () => {
      this.errorMessage.set(this.t('invalidCode'));
      this.isSubmitting.set(false);
    },
    complete: () => {
      this.isSubmitting.set(false);
    },
  };

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    const code = this.form.getRawValue().code ?? '';
    this.isSubmitting.set(true);
    this.errorMessage.set('');

    // http request
    this.http
      .post<{ valid: boolean; message?: string }>('/validate-access-code', { code })
      .subscribe(this.requestObserver);
  }
}

type ResponseType = {
  valid: boolean;
  message?: string | undefined;
};
