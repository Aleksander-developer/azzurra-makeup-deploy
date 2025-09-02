// src/environments/environment.prod.ts

export const environment = {
  production: true,
  apiUrl: '/b-api/api' // <-- niente URL assoluto, solo il prefisso gestito dal proxy
  // apiUrl: 'https://azzurra-makeup-deploy-1046780610179.europe-west1.run.app/b-api', // centralizzato tutto dietro il proxy
  // apiUrl: 'https://azzurra-makeup-be-1046780610179.europe-west1.run.app/api', // NON diretto al BE
  // apiUrl: 'http://localhost:8080/api', // solo per test locale.
};
