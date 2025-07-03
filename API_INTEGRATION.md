# Intégration API Laravel

## 🚀 Démarrage rapide

Le projet est maintenant configuré pour communiquer avec une API Laravel. En attendant que votre backend soit prêt, l'application fonctionne avec des **données de test**.

### Mode actuel : Fallback (données de test)

```bash
# Votre .env actuel
VITE_USE_FALLBACK=true
```

## 🔧 Configuration

### 1. Mode développement (actuel)

- ✅ Données de test intégrées
- ✅ Interface fonctionnelle
- ✅ Toutes les fonctionnalités disponibles
- ⚠️ Aucune persistance des données

### 2. Mode production (avec Laravel)

```bash
# Dans votre .env
VITE_USE_FALLBACK=false
VITE_API_URL=http://localhost:8000/api
```

## 🧪 Test de connexion API

```bash
# Tester si votre API Laravel est accessible
npm run test:api
```

## 📊 Fonctionnalités intégrées

### ✅ Commandes (Orders)

- Récupération avec filtres
- Création de nouvelles commandes
- Modification du statut
- Suppression
- Détails avec articles

### ✅ Articles (Menu)

- Liste avec filtres (catégorie, prix, recherche)
- Création d'articles
- Modification
- Suppression

### ✅ Utilisateurs

- Gestion complète CRUD
- Filtrage par rôle

### ✅ Dashboard

- Statistiques en temps réel
- Auto-refresh des données

## 🔄 Basculer vers l'API réelle

1. **Configurer Laravel** (voir `LARAVEL_SETUP.md`)
2. **Démarrer le serveur**:
   ```bash
   php artisan serve
   ```
3. **Tester la connexion**:
   ```bash
   npm run test:api
   ```
4. **Activer l'API** dans `.env`:
   ```bash
   VITE_USE_FALLBACK=false
   ```

## 🛠 Structure des données

### Ordre des API calls

```
GET /api/orders          # Liste des commandes
GET /api/orders/{id}     # Détails d'une commande
POST /api/orders         # Créer une commande
PUT /api/orders/{id}     # Modifier une commande
DELETE /api/orders/{id}  # Supprimer une commande

GET /api/articles        # Liste des articles
POST /api/articles       # Créer un article
PUT /api/articles/{id}   # Modifier un article
DELETE /api/articles/{id} # Supprimer un article

GET /api/dashboard/stats # Statistiques
```

### Format de réponse attendu

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "data": [...],
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

## 🔍 Debugging

### Problème : API non accessible

1. Vérifier que Laravel tourne sur le bon port
2. Configurer CORS dans Laravel
3. Vérifier l'URL dans `VITE_API_URL`

### Problème : Erreurs de données

1. Vérifier la structure de réponse Laravel
2. Regarder les logs dans la console
3. Utiliser le mode fallback temporairement

### Mode fallback automatique

Si l'API échoue, l'application bascule automatiquement sur les données de test avec un message d'avertissement.

## 📱 Types TypeScript

Tous les types sont définis dans `client/types/api.ts` et correspondent aux modèles Laravel attendus.

## 🎯 Prochaines étapes

1. ⚠️ **Configurer Laravel** (guide complet dans `LARAVEL_SETUP.md`)
2. 🔧 **Tester l'API** avec `npm run test:api`
3. 🚀 **Basculer en mode production** avec `VITE_USE_FALLBACK=false`
4. 🎨 **Personnaliser** selon vos besoins
