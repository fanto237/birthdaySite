import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvitationService } from '../../services/invitation.service';

type Language = 'fr' | 'de';
type TranslationKey = keyof typeof TRANSLATIONS.fr;

const TRANSLATIONS = {
  fr: {
    pageTitle: 'Princesse & Super-Héros 👑🕷️',
    subtitle:
      '"À quoi sert un château de princesse s’il n’a pas de super-héros pour le protéger... ?" 🏰🛡️',
    mayraAge: 'Fête son 1er an !',
    mayraRole: "La royauté à l'état pur",
    lucaAge: 'Fête ses 4 ans !',
    lucaRole: 'Le protecteur de la ville',
    eventDate: '📅 Samedi 18 Avril 2026 à 15h00',
    countdownDays: 'Jours',
    countdownHours: 'Hrs',
    countdownMinutes: 'Min',
    countdownSeconds: 'Sec',
    rsvpCta: 'Réserver ma place (RSVP) 💌',
    practicalInfoTitle: 'Infos Pratiques 📍',
    partyLocationLabel: 'Lieu de la fête :',
    openMaps: '🗺️ Ouvrir Google Maps',
    dressCodeTitle: '🎭 Dress Code Fun :',
    dressCodeText:
      'Couronnes, capes ou vos plus beaux habits de fête ! Princesses et Héros sont attendus pour la photo officielle. 📸',
    missionProgramTitle: 'Programme de la Mission 🚀',
    timelineOpenTitle: 'Ouverture des Portes 🤝',
    timelineOpenText: 'Accueil des invités au château et au QG.',
    timelineKidsTitle: 'Spécial Enfants 🎈',
    timelineKidsText: "Jeux, rires et aventures. Note : le programme enfants s'achève à 19h00.",
    timelineBuffetTitle: 'Buffet Royal 🍲',
    timelineBuffetText: 'Rechargement des batteries pour tout le monde !',
    timelineDanceTitle: 'Ouverture du Bal 💃',
    timelineDanceText: "C'est ici que tout commence...",
    timelineEndTitle: 'Fin de la Mission 🌙',
    timelineEndText: 'Retour aux quartiers pour un repos bien mérité.',
    djokaTitle: "🔥 L'Heure du Djoka !",
    djokaText:
      "À partir de 19h00, on passe aux choses sérieuses. Pour nos amis qui découvrent, le Djoka c'est l'ambiance camerounaise où l'on \"jette les bagages\" ! On danse, on célèbre et on profite à fond ! 🇨🇲✨",
    rsvpTitle: 'Serez-vous des nôtres ? ✅',
    nameLabel: 'Votre Nom / Famille ✍️',
    namePlaceholder: 'Ex: Famille Fokou',
    adultsLabel: "Nombre d'adultes 👨‍👩‍👧‍👦",
    childrenLabel: "Nombre d'enfants 🧒",
    noteLabel: 'Un petit mot pour Mayra & Luca ? 💬',
    submitIdle: 'Confirmer ma présence ✅',
    submitLoading: 'Envoi en cours...',
    requiredFieldsError: 'Veuillez remplir tous les champs requis.',
    successMessage: '🎉 Merci ! Votre réponse a été transmise. À très vite !',
    genericError: 'Une erreur est survenue. Veuillez réessayer.',
    footer: 'Mayra Paulina (1 an) & Luca Augustin (4 ans) • 2026',
  },
  de: {
    pageTitle: 'Prinzessin & Superhelden 👑🕷️',
    subtitle:
      '"Wozu dient ein Prinzessinnenschloss, wenn es keine Superhelden gibt, die es beschützen...?" 🏰🛡️',
    mayraAge: 'Feiert ihren 1. Geburtstag!',
    mayraRole: 'Königlichkeit in reinster Form',
    lucaAge: 'Feiert seinen 4. Geburtstag!',
    lucaRole: 'Der Beschützer der Stadt',
    eventDate: '📅 Samstag, 18. April 2026 um 15:00 Uhr',
    countdownDays: 'Tage',
    countdownHours: 'Std',
    countdownMinutes: 'Min',
    countdownSeconds: 'Sek',
    rsvpCta: 'Meinen Platz reservieren (RSVP) 💌',
    practicalInfoTitle: 'Praktische Infos 📍',
    partyLocationLabel: 'Ort der Feier:',
    openMaps: '🗺️ In Google Maps öffnen',
    dressCodeTitle: '🎭 Spaß-Dresscode :',
    dressCodeText:
      'Kronen, Umhänge oder eure schönsten Festoutfits! Prinzessinnen und Helden werden für das offizielle Foto erwartet. 📸',
    missionProgramTitle: 'Missionsprogramm 🚀',
    timelineOpenTitle: 'Türöffnung 🤝',
    timelineOpenText: 'Empfang der Gäste im Schloss und im Hauptquartier.',
    timelineKidsTitle: 'Kinder-Spezial 🎈',
    timelineKidsText:
      'Spiele, Lachen und Abenteuer. Hinweis: Das Kinderprogramm endet um 19:00 Uhr.',
    timelineBuffetTitle: 'Königliches Buffet 🍲',
    timelineBuffetText: 'Energie auftanken für alle!',
    timelineDanceTitle: 'Eröffnung des Balls 💃',
    timelineDanceText: 'Hier beginnt alles...',
    timelineEndTitle: 'Ende der Mission 🌙',
    timelineEndText: 'Rückkehr ins Quartier für eine wohlverdiente Pause.',
    djokaTitle: '🔥 Djoka-Zeit!',
    djokaText:
      'Ab 19:00 Uhr wird es richtig ernst. Für unsere Freunde, die es entdecken: Djoka ist die kamerunische Stimmung, bei der man richtig feiert! Wir tanzen, feiern und genießen in vollen Zügen! 🇨🇲✨',
    rsvpTitle: 'Seid ihr dabei? ✅',
    nameLabel: 'Ihr Name / Familie ✍️',
    namePlaceholder: 'Z. B. Familie Fokou',
    adultsLabel: 'Anzahl Erwachsene 👨‍👩‍👧‍👦',
    childrenLabel: 'Anzahl Kinder 🧒',
    noteLabel: 'Eine kleine Nachricht für Mayra & Luca? 💬',
    submitIdle: 'Meine Teilnahme bestätigen ✅',
    submitLoading: 'Wird gesendet...',
    requiredFieldsError: 'Bitte füllen Sie alle Pflichtfelder aus.',
    successMessage: '🎉 Danke! Eure Antwort wurde übermittelt. Bis ganz bald!',
    genericError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    footer: 'Mayra Paulina (1 Jahr) & Luca Augustin (4 Jahre) • 2026',
  },
} as const;

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit {
  private readonly fb = inject(FormBuilder);
  private readonly invitationService = inject(InvitationService);

  @ViewChild('confettiCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);
  readonly currentLanguage = signal<Language>('fr');

  currentDay = signal(0);
  currentHour = signal(0);
  currentMinute = signal(0);
  currentSecond = signal(0);

  rsvpForm!: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor() {
    this.restoreLanguagePreference();
    this.initializeForm();
    this.updateTimer();

    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => this.updateTimer(), 1000);
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeConfetti();
    }
  }

  private restoreLanguagePreference(): void {
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

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('selectedLanguage', language);
      document.documentElement.lang = language;
    }
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[this.currentLanguage()][key];
  }

  private initializeForm(): void {
    this.rsvpForm = this.fb.group({
      nom: ['', [Validators.required]],
      adultes: [1, [Validators.required, Validators.min(1)]],
      enfants: [0, [Validators.required, Validators.min(0)]],
      message: [''],
    });
  }

  updateTimer = () => {
    const target = new Date('April 18, 2026 15:00:00').getTime();
    const now = new Date().getTime();
    const diff = target - now;

    this.currentDay.set(Math.floor(diff / 86400000));
    this.currentHour.set(Math.floor((diff % 86400000) / 3600000));
    this.currentMinute.set(Math.floor((diff % 3600000) / 60000));
    this.currentSecond.set(Math.floor((diff % 60000) / 1000));
  };

  private initializeConfetti(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }
    const ctx = context;

    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 5 + 2;
        this.speedY = Math.random() * 1.2 + 0.5;
        this.color = ['#f8bbd0', '#d4af37', '#e62429', '#003366'][Math.floor(Math.random() * 4)];
      }

      update(): void {
        this.y += this.speedY;
        if (this.y > canvas.height) {
          this.y = -10;
        }
      }

      draw(): void {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 40; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    };

    animate();
  }

  onSubmitRSVP(): void {
    if (this.rsvpForm.invalid) {
      this.errorMessage.set(this.t('requiredFieldsError'));
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValues = this.rsvpForm.value;

    const invitationRequest = {
      name: formValues.nom,
      adultsNumber: formValues.adultes,
      childrensNumber: formValues.enfants,
      note: formValues.message,
    };

    this.invitationService.createInvitation(invitationRequest).subscribe({
      next: () => {
        this.successMessage.set(this.t('successMessage'));
        this.rsvpForm.reset({ adultes: 1, enfants: 0 });
        this.isSubmitting.set(false);
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (err: unknown) => {
        const invitationError = err as { error?: { result?: string } };
        const errorMsg = invitationError.error?.result || this.t('genericError');
        this.errorMessage.set(errorMsg);
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    });
  }
}
