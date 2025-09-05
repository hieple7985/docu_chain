# DocuChain - Intelligent Document Management Platform

DocuChain is an intelligent document management platform developed for the Foxit Software Challenge, combining the power of Foxit PDF SDK with artificial intelligence to automate the process of creating, processing, and managing documents.

## 🚀 Project Status

**Current Phase**: D34 COMPLETED ✅
**Next Phase**: D56 - Deployment & Performance
**Timeline**: Ready for deployment prep

## 🎯 D12 Achievements (COMPLETED)

### ✅ Backend MVP Complete
- Full CRUD operations for documents
- Foxit API integration for PDF processing
- User authentication system with JWT
- MongoDB database setup with Atlas
- RESTful API with Express.js

### ✅ Frontend Foundation Complete
- React app structure with React Router
- Document management components
- API integration layer
- Modern UI with Tailwind CSS
- Responsive design foundation

### ✅ Foxit API Integration
- Document conversion (Word/Excel/PPT → PDF)
- PDF optimization and compression
- Text extraction from PDFs
- PDF splitting and merging
- Password protection for documents

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React.js, React Router, Tailwind CSS
- **PDF Processing**: Foxit PDF SDK API
- **Database**: MongoDB Atlas (Cloud)
- **Authentication**: JWT with bcrypt
- **File Handling**: Multer, FormData

## 📋 Key Features (MVP)

- ✅ Create documents from templates with dynamic data
- ✅ Convert Word, Excel, PowerPoint to PDF
- ✅ Optimize PDF (reduce file size)
- ✅ Split and merge PDFs
- ✅ Extract text from PDF
- ✅ Password protection for documents
- ✅ Intuitive web interface for document management

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Foxit Developer account with API credentials

### Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/docu_chain.git
cd docu_chain

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev

# Frontend setup (in new terminal)
cd ../frontend
npm install
npm start
```

### Environment Variables
Create `.env` file in backend directory:
```env
PORT=5001
MONGODB_URI=your_mongodb_atlas_connection_string
FOXIT_DOCGEN_ID=your_foxit_docgen_id
FOXIT_DOCGEN_SECRET=your_foxit_docgen_secret
FOXIT_PDF_ID=your_foxit_pdf_id
FOXIT_PDF_SECRET=your_foxit_pdf_secret
JWT_SECRET=your_jwt_secret
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Documents
- `GET /api/documents` - Get all documents
- `POST /api/documents` - Create document
- `GET /api/documents/:id` - Get document by ID
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

### PDF Operations
- `POST /api/documents/upload` - Upload document
- `POST /api/documents/optimize` - Optimize PDF
- `POST /api/documents/extract-text` - Extract text from PDF
- `POST /api/documents/protect` - Protect PDF with password
- `POST /api/documents/split` - Split PDF by pages

## 🔄 Development Workflow

### D12 (COMPLETED) ✅
- Backend MVP development
- Foxit API integration
- Frontend foundation
- Database setup

### D34 (COMPLETED) ✅
- Complete missing React components
- Implement PDF viewer
- UI/UX improvements
- Testing and validation
- Deployment preparation
- Add local fallback for Extract Text using pdf-parse when Foxit API fails

### D56 (IN PROGRESS) 🟡
- Production deployment
- Performance optimization
- Hackathon submission
- Demo video creation

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Development
- Backend: `http://localhost:5001`
- Frontend: `http://localhost:3000`

### Production (Coming in D34)
- Heroku/Vercel deployment
- CI/CD pipeline
- Environment management
- Monitoring and analytics

## 📖 Documentation

- [API Documentation](./docs/api.md) - Coming in D34
- [User Manual](./docs/user-manual.md) - Coming in D34
- [Technical Architecture](./docs/architecture.md) - Coming in D34

## 🤝 Contributing

This project is developed for the DevNetwork [API + Cloud + Data] Hackathon 2025.

## 📄 License

[MIT](LICENSE)

## 🎯 Next Steps

**Ready for D34 Development**:
1. Complete missing React components
2. Implement PDF viewer with PDF.js
3. Add comprehensive testing
4. Prepare for production deployment
5. Create hackathon submission materials

**Project Status**: MVP Complete, Ready for Enhancement Phase
