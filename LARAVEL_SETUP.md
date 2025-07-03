# Configuration Laravel Backend

Ce document explique comment configurer un backend Laravel pour fonctionner avec cette application React.

## 1. Créer le projet Laravel

```bash
composer create-project laravel/laravel restaurant-api
cd restaurant-api
```

## 2. Configuration de la base de données

### Pour MySQL :

```bash
# Dans .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=restaurant_db
DB_USERNAME=root
DB_PASSWORD=votre_mot_de_passe
```

### Pour PostgreSQL :

```bash
# Dans .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=restaurant_db
DB_USERNAME=postgres
DB_PASSWORD=votre_mot_de_passe
```

## 3. Migrations de base de données

Créer les migrations :

```bash
php artisan make:migration create_orders_table
php artisan make:migration create_articles_table
php artisan make:migration create_users_table
php artisan make:migration create_order_items_table
```

### Migration Orders (database/migrations/xxx_create_orders_table.php) :

```php
<?php
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->string('order_number')->unique();
    $table->string('table_number');
    $table->integer('article_count')->default(0);
    $table->decimal('total_price', 10, 2);
    $table->enum('status', ['validated', 'pending', 'served', 'cancelled'])->default('pending');
    $table->timestamps();
});
```

### Migration Articles :

```php
<?php
Schema::create('articles', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('price', 8, 2);
    $table->string('image')->nullable();
    $table->string('category');
    $table->text('description')->nullable();
    $table->boolean('in_stock')->default(true);
    $table->timestamps();
});
```

### Migration Users :

```php
<?php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('nom');
    $table->string('prenoms');
    $table->string('email')->unique();
    $table->string('telephone');
    $table->integer('age');
    $table->enum('role', ['admin', 'manager', 'serveur'])->default('serveur');
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->rememberToken();
    $table->timestamps();
});
```

### Migration Order Items :

```php
<?php
Schema::create('order_items', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->onDelete('cascade');
    $table->foreignId('article_id')->constrained()->onDelete('cascade');
    $table->integer('quantity');
    $table->decimal('price', 8, 2);
    $table->timestamps();
});
```

## 4. Modèles Eloquent

### Order Model (app/Models/Order.php) :

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'table_number',
        'article_count',
        'total_price',
        'status'
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function articles()
    {
        return $this->belongsToMany(Article::class, 'order_items')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }
}
```

### Article Model :

```php
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = [
        'name',
        'price',
        'image',
        'category',
        'description',
        'in_stock'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'in_stock' => 'boolean'
    ];

    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_items')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }
}
```

## 5. Contrôleurs API

### OrderController (app/Http/Controllers/Api/OrderController.php) :

```php
<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with('items.article');

        if ($request->search) {
            $query->where('order_number', 'like', "%{$request->search}%")
                  ->orWhere('table_number', 'like', "%{$request->search}%");
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        $orders = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Orders retrieved successfully',
            'data' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'table_number' => 'required|string',
            'items' => 'required|array',
            'items.*.article_id' => 'required|exists:articles,id',
            'items.*.quantity' => 'required|integer|min:1'
        ]);

        $order = Order::create([
            'order_number' => 'C' . str_pad(Order::count() + 1, 3, '0', STR_PAD_LEFT),
            'table_number' => $request->table_number,
            'status' => 'pending'
        ]);

        // Ajouter les items et calculer le total
        $totalPrice = 0;
        $articleCount = 0;

        foreach ($request->items as $item) {
            $article = Article::find($item['article_id']);
            $order->items()->create([
                'article_id' => $article->id,
                'quantity' => $item['quantity'],
                'price' => $article->price
            ]);

            $totalPrice += $article->price * $item['quantity'];
            $articleCount += $item['quantity'];
        }

        $order->update([
            'total_price' => $totalPrice,
            'article_count' => $articleCount
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'data' => $order->load('items.article')
        ], 201);
    }

    // Ajouter les méthodes show, update, destroy...
}
```

## 6. Routes API (routes/api.php) :

```php
<?php
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

Route::apiResource('orders', OrderController::class);
Route::apiResource('articles', ArticleController::class);
Route::apiResource('users', UserController::class);

Route::get('dashboard/stats', [DashboardController::class, 'stats']);
Route::post('upload/image', [UploadController::class, 'image']);
```

## 7. CORS Configuration

Dans `config/cors.php` :

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:5173', 'http://localhost:3000'],
'allowed_headers' => ['*'],
```

## 8. Seeders (optionnel)

```bash
php artisan make:seeder ArticleSeeder
php artisan make:seeder OrderSeeder
```

## 9. Lancer le serveur

```bash
php artisan migrate
php artisan serve
```

Le serveur Laravel sera accessible sur `http://localhost:8000`

## 10. Tester l'API

Utilisez Postman ou curl pour tester :

```bash
# Récupérer les commandes
curl http://localhost:8000/api/orders

# Créer une commande
curl -X POST http://localhost:8000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"table_number":"T01","items":[{"article_id":"1","quantity":2}]}'
```

## Notes importantes

1. Assurez-vous que votre serveur Laravel fonctionne sur le port 8000
2. Configurez CORS pour permettre les requêtes depuis votre frontend React
3. Adaptez les URLs dans votre fichier `.env` React
4. Testez chaque endpoint avant l'intégration complète
