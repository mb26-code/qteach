# QTeach

Une petite application web permettant aux élèves de CP de s'entraîner et d'apprendre les bases des mathématiques en discutant avec le sympathique robot QT.

## Lien vers l'application en ligne: [https://qteach.onrender.com/](https://qteach.onrender.com/)

Créateurs:
- Mehdi Bakhtar (mb26-code)  
- Alain Le (AlainIco34)  
- Oscar Jimenez-Flores  


### Guide d'installation locale (exécuter l'application sur votre machine)

1. Accédez à cette URL: [https://github.com/mb26-code/qteach](https://github.com/mb26-code/qteach)

2. Cliquez sur le bouton vert **"Code"**

3. Sélectionnez **"Download ZIP"**

4. Extrayez le fichier téléchargé:
   - **Windows**: Clic droit > "Extraire tout"
   - **Mac**: Double-cliquez > "Extraction automatique"
   - **Linux**: Clic droit > "Extraire ici"

5. Ouvrez un terminal:
   - **Windows**: Appuyez sur `Win + R` > Tapez `cmd` > Entrée
   - **Mac**: Appuyez sur `Cmd + Espace` > Tapez `Terminal` > Entrée
   - **Linux**: Appuyez sur `Ctrl + Alt + T`

6. Vérifiez les outils nécessaires:
   - Dans le terminal, tapez: `node -v`  
     Si un message indique que "node" est inconnu, passez à l'étape 61.  
     Sinon, continuez à l'étape suivante.

   - Ensuite tapez: `npm list express`  
     Si "express" est inconnu, passez à l'étape 61.  
     Sinon, continuez à l'étape suivante.

61. Installer les dépendances :
   - **Node.js**:
     1. Rendez-vous sur: [https://nodejs.org](https://nodejs.org)
     2. Téléchargez la version LTS
     3. Lancez le fichier d’installation (.msi ou .pkg)
     4. Cochez "Add to PATH" pendant l'installation

   - **Express**:
     1. Rendez-vous sur: [https://expressjs.com/fr/starter/installing.html](https://expressjs.com/fr/starter/installing.html)
     2. Sur Mac et Linux, tapez dans le terminal: `npm install express`

7. Déplacez-vous dans le dossier du projet via le terminal:
   - **Windows**:
     ```bash
     cd Downloads/
     cd qteach-main
     cd qteach-main
     ```
   - **Mac** et **Linux**:
     ```bash
     cd Downloads/
     cd qteach-main
     ```

8. Lancez le serveur de l’application avec la commande: `node qteach-server-script.js`

9. Ce message devrait s'afficher:
```
Server application running on port 8080.
QTeach web page localhost URL: http://localhost:8080/
```

10. Copiez ce lien et collez-le dans un navigateur web.

11. Interagissez avec QT: répondez à ses questions ou donnez-lui des problèmes à résoudre !



### Nécessaire pour faire fonctionner l'application :
- Node.js v18 ou supérieur
- Packages Node.js:
  - Express
  - Dotenv
  - Google/Generative-AI
- Un fichier `.env` contenant:
  ```env
  GEMINI_API_KEY="votre clé ici"
  PORT=le port de votre serveur ici
  ```
