const Cloudant = require('@cloudant/cloudant');
const dbConfig = require('./db-config');
const { parse } = require('querystring');

// db connection
var cloudantDb = new Cloudant({
    url: dbConfig.url,
    plugins: {
        iamauth: {
            iamApiKey: dbConfig.iamApiKey
        }
    }
});
var chatTalkDb = cloudantDb.db.use(dbConfig.questionsDbName);


/**
 * fetchQuestionList
 * @description fetch all questions from database
 * @param req request object
 * @param res response object 
 */
const fetchQuestionList = (req, res) => {
    chatTalkDb.list({ include_docs: true })
        .then((body) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(body.rows.map(each => each.doc)));
        })
        .catch((err) => {
            res.statusCode = 500;
            res.end(err);
        });
}

module.exports = {
    fetchQuestionList: fetchQuestionList
}