
// src/app/pages/logo/logo.component.ts

import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { LogoService } from '../../services/logo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements AfterViewInit {

  @ViewChild('logoWrapper', { static: false }) logoWrapper!: ElementRef;
  @ViewChild('logoSvg', { static: false }) logoSvg!: ElementRef;

  showButtons = false;

  constructor(private logoService: LogoService, private router: Router) {}

  ngOnInit() {
    this.showButtons = this.router.url === '/logo';
  }

  ngAfterViewInit() {
    setTimeout(() => {
      console.log("logoWrapper:", this.logoWrapper?.nativeElement);
      console.log("logoSvg:", this.logoSvg?.nativeElement);
    }, 0);
  }

  downloadPNG() {
    if (!this.logoSvg) {
      console.error("❌ logoSvg undefined (DOM non pronto)");
      return;
    }
    this.logoService.exportToPNG(this.logoSvg, 'logo-azzurra');
  }

  downloadSVG() {
    if (!this.logoSvg) {
      console.error("❌ logoSvg undefined");
      return;
    }
    this.logoService.exportToSVG(this.logoSvg, 'logo-azzurra');
  }

  downloadPDF() {
    if (!this.logoSvg) {
      console.error("❌ logoSvg undefined");
      return;
    }
    this.logoService.exportToPDF(this.logoSvg, 'logo-azzurra');
  }
}

