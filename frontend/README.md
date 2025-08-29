# DocuChain Frontend

This is the frontend application for DocuChain - an intelligent document management platform.

## Features

- User authentication and profile management
- Document upload, viewing, and management
- PDF conversion, merging, splitting, and optimization
- Text extraction from documents
- Electronic signatures
- Password protection for documents
- Responsive and intuitive user interface

## Technologies Used

- React.js - Frontend library
- React Router - For navigation
- Axios - For API requests
- React PDF - For PDF viewing
- Formik & Yup - For form handling and validation
- TailwindCSS - For styling
- JWT Decode - For authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Create a `.env` file based on `.env.example` and update the values

### Running the Application

```bash
npm start
# or
yarn start
```

The application will be available at http://localhost:3000

### Building for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

- `/src` - Source code
  - `/components` - Reusable UI components
  - `/pages` - Page components
  - `/context` - React context for state management
  - `/services` - API services
  - `/utils` - Utility functions
  - `/hooks` - Custom React hooks
  - `/assets` - Static assets (images, icons, etc.)

## Contributing

Please follow the contribution guidelines in the main repository README.

## License

This project is licensed under the MIT License.
