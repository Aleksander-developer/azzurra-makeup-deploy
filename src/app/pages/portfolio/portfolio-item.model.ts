// src/app/pages/portfolio/portfolio-item.model.ts

export interface PortfolioImage {
  src: string;
  description?: string;
  alt?: string;
  isNew?: boolean; // Usato dal frontend per gestire i file
  file?: File;
}

export interface PortfolioItem {
  _id?: string;
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  images: PortfolioImage[];
  coverImageUrl?: string; // Calcolata dinamicamente nel frontend
  createdAt?: Date;
  updatedAt?: Date;
}

