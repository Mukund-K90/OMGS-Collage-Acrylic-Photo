const express = require('express');
const app = express();
const path = require('path');
const PORT = 1818;
const dotenv = require('dotenv');
dotenv.config();

app.set("view engine", 'ejs');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views/pages'));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    const dictionary = {
        item1: { image: "https://s.omgs.in/wp-content/uploads/2021/10/5-pics-acrylic-print-min-500x500.jpg", description: "5 Pics Collage Premium Acrylic Wall Photo", type: "5-pics" },
        item2: { image: "https://s.omgs.in/wp-content/uploads/2021/10/8-Collage-Portrait-Acrylic-Wall-Photo-min-500x500.jpg", description: "8 Collage Portrait Acrylic Wall Photo", type: "8-pics" },
        item3: { image: "https://s.omgs.in/wp-content/uploads/2021/10/2-Photo-Collage-Acrylic-min-500x500.jpg", description: "2 Photo Collage Acrylic Wall Photo", type: "2-pics" },
    };
    res.render("home", { dictionary });
});

const viewRoutes = require('./src/routes/viewRoutes');
app.use('/customize', viewRoutes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`))