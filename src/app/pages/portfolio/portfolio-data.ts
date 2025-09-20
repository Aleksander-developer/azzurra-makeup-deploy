// src/app/pages/portfolio/portfolio-data.ts
/* i18n con $localize consentito nei valori; niente backend. */


export interface Album {
id: string; // slug univoco usato in rotta /portfolio/:id
title: string; // può usare $localize
description?: string; // può usare $localize
cover: string; // URL Cloudinary cover
photos: string[]; // URL Cloudinary gallery
}


export const ALBUMS: Album[] = [
// {
// id: 'wedding-2025',
// title: $localize`:@@album.wedding2025:Matrimonio 2025`,
// description: $localize`:@@album.wedding2025.desc:Un look elegante e luminoso per la sposa.`,
// cover: 'https://res.cloudinary.com/.../cover.jpg',
// photos: [
// 'https://res.cloudinary.com/.../photo1.jpg',
// 'https://res.cloudinary.com/.../photo2.jpg',
// 'https://res.cloudinary.com/.../photo3.jpg'
// ]
// },
// {
// id: 'fashion-2024',
// title: $localize`:@@album.fashion2024:Servizio fotografico moda 2024`,
// cover: 'https://res.cloudinary.com/.../cover-fashion.jpg',
// photos: [
// 'https://res.cloudinary.com/.../fashion1.jpg',
// 'https://res.cloudinary.com/.../fashion2.jpg'
// ]
// }
];

