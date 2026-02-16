import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  PLATFORM_ID,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InvitationService } from './services/invitation.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements AfterViewInit {
  protected readonly title = signal('web');
  @ViewChild('confettiCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);

  currentDay = signal(0);
  currentHour = signal(0);
  currentMinute = signal(0);
  currentSecond = signal(0);

  rsvpForm!: FormGroup;
  isSubmitting = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  constructor(
    private fb: FormBuilder,
    private invitationService: InvitationService,
  ) {
    this.initializeForm();
    this.updateTimer();

    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => this.updateTimer(), 1000);
    }
  }

  private initializeForm(): void {
    this.rsvpForm = this.fb.group({
      nom: ['', [Validators.required]],
      adultes: [1, [Validators.required, Validators.min(1)]],
      enfants: [0, [Validators.required, Validators.min(0)]],
      message: [''],
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeConfetti();
    }
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
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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
        if (this.y > canvas.height) this.y = -10;
      }

      draw(): void {
        if (ctx) {
          ctx.fillStyle = this.color;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    for (let i = 0; i < 40; i++) particles.push(new Particle());

    const animate = () => {
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
      }
      requestAnimationFrame(animate);
    };

    animate();
  }

  onSubmitRSVP(): void {
    if (this.rsvpForm.invalid) {
      this.errorMessage.set('Veuillez remplir tous les champs requis.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValues = this.rsvpForm.value;

    // Map form fields to backend DTO
    const invitationRequest = {
      name: formValues.nom,
      adultsNumber: formValues.adultes,
      childrensNumber: formValues.enfants,
      note: formValues.message,
    };

    this.invitationService.createInvitation(invitationRequest).subscribe({
      next: () => {
        this.successMessage.set('🎉 Merci ! Votre réponse a été transmise. À très vite !');
        this.rsvpForm.reset({ adultes: 1, enfants: 0 });
        this.isSubmitting.set(false);

        // Auto-hide success message after 5 seconds
        setTimeout(() => this.successMessage.set(''), 5000);
      },
      error: (err: any) => {
        console.error('RSVP submission error:', err);
        const errorMsg = err?.error?.result || 'Une erreur est survenue. Veuillez réessayer.';
        this.errorMessage.set(errorMsg);
        this.isSubmitting.set(false);
      },
    });
  }
}
