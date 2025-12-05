# AzzurraMakeupDeploy

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.20.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Dev mode (Angular "classico")
npm run start

Dev mode con SSR (consigliato visto che hai Universal); # dev con SSR e collegato al backend
npm run start:ssr:dev

# Per ambiente produzione (build + test locale)
npm run start:ssr:prod
# Comando corretto per usare il backend locale, compila il frontend SSR, avvia Node SSR con: BACKEND_URL=http://localhost:8080 , cioè il backend locale, comunica correttamente tramite environment.ts sostituito in runtime
npm run start:ssr:dev

# Frontend con hot-reload, immediato
npm start



ng extract-i18n --output-path src/locale


# Esegui in locale Frontend (SSR Angular)
npm run dev:ssr

npm install html2canvas jspdf

npm install qrcode


ng g module pages/biglietto-visita --routing
ng g component pages/biglietto-visita
ng g service services/biglietto-visita


ng g module pages/logo --routing
ng g component pages/logo


ng g service services/logo














<div class="logo-page-wrapper">
  <div #logoWrapper class="logo-circle double-luxury">

    <svg #logoSvg class="logo-brush-svg" viewBox="0 0 260 260" aria-hidden="true">

      <defs>
        <!-- Brush handle gradient -->
        <linearGradient id="brushHandleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c27a45" />
          <stop offset="45%" stop-color="#a55c2b" />
          <stop offset="100%" stop-color="#8a4621" />
        </linearGradient>

        <!-- Brush highlight -->
        <linearGradient id="brushHandleHighlight" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="rgba(255,255,255,0)" />
          <stop offset="40%" stop-color="rgba(255,255,255,0.4)" />
          <stop offset="100%" stop-color="rgba(255,255,255,0)" />
        </linearGradient>

        <!-- Ferrule -->
        <linearGradient id="ferruleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f7e7a6" />
          <stop offset="45%" stop-color="#d8b86c" />
          <stop offset="100%" stop-color="#b8924a" />
        </linearGradient>

        <!-- Lipstick metal -->
        <linearGradient id="lipstickMetalGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f6e9b8" />
          <stop offset="45%" stop-color="#d1b46c" />
          <stop offset="100%" stop-color="#b18f4a" />
        </linearGradient>
      </defs>

      <!-- PENNELLO -->
      <g transform="translate(15, -10) scale(1.25) rotate(20 60 160)">
        <rect x="35" y="60" width="34" height="145" rx="15" class="brush-handle" />
        <rect x="39" y="64" width="8" height="135" rx="4" class="brush-handle-highlight" />
        <rect x="32" y="40" width="44" height="28" rx="8" class="brush-ferrule" />

        <path class="brush-tip"
          d="M40 40
             L12 25
             Q40 0 90 1
             L105 5
             L79 40
             Z"
        />

        <path d="M40 40 L40 10" class="bristle-line" />
        <path d="M55 40 L55 1" class="bristle-line" />
        <path d="M70 40 L70 1" class="bristle-line" />
        <path d="M85 40 L85 1" class="bristle-line" />
        <!-- <path d="M100 40 L100 18" class="bristle-line" />
        <path d="M115 40 L115 22" class="bristle-line" />
        <path d="M130 40 L130 24" class="bristle-line" />
        <path d="M145 40 L145 28" class="bristle-line" /> -->
      </g>

      <!-- ROSSETTO -->
      <g transform="translate(170, 70) scale(0.8) rotate(-25 60 160)">
        <rect x="0" y="60" width="36" height="80" rx="10" class="lipstick-metal" />
        <rect x="-10" y="130" width="56" height="25" rx="10" class="lipstick-band" />
        <rect x="-5" y="150" width="50" height="50" rx="10" class="lipstick-metal" />

        <path class="lipstick-tip"
          d="M2 60
             L0 130
             Q0 0 32 4
             Q36 10 36 80
             L36 60
             Z"
        />
      </g>

    </svg>
  </div>
</div>

<div class="actions">
  <button mat-raised-button color="primary" (click)="downloadPNG()">Scarica PNG</button>
  <button mat-raised-button color="accent" (click)="downloadSVG()">Scarica SVG</button>
  <button mat-raised-button color="warn" (click)="downloadPDF()">Scarica PDF</button>
</div>

