import dotenv from 'dotenv';
import FigmaVariablesFetcher from './FigmaVariablesFetcher.js';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

// Exemple d'utilisation
async function main() {
  // Récupérer les valeurs depuis les variables d'environnement
  const accessToken = process.env.FIGMA_ACCESS_TOKEN;
  const fileKey = process.env.FIGMA_FILE_KEY;

  // Vérifier que les variables sont définies
  if (!accessToken || accessToken === 'VOTRE_TOKEN_FIGMA') {
    console.error('❌ Erreur: FIGMA_ACCESS_TOKEN n\'est pas défini dans le fichier .env');
    console.error('   Veuillez créer un fichier .env et définir votre token Figma.');
    process.exit(1);
  }

  if (!fileKey || fileKey === 'VOTRE_FILE_KEY') {
    console.error('❌ Erreur: FIGMA_FILE_KEY n\'est pas défini dans le fichier .env');
    console.error('   Veuillez créer un fichier .env et définir votre clé de fichier Figma.');
    process.exit(1);
  }
  
  // Créer une instance de la classe
  const fetcher = new FigmaVariablesFetcher(accessToken, fileKey);
  
  try {
    // Option 1: Récupérer et sauvegarder en une seule étape
    await fetcher.fetchAndSave();
    
    // Option 2: Récupérer et sauvegarder avec un chemin personnalisé
    // await fetcher.fetchAndSave('./output/variables.json');
    
    // Option 3: Récupérer les données sans les sauvegarder
    // const data = await fetcher.fetchVariables();
    // console.log(data);
    
  } catch (error) {
    console.error('Erreur:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
main();
