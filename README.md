# Figma Variables Fetcher

Script Node.js pour récupérer les variables locales d'un fichier Figma via l'API et les sauvegarder dans un fichier JSON.

## Installation

```bash
npm install
```

## Configuration

1. Créez un fichier `.env` à la racine du projet avec le contenu suivant :

```env
FIGMA_ACCESS_TOKEN=VOTRE_TOKEN_FIGMA
FIGMA_FILE_KEY=VOTRE_FILE_KEY
```

2. Obtenez votre token d'accès Figma :
   - Allez dans Figma → Settings → Account
   - Générez un Personal Access Token
   - Remplacez `VOTRE_TOKEN_FIGMA` dans le fichier `.env`

3. Obtenez la clé de votre fichier Figma :
   - Ouvrez votre fichier Figma dans le navigateur
   - L'URL contient la clé : `https://www.figma.com/file/{FILE_KEY}/...`
   - Remplacez `VOTRE_FILE_KEY` dans le fichier `.env`

## Utilisation

### Exécuter l'exemple

```bash
node example.js
```

Le script `example.js` charge automatiquement les variables depuis le fichier `.env`.

### Utilisation programmatique

```javascript
import FigmaVariablesFetcher from './FigmaVariablesFetcher.js';

const fetcher = new FigmaVariablesFetcher('VOTRE_TOKEN', 'VOTRE_FILE_KEY');
await fetcher.fetchAndSave();
```

### Méthodes disponibles

- `fetchVariables()` : Récupère les variables depuis l'API Figma
- `writeToFile(data, outputPath)` : Écrit les données dans un fichier JSON
- `fetchAndSave(outputPath)` : Combine les deux méthodes ci-dessus

### Exemple complet

Voir le fichier `example.js` pour un exemple d'utilisation complet.

## API Figma

Cette classe utilise l'endpoint suivant :
```
GET https://api.figma.com/v1/files/{FILE_KEY}/variables/local
```

## Licence

ISC
