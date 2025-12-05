
// src/app/services/logo.service.ts

import { Injectable, ElementRef } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class LogoService {

  /**
   * PNG TRASPARENTE PERFETTO — rasterizza direttamente lo SVG
   */
  async exportToPNG(svgElement: ElementRef, filename: string) {
    const originalSvg = svgElement.nativeElement as SVGSVGElement;

    // Clona l’SVG così da non alterare quello visibile
    const cloned = originalSvg.cloneNode(true) as SVGSVGElement;

    // Ottieni il bounding box REALE
    const bbox = originalSvg.getBBox();

    // Padding interno per sicurezza
    const pad = 40;

    // Imposta nuovo viewBox dinamico
    cloned.setAttribute(
      "viewBox",
      `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad * 2} ${bbox.height + pad * 2}`
    );

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(cloned);

    // Rasterizza come immagine
    const img = new Image();
    img.src = "data:image/svg+xml;base64," + btoa(svgString);

    await new Promise(res => img.onload = res);

    const scaleUp = 4;
    const canvas = document.createElement("canvas");

    canvas.width = (bbox.width + pad * 2) * scaleUp;
    canvas.height = (bbox.height + pad * 2) * scaleUp;

    const ctx = canvas.getContext("2d")!;
    ctx.setTransform(scaleUp, 0, 0, scaleUp, 0, 0);
    ctx.drawImage(img, 0, 0);

    const link = document.createElement("a");
    link.download = filename + ".png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }



  /**
   * SVG perfetto
   */
  exportToSVG(svgElement: ElementRef, filename: string) {
    const svg = svgElement.nativeElement as SVGSVGElement;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);

    const svgFile =
      '<?xml version="1.0" standalone="no"?>\r\n' + source;

    const blob = new Blob([svgFile], {
      type: 'image/svg+xml;charset=utf-8'
    });

    const link = document.createElement('a');
    link.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }



  /**
   * PDF pulito e centrato
   */
  async exportToPDF(svgElement: ElementRef, filename: string) {
    const svg = svgElement.nativeElement as SVGSVGElement;

    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svgString);

    await new Promise(resolve => img.onload = resolve);

    const pdf = new jsPDF('portrait', 'mm', 'a4');

    const maxWidth = 140; 
    const ratio = img.height / img.width;
    const height = maxWidth * ratio;

    const x = (210 - maxWidth) / 2;

    pdf.addImage(img, 'PNG', x, 40, maxWidth, height);
    pdf.save(filename + '.pdf');
  }
}

