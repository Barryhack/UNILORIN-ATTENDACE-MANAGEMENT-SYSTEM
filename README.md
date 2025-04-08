# UNILORIN Attendance Management System

A modern web application for managing student attendance at the University of Ilorin using biometric and RFID technologies.

## Features

- **Multi-role Access**: Admin, Staff, and Student interfaces
- **Biometric Integration**: Fingerprint scanner support
- **RFID Integration**: RFID card reader support
- **Real-time Attendance Tracking**: Monitor attendance in real-time
- **Course Management**: Create and manage courses
- **Student Management**: Register and manage student information
- **Hardware Configuration**: Configure ESP32, fingerprint scanner, and RFID reader
- **Reports Generation**: Generate attendance reports
- **Modern UI**: Elegant and responsive design

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn UI
- **Authentication**: NextAuth.js
- **Database**: (To be implemented)
- **Hardware Integration**: ESP32, Fingerprint Scanner, RFID Reader

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/unilorin-ams.git
   cd unilorin-ams
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   
   # Database (to be implemented)
   # DATABASE_URL=your-database-url
   ```

4. Run the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
unilorin-ams/
├── app/                    # Next.js app directory
│   ├── (auth)/             # Authentication pages
│   ├── (dashboard)/        # Dashboard pages
│   │   ├── admin/          # Admin interface
│   │   ├── staff/          # Staff interface
│   │   └── student/        # Student interface
│   ├── api/                # API routes
│   └── layout.tsx          # Root layout
├── components/             # Reusable components
├── lib/                    # Utility functions
├── public/                 # Static assets
└── styles/                 # Global styles
```

## Deployment

This project can be deployed on Vercel, Netlify, or any other platform that supports Next.js applications.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- University of Ilorin
- Shadcn UI for the component library
- Next.js team for the amazing framework 