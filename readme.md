# WebGallery — Fullstack застосунок для управління фотогалереєю

**WebGallery** — персоналізований веб-сервіс для зберігання та організації фотографій. Складається з серверної частини (REST API) та клієнтської (SPA-застосунок).

---

## Технологічний стек

### Серверна частина

| Компонент | Технологія |
|---|---|
| Середовище виконання | Node.js |
| HTTP-фреймворк | Express.js |
| База даних | PostgreSQL |
| ORM | Prisma |
| Завантаження файлів | Multer |
| Автентифікація | JWT (jsonwebtoken) + bcrypt |
| Тестування | Jest + Supertest |
| Логування | Morgan |

### Клієнтська частина

| Компонент | Технологія |
|---|---|
| UI-бібліотека | React 18 |
| Збірник | Vite |
| Маршрутизація | React Router v6 |
| HTTP-клієнт | Axios |
| Стилізація | Tailwind CSS |
| Тестування | Jest + React Testing Library |

---

## Вимоги

- [Node.js](https://nodejs.org/) v18 або вище
- [PostgreSQL](https://www.postgresql.org/) v14 або вище
- npm v9 або вище

---

## Встановлення та запуск

### 1. Клонування репозиторію

```bash
git clone https://github.com/Kisabi/webgallery.git
cd webgallery
```

### 2. Налаштування та запуск серверної частини

```bash
# Встановлення залежностей сервера
npm install

# Створити файл .env у кореневій директорії
```

Вміст `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/webgallery"
JWT_SECRET="your_secret_key_here"
PORT=3000
```

```bash
# Застосувати міграції Prisma (створює всі таблиці)
npx prisma migrate deploy

# Запуск сервера у режимі розробки
npm run dev
```

Сервер буде доступний за адресою: `http://localhost:3000`

### 3. Налаштування та запуск клієнтської частини

```bash
# Перейти до директорії клієнта
cd client

# Встановлення залежностей
npm install

# Запуск у режимі розробки
npm run dev
```

Клієнт буде доступний за адресою: `http://localhost:5173`

---

## Структура проєкту

```
├── prisma/
│   ├── migrations/          # SQL-міграції бази даних
│   └── schema.prisma        # Схема моделей даних
├── src/
│   ├── controllers/         # Обробники HTTP-запитів
│   ├── middleware/          # auth, errorHandler, upload
│   ├── repositories/        # Шар доступу до бази даних
│   ├── routes/              # Визначення маршрутів Express
│   ├── services/            # Бізнес-логіка застосунку
│   ├── prismaClient.js      # Єдиний екземпляр Prisma Client
│   ├── app.js               # Конфігурація Express-застосунку
│   └── server.js            # Точка входу, запуск сервера
├── tests/                   # Автоматизовані тести сервера
├── uploads/                 # Завантажені файли зображень
├── client/
│   ├── src/
│   │   ├── components/      # Navbar, ImageCard, CollectionCard, тощо
│   │   ├── context/         # AuthContext (DI-контейнер авторизації)
│   │   ├── pages/           # LoginPage, GalleryPage, CollectionsPage, тощо
│   │   ├── services/        # api.js (Axios + JWT interceptor)
│   │   └── tests/           # Автоматизовані тести клієнта
│   ├── index.html
│   └── package.json
└── readme.md
```

---

## API-маршрути

### Автентифікація

| Метод | Маршрут | Опис | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Реєстрація нового користувача | — |
| POST | `/api/auth/login` | Вхід, повернення JWT-токена | — |

### Зображення

| Метод | Маршрут | Опис | Auth |
|---|---|---|---|
| GET | `/api/images` | Список зображень користувача | ✓ |
| POST | `/api/images` | Завантаження нового зображення | ✓ |
| DELETE | `/api/images/:id` | Видалення зображення | ✓ |

### Колекції

| Метод | Маршрут | Опис | Auth |
|---|---|---|---|
| GET | `/api/collections` | Список колекцій користувача | ✓ |
| POST | `/api/collections` | Створення нової колекції | ✓ |
| PUT | `/api/collections/:id` | Перейменування колекції | ✓ |
| DELETE | `/api/collections/:id` | Видалення колекції | ✓ |
| POST | `/api/collections/:id/images` | Додавання зображення до колекції | ✓ |
| DELETE | `/api/collections/:id/images/:imageId` | Видалення зображення з колекції | ✓ |

> **Auth ✓** — маршрут вимагає заголовку `Authorization: Bearer <token>`

### Статичні файли

```
GET /uploads/<filename>
```

---

## Приклади запитів

### Реєстрація

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "myusername",
  "password": "mypassword"
}
```

### Вхід

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "mypassword"
}
```

Відповідь:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Завантаження зображення

```http
POST /api/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

image: <image_file>
```

---

## Тестування

### Серверна частина

```bash
# З кореневої директорії
npm test
```

30 автоматизованих тестів (Jest + Supertest):
- Юніт-тести: middleware автентифікації, сервіс автентифікації
- Інтеграційні тести: маршрути auth, images, collections

### Клієнтська частина

```bash
# З директорії /client
cd client
npm test
```

25 автоматизованих тестів (Jest + React Testing Library):
- AuthContext, PrivateRoute, Navbar, ImageCard, CollectionCard, ImageUploadForm
- Покриття коду: 88.63% рядків, 92.85% гілок, 93.75% функцій

---

## Репозиторій

[https://github.com/Kisabi/webgallery](https://github.com/Kisabi/webgallery)