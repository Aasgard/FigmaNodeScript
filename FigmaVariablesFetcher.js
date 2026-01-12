import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

/**
 * Classe pour récupérer les variables locales de Figma via l'API
 */
class FigmaVariablesFetcher {
  /**
   * @param {string} accessToken - Token d'accès Figma
   * @param {string} fileKey - Clé du fichier Figma
   */
  constructor(accessToken, fileKey) {
    this.accessToken = accessToken;
    this.fileKey = fileKey;
    this.baseURL = 'https://api.figma.com/v1';
  }

  /**
   * Récupère les variables locales d'un fichier Figma
   * @returns {Promise<Object>} Les données des variables
   */
  async fetchVariables() {
    try {
      const url = `${this.baseURL}/files/${this.fileKey}/variables/local`;
      
      console.log(url);
      const response = await axios.get(url, {
        headers: {
          'X-Figma-Token': this.accessToken
        }
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Erreur API Figma: ${error.response.status} - ${error.response.statusText}\n` +
          `Message: ${JSON.stringify(error.response.data)}`
        );
      } else if (error.request) {
        throw new Error('Aucune réponse de l\'API Figma. Vérifiez votre connexion.');
      } else {
        throw new Error(`Erreur lors de la requête: ${error.message}`);
      }
    }
  }

  /**
   * Écrit les données dans un fichier JSON
   * @param {Object} data - Les données à écrire
   * @param {string} outputPath - Chemin du fichier de sortie (optionnel)
   * @returns {Promise<string>} Le chemin du fichier créé
   */
  async writeToFile(data, outputPath = null) {
    try {
      // Si aucun chemin n'est fourni, utiliser le nom de fichier fixe
      if (!outputPath) {
        outputPath = path.join(process.cwd(), 'figma-variables.json');
      }

      // Supprimer le fichier existant s'il existe
      try {
        await fs.unlink(outputPath);
      } catch (error) {
        // Ignorer l'erreur si le fichier n'existe pas
        if (error.code !== 'ENOENT') {
          throw error;
        }
      }

      // S'assurer que le répertoire existe
      const dir = path.dirname(outputPath);
      await fs.mkdir(dir, { recursive: true });

      // Écrire le fichier JSON avec indentation
      await fs.writeFile(
        outputPath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );

      return outputPath;
    } catch (error) {
      throw new Error(`Erreur lors de l'écriture du fichier: ${error.message}`);
    }
  }

  /**
   * Récupère les variables et les écrit dans un fichier JSON
   * @param {string} outputPath - Chemin du fichier de sortie (optionnel)
   * @returns {Promise<string>} Le chemin du fichier créé
   */
  async fetchAndSave(outputPath = null) {
    try {
      console.log(`Récupération des variables pour le fichier ${this.fileKey}...`);
      const data = await this.fetchVariables();
      
      console.log('Variables récupérées avec succès.');
      console.log(`Écriture dans le fichier...`);
      
      const filePath = await this.writeToFile(data, outputPath);
      
      console.log(`✅ Fichier créé: ${filePath}`);
      return filePath;
    } catch (error) {
      console.error('❌ Erreur:', error.message);
      throw error;
    }
  }
}

export default FigmaVariablesFetcher;
