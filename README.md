# Super-Garde Landing

Landing page React + Vite pour Super-Garde.

## Lancer en local

```bash
npm install
npm run dev
```

Pour tester l’envoi Discord en local, créer un fichier `.env.local` :

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

Le serveur Vite expose alors aussi `/api/contact` en développement.

## Envoyer les demandes de contact vers Discord

1. Ouvrir Discord, puis le serveur qui recevra les demandes.
2. Ouvrir les paramètres du salon texte existant.
3. Aller dans `Intégrations`.
4. Ouvrir `Webhooks`.
5. Créer un nouveau webhook, ou sélectionner un webhook existant.
6. Choisir le salon texte cible.
7. Copier l’URL du webhook.
8. Ajouter cette variable côté serveur, par exemple dans les variables d’environnement Vercel :

```bash
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...
```

9. Redéployer l’application.

Le formulaire `Me recontacter` appelle `/api/contact`. En local, Vite sert cette route via un middleware de développement. En production, la fonction serverless `api/contact.js` lit `DISCORD_WEBHOOK_URL` côté serveur, puis envoie le message Discord avec l’email fourni.

## Déployer sur Netlify

Cette landing est compatible Netlify.

Paramètres de build :

```bash
Build command: npm run build
Publish directory: dist
```

Le fichier `netlify.toml` contient déjà ces réglages.

Pour activer l’envoi Discord :

1. Dans Netlify, ouvrir le site.
2. Aller dans `Site configuration`.
3. Aller dans `Environment variables`.
4. Ajouter `DISCORD_WEBHOOK_URL` avec l’URL du webhook Discord.
5. Relancer un déploiement.

Netlify utilisera `netlify/functions/contact.mjs` sur la route `/api/contact`.
