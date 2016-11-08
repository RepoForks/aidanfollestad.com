var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.render('index', {title: 'Welcome', homeActive: true});
});

router.get('/about', function (req, res) {
    res.render('about', {title: 'About', aboutActive: true});
});

router.get('/great-dictator', function (req, res) {
    res.render('greatdictator', {title: 'Great Dictator'});
});

router.get('/skills', function (req, res) {
    res.render('skills', {title: 'Skills', skillsActive: true});
});

router.get('/work', function (req, res) {
    res.render('work', {title: 'Work', workActive: true});
});

router.get('/projects', function (req, res) {
    res.render('projects', {title: 'Projects', projectsActive: true});
});

router.get('/social', function (req, res) {
    res.render('social', {title: 'Social', socialActive: true});
});

router.post('/test_webhook', require('multer')({dest: 'public/uploads/'}).any(), function (req, res) {
    console.log('Headers: ' + JSON.stringify(req.headers, null, 4));
    console.log('Body: ' + JSON.stringify(req.body, null, 4));
    res.send({success: true});
});

module.exports = router;