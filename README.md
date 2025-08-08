# Project Tracker

A role-based project management application built with Next.js, React, and TypeScript.

## Features

- **Role-based Access Control**
  - Admin: Full access to all projects and user management
  - Member: Access to assigned projects only

- **Admin Dashboard**
  - Create and manage projects
  - Assign team members to projects
  - View all projects and filter by status/member

- **Member Dashboard**
  - View assigned projects
  - Update project status
  - Add comments to projects

- **Responsive Design**
  - Works on desktop and mobile devices
  - Clean and intuitive UI built with TailwindCSS

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+ and npm/yarn
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/sagargopi/Project-Tracker.git
   cd project-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Run linter

## Test Credentials

### Admin
- **Username**: admin
- **Password**: adminpassword
- **Role**: Admin

### Member
- **Username**: alice
- **Password**: alicepassword
- **Role**: Member

## Project Structure

```
project-tracker/
├── app/                    # App router pages
├── components/             # Reusable components
├── lib/                    # Utility functions and data
├── public/                 # Static files
├── styles/                 # Global styles
└── types/                  # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [Shadcn/ui Documentation](https://ui.shadcn.com/docs)
