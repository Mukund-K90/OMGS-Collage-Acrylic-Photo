const express = require('express');
const router = express.Router();

router.get('/:page', (req, res) => {
    const page = req.params.page;
    res.render(page);
});


module.exports = router;