# Курсовой проект: REST-сервис управления задачами

## Архитектура

- **client/** — фронтенд (React, русский язык)
- **server/** — бэкенд (Node.js + Express, MySQL)

## Основные возможности
- Регистрация и авторизация пользователей
- Роли: user/admin
- CRUD задачи (todo)
- Назначение задач пользователям

## Запуск

1. Установить зависимости:
   - В папке `server`: `npm install`
   - В папке `client`: `npm install`
2. Запустить backend (в папке server):
   - `node src/index.js`
3. Запустить frontend (в папке client):
   - `npx serve -s build`

---

## Стек
- Node.js, Express, MySQL
- React 