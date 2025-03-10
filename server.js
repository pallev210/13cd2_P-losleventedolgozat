const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
 
const app = express();
app.use(cors());
app.use(express.json()); 
 

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    port: "3306",
    password: "",
    database: "felveteli"
});
 

app.get("/", (req, res) => {
    res.send("A szerver müködik");
});
 
app.get("/v", (req, res) => {
    const sql = `
        SELECT d.nev, t.agazat,
               (d.hozott + d.kpmagy + d.kpmat) AS osszpont
        FROM diakok d
        JOIN jelentkezesek j ON d.oktazon = j.diak
        JOIN tagozatok t ON j.tag = t.akod
        ORDER BY d.nev ASC
    `;
 
    db.query(sql, (err, result) => {
        if (err) return res.json(err);
        return res.json(result);
    });
});
 

app.get("/v2", (req, res) => {
    const sql = `
        SELECT t.agazat, COUNT(*) AS jelentkezok_szama
        FROM jelentkezesek j
        JOIN tagozatok t ON j.tag = t.akod
        WHERE t.agazat = 'Jószakma Szakgimnázium nyelvi előkészítő'
        AND j.hely = 1
        GROUP BY t.agazat
    `;
 
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Hiba a lekérdezés során:", err);
            return res.status(500).json({ error: "Sikertelen adatbázis lekérdezés" });
        }
        return res.status(200).json(result);
    });
});
 
app.listen(3000, () => {
    console.log("A szerver a 3000 porton fut!");
});