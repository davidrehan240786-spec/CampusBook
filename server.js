// Campus Book Exchange - Basic Backend
// Works with Google AI Studio (Vite + MySQL)
// coderabbit full review trigger

import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const JWT_SECRET = process.env.JWT_SECRET || 'campusbook_super_secret_key_123';

const app = express();
app.use(cors());
app.use(express.json());

const IS_DEMO_MODE = process.env.DEMO_MODE === 'true';

// 1. Database Connection (Using Pool for better stability)
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'campus_book_exchange',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Demo Data for Preview Mode
const MOCK_BOOKS = [
    { id: 101, title: 'Introduction to Algorithms', author: 'CLRS', category: 'Computer Science', price: 600, campus: 'SJCE', status: 'Available', image_url: 'https://picsum.photos/seed/algo/400/600', purchase_date: '2023-01-01', condition_status: 'New', description: 'Core textbook for algorithms.', seller_name: 'Rahul', seller_id: 10, images: ['https://picsum.photos/seed/algo/400/600'] },
    { id: 102, title: 'Engineering Physics', author: 'Gaur & Gupta', category: 'Physics', price: 250, campus: 'SJCE', status: 'Available', image_url: 'https://picsum.photos/seed/physics/400/600', purchase_date: '2022-05-20', condition_status: 'Good', description: 'Used for first year.', seller_name: 'Priya', seller_id: 11, images: ['https://picsum.photos/seed/physics/400/600'] }
];

// Test the connection
db.query('SELECT 1', (err) => {
    if (err) {
        console.log("⚠️ Database offline. Running in 'Demo Mode' for preview.");
    } else {
        console.log("✅ Connected to MySQL Database via Pool.");
    }
});

// Middleware for verifying general user JWT
const verifyUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
        req.user = decoded;
        next();
    });
};

// Middleware for verifying Admin JWT
const verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
        if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
        req.user = decoded;
        next();
    });
};

// Removed logActivity as activity_logs table is missing and not to be added.

// 2. LOGIN API
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (IS_DEMO_MODE && (email === "test@example.com" || email.includes("admin"))) {
        const role = email.includes("admin") ? "admin" : "user";
        const user = { id: 1, name: "Demo User", email, role, campus: "SJCE" };
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({
            success: true,
            user,
            token
        });
    }

    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err || !results || results.length === 0) {
            return res.json({ success: false, message: "Invalid credentials" });
        }
        const user = results[0];
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, user, token });
    });
});

// 3. SIGNUP API
app.post('/signup', (req, res) => {
    console.log("Signup Payload:", req.body);
    const { firstName, lastName, email, password, campus, usn, phone } = req.body;
    const fullName = firstName + " " + lastName;
    const finalUsn = usn || null;

    const sql = "INSERT INTO users (name, email, password, campus, role, usn, phone) VALUES (?, ?, ?, ?, 'user', ?, ?)";
    db.query(sql, [fullName, email, password, campus, finalUsn, phone], (err) => {
        if (err) {
            console.error("Signup Error:", err);
            return res.json({ success: false, message: "Registration failed or email already exists" });
        }
        res.json({ success: true });
    });
});

// 4. FETCH BOOKS API
app.get('/books', (req, res) => {
    // Return all books to match Admin panel visibility, excluding restrictive status filters
    const sql = "SELECT * FROM books ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err || (IS_DEMO_MODE && (!results || results.length === 0))) {
            console.log("Books API: Serving MOCK data (error or empty results)");
            return res.json(MOCK_BOOKS);
        }
        console.log("Books API count (Marketplace):", results.length);
        res.json(results);
    });
});

// 5. ADD BOOK API
app.post('/add-book', (req, res) => {
    const { title, author, price, campus, purchaseDate, category, condition, description, image_url, images, seller_id, seller_name } = req.body;

    const sql = `INSERT INTO books 
        (title, author, price, campus, purchase_date, category, condition_status, description, image_url, images, seller_id, seller_name, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Available')`;

    db.query(sql, [title, author, price, campus, purchaseDate, category, condition, description, image_url, JSON.stringify(images || null), seller_id, seller_name], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        // logActivity removed
        res.json({ success: true });
    });
});

// 6. MY BOOKS API
app.get('/my-books/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM books WHERE seller_id = ? ORDER BY id DESC";
    db.query(sql, [userId], (err, results) => {
        if (err) return res.json([]);
        res.json(results);
    });
});

// 6.5 UPDATE BOOK API
app.put('/update-book', (req, res) => {
    const {
        id,
        title,
        author,
        price,
        campus,
        status,
        condition,
        description,
        image,
        images,
        purchase_date
    } = req.body;

    const sql = `
        UPDATE books SET
            title = ?,
            author = ?,
            price = ?,
            campus = ?,
            status = ?,
            condition_status = ?,
            description = ?,
            image_url = ?,
            images = ?,
            purchase_date = ?
        WHERE id = ?
    `;

    const values = [
        title,
        author,
        price,
        campus,
        status,
        condition,
        description,
        image,
        JSON.stringify(images || null),
        purchase_date,
        id
    ];

    db.query(sql, values, (err) => {
        if (err) {
            console.error("Update error:", err);
            return res.status(500).json({ success: false });
        }

        res.json({
            success: true,
            updatedBook: req.body
        });
    });
});

// 7. UPDATE BOOK STATUS
app.post('/update-book-status', (req, res) => {
    const { bookId, status } = req.body;
    const sql = "UPDATE books SET status = ? WHERE id = ?";
    db.query(sql, [status, bookId], (err) => {
        if (err) return res.status(500).json({ success: false });

        if (status === 'Sold') {
            // Fetch buyer IDs for this book
            db.query("SELECT buyer_id FROM requests WHERE book_id = ?", [bookId], (err, buyerRes) => {
                if (err) return res.status(500).json({ success: false });
                const buyerIds = buyerRes.map((r) => r.buyer_id);

                // Log activity
                db.query("SELECT seller_id, title, COALESCE((SELECT name FROM users WHERE id = seller_id), 'Seller') as sellerName FROM books WHERE id = ?", [bookId], (err, bRes) => {
                    if (bRes && bRes.length > 0) {
                    // logActivity removed
                    }
                    // Respond with buyer IDs
                    res.json({ success: true, buyerIds });
                });
            });
        } else {
            // Not sold, no buyer IDs
            res.json({ success: true, buyerIds: [] });
        }
    });
});

// FETCH SINGLE BOOK BY ID
app.get('/books/:id', (req, res) => {
    const id = req.params.id;

    const sql = "SELECT * FROM books WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (results.length === 0) {
            return res.json(null);
        }

        res.json(results[0]);
    });
});

// 8. REQUESTS APIs
app.post('/requests', verifyUser, (req, res) => {
    const { bookId, message } = req.body;
    const buyerId = req.user.id;

    const checkSql = "SELECT id FROM requests WHERE book_id = ? AND buyer_id = ? AND status = 'Pending'";
    db.query(checkSql, [bookId, buyerId], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length > 0) return res.json({ success: false, message: "Request already sent for this book." });

        const sql = "INSERT INTO requests (book_id, buyer_id, message, status) VALUES (?, ?, ?, 'Pending')";
        db.query(sql, [bookId, buyerId, message || "I would like to buy this book."], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            res.json({ success: true, message: "Request sent successfully" });

        });
    });
});

app.get('/requests/:userId', verifyUser, (req, res) => {
    const userId = req.params.userId;
    if (req.user.id.toString() !== userId.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const queries = [
        new Promise((resolve, reject) => {
            const sql = `SELECT r.id, r.book_id, r.buyer_id, r.status, r.created_at as date, r.message, 
                         b.title as book, b.seller_id,
                         COALESCE(u.name, 'Unknown') as user 
                         FROM requests r 
                         JOIN books b ON r.book_id = b.id 
                         LEFT JOIN users u ON b.seller_id = u.id 
                         WHERE r.buyer_id = ? ORDER BY r.created_at DESC`;
            db.query(sql, [userId], (err, results) => err ? reject(err) : resolve(results));
        }),
        new Promise((resolve, reject) => {
            const sql = `SELECT r.id, r.book_id, r.buyer_id, r.status, r.created_at as date, r.message, 
                         b.title as book, b.seller_id,
                         COALESCE(u.name, 'Unknown') as user 
                         FROM requests r 
                         JOIN books b ON r.book_id = b.id 
                         LEFT JOIN users u ON r.buyer_id = u.id 
                         WHERE b.seller_id = ? ORDER BY r.created_at DESC`;
            db.query(sql, [userId], (err, results) => err ? reject(err) : resolve(results));
        }),
        new Promise((resolve, reject) => {
            const sql = `SELECT id, title as book, price, purchase_date as date, 'Completed' as status 
                         FROM books WHERE seller_id = ? AND status = 'Sold' ORDER BY id DESC`;
            db.query(sql, [userId], (err, results) => err ? reject(err) : resolve(results));
        })
    ];

    Promise.all(queries)
        .then(([sent, received, sold]) => {
            console.log("Activity Tracker Debug - Sent Requests:", sent);
            console.log("Activity Tracker Debug - Received Requests:", received);
            
            const fmt = (arr) => arr.map(item => ({ ...item, date: new Date(item.date).toLocaleDateString() }));
            res.json({ sent: fmt(sent), received: fmt(received), sold: fmt(sold) });
        })
        .catch(err => {
            console.error("Activity Tracker Error:", err);
            res.status(500).json({ success: false, message: err.message });
        });
});

app.put('/requests/:id', verifyUser, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const sql = "UPDATE requests SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        // Updated status
        res.json({ success: true });
    });
});

// 8.5. ADMIN ACTIVITY API
app.get('/admin/activity', verifyAdmin, (req, res) => {
    const sql = `
        SELECT 
            CONCAT('User ', u.name, ' requested "', b.title, '"') AS activity, 
            r.created_at AS date
        FROM requests r
        JOIN users u ON r.buyer_id = u.id
        JOIN books b ON r.book_id = b.id
        ORDER BY r.created_at DESC 
        LIMIT 20
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(results);
    });
});

// Removed /activity POST as it relied on missing activity_logs table

// 9. SEED DEMO DATA
app.post('/seed-demo-data', (req, res) => {
    if (!IS_DEMO_MODE) return res.status(403).json({ message: "Seed only allowed in Demo Mode" });

    const books = [
        ['Database Systems', 'Silberschatz', 400, 'SJCE', '2023-01-01', 'Computer Science', 'Good', 'A must have.', 1, 'Demo User'],
        ['Operating Systems', 'Galvin', 350, 'SJCE', '2023-02-10', 'Computer Science', 'Like New', 'Core concepts.', 1, 'Demo User']
    ];

    const sql = `INSERT INTO books 
        (title, author, price, campus, purchase_date, category, condition_status, description, seller_id, seller_name, status) 
        VALUES ?`;

    const values = books.map(b => [...b, 'Available']);

    db.query(sql, [values], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: "Demo data seeded!" });
    });
});

// GET ALL USERS (Admin)
app.get('/admin/users', verifyAdmin, (req, res) => {
    const sql = "SELECT id, name, email, role, campus, phone, usn FROM users";

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        const mappedUsers = results.map(u => ({
            ...u,
            name: u.name || 'Unknown User'
        }));

        res.json(mappedUsers);
    });
});

app.delete('/admin/users/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM users WHERE id = ?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true });
    });
});

app.get('/admin/books', verifyAdmin, (req, res) => {
    const sql = "SELECT * FROM books ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(results);
    });
});

app.put('/admin/books/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const { title, author, price, condition_status, status, campus, image_url, images } = req.body;

    let sql = "UPDATE books SET ";
    let fields = [];
    let values = [];

    if (title !== undefined) { fields.push("title = ?"); values.push(title); }
    if (author !== undefined) { fields.push("author = ?"); values.push(author); }
    if (price !== undefined) { fields.push("price = ?"); values.push(price); }
    if (condition_status !== undefined) { fields.push("condition_status = ?"); values.push(condition_status); }
    if (status !== undefined) { fields.push("status = ?"); values.push(status); }
    if (campus !== undefined) { fields.push("campus = ?"); values.push(campus); }
    if (image_url !== undefined) { fields.push("image_url = ?"); values.push(image_url); }
    if (images !== undefined) { fields.push("images = ?"); values.push(JSON.stringify(images || null)); }

    if (fields.length === 0) return res.json({ success: true }); // nothing to update

    sql += fields.join(", ") + " WHERE id = ?";
    values.push(id);

    db.query(sql, values, (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true });
    });
});

app.delete('/admin/books/:id', verifyAdmin, (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM books WHERE id = ?";
    db.query(sql, [id], (err) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true });
    });
});

app.get('/admin/stats', verifyAdmin, (req, res) => {
    const queries = [
        new Promise((resolve, reject) => db.query("SELECT COUNT(*) as count FROM users", (err, res) => err ? reject(err) : resolve(res[0].count))),
        new Promise((resolve, reject) => db.query("SELECT COUNT(*) as count FROM books", (err, res) => err ? reject(err) : resolve(res[0].count))),
        new Promise((resolve, reject) => db.query("SELECT COUNT(*) as count FROM books WHERE status = 'Sold'", (err, res) => err ? reject(err) : resolve(res[0].count))),
        new Promise((resolve, reject) => db.query(`
            SELECT 
                SUM(status = 'Pending') AS pending,
                SUM(status = 'Accepted') AS accepted,
                SUM(status = 'Rejected') AS rejected
            FROM requests
        `, (err, res) => err ? reject(err) : resolve(res[0])))
    ];

    Promise.all(queries)
        .then(([usersCount, booksCount, soldBooksCount, requestStats]) => {
            res.json({
                users: usersCount,
                books: booksCount,
                sold: soldBooksCount,
                pending: requestStats.pending || 0,
                accepted: requestStats.accepted || 0,
                rejected: requestStats.rejected || 0
            });
        })
        .catch(err => {
            res.status(500).json({ success: false, message: err.message });
        });
});

// 10. VITE MIDDLEWARE (AI STUDIO REQUIRED)
async function setupVite() {
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });

        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');

        app.use(express.static(distPath));

        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(3000, () => {
        console.log("🚀 Server running on port 3000");
    });
}

setupVite();