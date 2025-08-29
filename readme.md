# DocuChain - Nền tảng quản lý tài liệu thông minh

DocuChain là một nền tảng quản lý tài liệu thông minh được phát triển cho Foxit Software Challenge, kết hợp sức mạnh của Foxit PDF SDK với trí tuệ nhân tạo để tự động hóa quy trình tạo, xử lý và quản lý tài liệu.

## Tính năng chính (MVP)

- Tạo tài liệu từ mẫu với dữ liệu động
- Chuyển đổi Word, Excel, PowerPoint sang PDF
- Tối ưu hóa PDF (giảm kích thước)
- Tách và ghép PDF
- Trích xuất văn bản từ PDF
- Chữ ký điện tử đơn giản
- Bảo vệ tài liệu bằng mật khẩu
- Giao diện web trực quan để tải lên, tải xuống, xem trước PDF và quản lý danh sách tài liệu

## Công nghệ sử dụng

- **Backend**: Node.js/Express, Foxit PDF SDK, OpenAI API
- **Frontend**: React.js, Material UI/Tailwind CSS, PDF.js
- **Database**: MongoDB
- **DevOps**: Docker, GitHub Actions, Heroku/Vercel

## Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js (v14+)
- MongoDB
- Foxit PDF SDK API key

### Cài đặt
```bash
# Clone repository
git clone https://github.com/yourusername/docuchain.git
cd docuchain

# Cài đặt dependencies cho backend
cd backend
npm install

# Cài đặt dependencies cho frontend
cd ../frontend
npm install
```

### Cấu hình
Tạo file `.env` trong thư mục backend với nội dung:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/docuchain
FOXIT_API_KEY=your_foxit_api_key
OPENAI_API_KEY=your_openai_api_key
```

### Chạy ứng dụng
```bash
# Chạy backend
cd backend
npm run dev

# Chạy frontend (trong terminal khác)
cd frontend
npm start
```

## Đóng góp
Mọi đóng góp đều được chào đón. Vui lòng tạo issue hoặc pull request để đóng góp.

## Giấy phép
[MIT](LICENSE)
