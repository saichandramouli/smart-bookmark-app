# 📌 Smart Bookmark App

A full-stack real-time bookmark management application built using **Next.js (App Router)** and **Supabase**.  
The app allows authenticated users to securely manage personal bookmarks with instant cross-tab synchronization.

---

## 🧩 Project Overview

Smart Bookmark App enables users to:

- Authenticate using Google OAuth
- Create and delete personal bookmarks
- Access private data secured with Row Level Security (RLS)
- Experience real-time updates across multiple browser sessions
- Use a responsive UI built with Tailwind CSS

This project demonstrates modern full-stack development practices using serverless architecture.

---

## 🏗️ Architecture

Frontend: Next.js (App Router)  
Backend: Supabase (PostgreSQL + Auth + Realtime)  
Authentication: Google OAuth via Supabase  
Database Security: Row Level Security Policies  
Deployment: Vercel  

---

## 🔐 Authentication Flow

1. User signs in with Google OAuth.
2. Supabase handles authentication and session management.
3. User ID from Supabase auth is linked to bookmark records.
4. Row Level Security ensures users can only access their own records.

---

## 🗄️ Database Design

### Table: `bookmarks`

```sql
create table bookmarks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  url text not null,
  created_at timestamp default now()
);
```

### Row Level Security

```sql
alter table bookmarks enable row level security;

create policy "Users can access their own bookmarks"
on bookmarks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
```

---

## ⚡ Real-Time Implementation

Supabase Realtime subscriptions listen for database changes:

- INSERT
- DELETE
- UPDATE

Whenever a change occurs, the UI automatically refreshes the bookmark list, enabling real-time synchronization across tabs.

---

## 🚀 Deployment

The application is deployed on Vercel.

### Environment Variables Required

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Live URL:  
👉 Add your Vercel deployment link here

---

## 📦 Local Setup

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/smart-bookmark-app.git
```

Navigate to the project:

```bash
cd smart-bookmark-app
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

## 🛠️ Key Technical Highlights

- Implemented secure multi-user architecture using RLS
- Integrated third-party OAuth authentication
- Built full CRUD functionality with Supabase
- Implemented real-time data subscriptions
- Deployed full-stack app using serverless infrastructure

---

## 🧠 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| OAuth redirect errors | Configured correct callback URL in Google Cloud |
| Insert blocked by RLS | Added `with check (auth.uid() = user_id)` |
| Realtime not triggering | Enabled replication for bookmarks table |
| Session not persisting | Used `onAuthStateChange` listener |

---



