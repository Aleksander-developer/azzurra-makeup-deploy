
import {
  Component,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import QRCode from 'qrcode';

@Component({
  selector: 'app-biglietto-visita',
  templateUrl: './biglietto-visita.component.html',
  styleUrls: ['./biglietto-visita.component.scss'],
})
export class BigliettoVisitaComponent implements AfterViewInit {
  @ViewChild('fronte', { static: false }) fronteRef!: ElementRef;
  @ViewChild('retro', { static: false }) retroRef!: ElementRef;
  @ViewChild('qrWebsite', { static: false })
  qrWebsiteRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('qrInstagram', { static: false })
  qrInstagramRef!: ElementRef<HTMLCanvasElement>;

  readonly instagramUrl =
    'https://www.instagram.com/azzurra_angiusmua?igsh=MWRxbWZid3NyeWVmbA%3D%3D&utm_source=qr';
  readonly websiteUrl = 'https://azzurraangius.it/it/home';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const size = 60;

      await QRCode.toCanvas(this.qrWebsiteRef.nativeElement, this.websiteUrl, {
        width: size,
        margin: 1,
        color: { dark: '#8A0030', light: '#ffffff' },
      });

      await QRCode.toCanvas(
        this.qrInstagramRef.nativeElement,
        this.instagramUrl,
        {
          width: size,
          margin: 1,
          color: { dark: '#8A0030', light: '#ffffff' },
        }
      );
    } catch (err) {
      console.error('Errore generazione QR:', err);
    }
  }

  private async getHtml2Canvas() {
    if (!isPlatformBrowser(this.platformId)) return null;
    const mod = await import('html2canvas');
    return mod.default;
  }

  async downloadAsPNG() {
    const html2canvas = await this.getHtml2Canvas();
    if (!html2canvas) return;

    const fronteCanvas = await html2canvas(this.fronteRef.nativeElement, {
      scale: 3,
    });
    const retroCanvas = await html2canvas(this.retroRef.nativeElement, {
      scale: 3,
    });

    this.saveCanvas(fronteCanvas, 'biglietto-fronte.png', 'image/png');
    this.saveCanvas(retroCanvas, 'biglietto-retro.png', 'image/png');
  }

  async downloadAsJPEG() {
    const html2canvas = await this.getHtml2Canvas();
    if (!html2canvas) return;

    const fronteCanvas = await html2canvas(this.fronteRef.nativeElement, {
      scale: 3,
    });
    const retroCanvas = await html2canvas(this.retroRef.nativeElement, {
      scale: 3,
    });

    this.saveCanvas(fronteCanvas, 'biglietto-fronte.jpg', 'image/jpeg');
    this.saveCanvas(retroCanvas, 'biglietto-retro.jpg', 'image/jpeg');
  }

  async downloadAsSVG() {
    const fronteHTML = this.wrapAsSVG(
      this.fronteRef.nativeElement.outerHTML,
      85 * 3.78,
      55 * 3.78
    );
    const retroHTML = this.wrapAsSVG(
      this.retroRef.nativeElement.outerHTML,
      85 * 3.78,
      55 * 3.78
    );

    this.downloadTextAsFile(fronteHTML, 'biglietto-fronte.svg', 'image/svg+xml');
    this.downloadTextAsFile(retroHTML, 'biglietto-retro.svg', 'image/svg+xml');
  }

  private saveCanvas(
    canvas: HTMLCanvasElement,
    filename: string,
    type: string
  ) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL(type);
    link.click();
  }

  private wrapAsSVG(innerHTML: string, width: number, height: number): string {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">${innerHTML}</div>
        </foreignObject>
      </svg>
    `;
  }

  private downloadTextAsFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }
}

