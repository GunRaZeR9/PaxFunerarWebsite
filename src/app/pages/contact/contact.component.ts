import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SERVICE_MAP } from '../servicii-funerare/services.data';
import { SeoService } from '../../core/services/seo.service';
import { AnimationService } from '../../core/services/animation.service';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

@Component({
  selector: 'pax-contact',
  standalone: true,
  imports: [ReactiveFormsModule, RevealOnScrollDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly anim = inject(AnimationService);

  readonly submitted = signal(false);
  readonly sending = signal(false);

  readonly serviceOptions = Object.entries(SERVICE_MAP).map(([slug, name]) => ({ slug, name }));

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    service: [''],
    message: ['', [Validators.required, Validators.minLength(10)]],
    hp: [''], // honeypot
  });

  ngOnInit(): void {
    this.seo.setPage({
      title: 'Contact | Casa Funerară PAX Târgu Mureș',
      description:
        'Contactați Casa Funerară PAX Târgu Mureș. Suntem disponibili non-stop. ☎ 0745 547 530 | contact@paxfunerar.ro',
      canonical: 'https://paxfunerar.ro/contact',
    });

    const serviceSlug = this.route.snapshot.queryParamMap.get('service');
    if (serviceSlug && SERVICE_MAP[serviceSlug]) {
      this.form.patchValue({ service: serviceSlug });
    }

    this.anim.fadeUp('.page-hero-title');
  }

  submit(): void {
    if (this.form.invalid || this.form.value.hp) return;
    this.sending.set(true);
    // Placeholder — wire to backend / EmailJS in production
    setTimeout(() => {
      this.sending.set(false);
      this.submitted.set(true);
    }, 800);
  }
}
