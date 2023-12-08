var path = require('path');

module.exports = function (req, res, next) {
    try {
        const options = {
            root: path.join(__dirname, '../../holding_cost_uploads/')
        };

        const fileName = req.params.filename;
        res.sendFile(fileName, options, function (err) {
            if (err) {
                next(err);
            } else {
                console.log('Sent:', fileName);
            }
        });
    } catch (e) {
        console.log(e.message);
        res.status(500).end();
    }
}