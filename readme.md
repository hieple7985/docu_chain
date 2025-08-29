# DocuChain - Intelligent Document Management Platform

DocuChain is an intelligent document management platform developed for the Foxit Software Challenge, combining the power of Foxit PDF SDK with artificial intelligence to automate the process of creating, processing, and managing documents.

## Key Features (MVP)

- Create documents from templates with dynamic data
- Convert Word, Excel, PowerPoint to PDF
- Optimize PDF (reduce file size)
- Split and merge PDFs
- Extract text from PDF
- Simple electronic signatures
- Password protection for documents
- Intuitive web interface for uploading, downloading, previewing PDFs and managing document lists

## Technologies Used

- **Backend**: Node.js/Express, Foxit PDF SDK, OpenAI API
- **Frontend**: React.js, Material UI/Tailwind CSS, PDF.js
- **Database**: MongoDB
- **DevOps**: Docker, GitHub Actions, Heroku/Vercel

## Installation and Setup

### System Requirements
- Node.js (v14+)
- MongoDB
- Foxit PDF SDK API key

### Installation
```bash
# Clone repository
git clone https://github.com/hieplt7985/docu_chain.git
cd docuchain

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Configuration
Create a `.env` file in the backend directory with the following content:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/docuchain
FOXIT_API_KEY=your_foxit_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Running the Application
```bash
# Run backend
cd backend
npm run dev

# Run frontend (in a separate terminal)
cd frontend
npm start
```

## Contributing

All contributions are welcome. Please create an issue or pull request to contribute.

## License

[MIT](LICENSE)
