# Student Management Admin Dashboard

Complete full-stack admin dashboard built with:

- Frontend: Next.js App Router, Tailwind CSS, axios
- Backend: Node.js, Express.js, JWT auth
- Database: MongoDB Atlas with mongoose
- Uploads: multer and Cloudinary

## 1. Backend Setup

Go to the backend folder:

```bash
cd backend
npm install
```

Update `backend/.env` with your real credentials:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/studentdashboard
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
JWT_SECRET=your_secret_key
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start the API:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

Create your first admin by sending a POST request to:

```text
POST http://localhost:5000/api/auth/register
```

Example JSON:

```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "password123"
}
```

## 2. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Update `frontend/.env` if your API URL changes:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the website:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 3. Main API Routes

Auth:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

Students:

- `GET /api/students?search=&class=&section=&status=&minAttendance=&page=&limit=`
- `POST /api/students`
- `POST /api/students/bulk`
- `GET /api/students/:id`
- `PUT /api/students/:id`
- `DELETE /api/students/:id`
- `POST /api/students/:id/documents`

Attendance:

- `GET /api/attendance`
- `POST /api/attendance`
- `POST /api/attendance/bulk`

Fees:

- `GET /api/fees`
- `POST /api/fees`
- `PUT /api/fees/:id`
- `GET /api/fees/:id/receipt`

Dashboard:

- `GET /api/dashboard`

## 4. Search And Filter

The student list supports real-time combined search and filters:

- Search by name, roll number, or class
- Filter by class
- Filter by section
- Filter by fee status
- Filter by minimum attendance percentage
- Reset filters
- Pagination

The backend uses MongoDB `$regex` search:

```js
{
  $or: [
    { name: { $regex: search, $options: "i" } },
    { rollNumber: { $regex: search, $options: "i" } },
    { className: { $regex: search, $options: "i" } }
  ]
}
```

## 5. CSV / Excel Bulk Student Upload

Supported columns:

- `name` or `Name`
- `rollNumber`, `Roll Number`, or `roll`
- `className`, `Class`, or `class`
- `section` or `Section`
- `email` or `Email`
- `phone` or `Phone`
- `guardianName` or `Guardian Name`
- `address` or `Address`

Upload `.csv` or `.xlsx` files from the Students page.
