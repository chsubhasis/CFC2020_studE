const complaintsRoutes = require('./complaints');
const questionsRoutes = require('./questions');
const sentimentsRoutes = require('./sentiments');

// list of routes
const listOfRoutes = [
    { url: '/complaints', method: 'GET', call: complaintsRoutes.fetchComplaintList },
    { url: '/complaints', method: 'POST', call: complaintsRoutes.addComplaint },
    { url: '/complaints/delete', method: 'PUT', call: complaintsRoutes.deleteComplaint },
    { url: '/questions', method: 'GET', call: questionsRoutes.fetchQuestionList },
    { url: '/sentiments', method: 'POST', call: sentimentsRoutes.addSentiments },
    { url: '/sentiments', method: 'GET', call: sentimentsRoutes.fetchSentiments }
];

/**
 * isRoutesExist
 * @description check if a route exist
 * @param req request object 
 * @param res response object
 */
const isRoutesExist = (req, res) => {
    return listOfRoutes.some(each => each.url === req.url && (each.method === req.method || req.method === 'OPTIONS'));
}

/**
 * doRoutesExecute
 * @description execute related functions for a route
 * @param req request object 
 * @param res response object
 */
const doRoutesExecute = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET', 'POST', 'PUT', 'DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Access-Control-Allow-Headers', 'Authorization');

    // if prefilght call send 200 success code
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    } else {
        (listOfRoutes.find(each => each.url === req.url && each.method === req.method)).call(req, res);
    }
}

module.exports = {
    isRoutesExist: isRoutesExist,
    doRoutesExecute: doRoutesExecute
}