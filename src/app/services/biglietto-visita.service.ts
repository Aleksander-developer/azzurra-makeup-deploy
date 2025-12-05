// src/app/services/biglietto-visita.service.ts

import { Injectable, ElementRef } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class BigliettoVisitaService {
  async exportToPNG(element: ElementRef, filename: string) {
    const canvas = await html2canvas(element.nativeElement);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  async exportToPDF(elements: ElementRef[], filename: string) {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    for (let i = 0; i < elements.length; i++) {
      const canvas = await html2canvas(elements[i].nativeElement);
      const img = canvas.toDataURL('image/png');
      if (i > 0) pdf.addPage();
      pdf.addImage(img, 'PNG', 10, 10, 270, 180);
    }
    pdf.save(filename);
  }
}

