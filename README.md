# ChatApp

A responsive real-time-style chat app built with **Next.js (App Router)**, **React**, **Tailwind CSS** and **shadcn/ui**. It works on mobile, tablet and laptop screens.

## Features

- Search users by username and start a one-to-one chat
- Create group chats with multiple members
- Leave a group from the sidebar
- Send and read messages in a chat room
- Login-protected pages (redirects to `/login` when signed out)
- Fully responsive layout for mobile, tablet and laptop

## Components

| File | What it does |
| --- | --- |
| `Navbar.jsx` | Top bar with logo, user search dialog, welcome text and logout |
| `app-sidebar.jsx` | Sidebar with room list, Create Group dialog and user menu |
| `ChatWindow.jsx` | Message list, back link and message input for one room |

## Responsive behaviour

| Screen | Breakpoint | What changes |
| --- | --- | --- |
| Mobile | below `640px` | Navbar shows icons only, welcome text is hidden, sidebar opens as a sheet and closes after you pick a chat, chat bubbles use 85% width |
| Tablet | `sm` / `md` (`640px` and up) | Button labels and welcome text appear, bubbles use 75% width, dialogs get a fixed width |
| Laptop | `lg` (`1024px` and up) | Sidebar stays visible, chat content is centered (`max-w-3xl`), bubbles use 65% width |

Other mobile details:

- `h-dvh` is used instead of `h-screen`, so the browser address bar does not hide the input.
- Inputs use a 16px font on mobile, which stops iOS from zooming in on focus.
- The message input has bottom safe-area padding for phones with a home bar.
- Dialogs scroll inside the screen (`max-h-[90dvh]`).
- The user dropdown opens upward on mobile so it stays on screen.

## Tech stack

- Next.js (App Router) and React
- Tailwind CSS
- shadcn/ui components
- lucide-react icons
- Axios instance in `@/lib/api`

## Project structure (expected)

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── app-sidebar.jsx
│   ├── ChatWindow.jsx
│   └── ui/              # shadcn/ui components
├── context/
│   ├── AuthProvider.jsx
│   └── RoomProvider.jsx
└── lib/
    ├── api.js
    └── utils.js
```

## Getting started

```bash
# install dependencies
npm install

# run the dev server
npm run dev
```

Open http://localhost:3000.

Create a `.env.local` file if your `api.js` reads the backend URL from the environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Backend API used

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/search?q=` | Search users by username |
| POST | `/createRoom` | Start a one-to-one chat |
| POST | `/createGroup` | Create a group |
| GET | `/getallroom` | List the user's rooms |
| PATCH | `/:roomId` | Leave a group |
| GET | `/message/:roomId` | Get messages of a room |
| POST | `/message/:roomId` | Send a message |

## Mobile sidebar button

On mobile the sidebar is hidden until opened. Add `<SidebarTrigger />` inside your layout header (it must be inside `SidebarProvider`):

```jsx
import { SidebarTrigger } from "@/components/ui/sidebar";

<header className="flex items-center p-2 md:hidden">
  <SidebarTrigger />
</header>
```

## Testing responsiveness

1. Run the app and open browser DevTools.
2. Turn on device mode (`Ctrl/Cmd + Shift + M`).
3. Check these widths: `375px` (mobile), `768px` (tablet), `1280px` (laptop).

