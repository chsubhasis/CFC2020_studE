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
var chatTalkDb = cloudantDb.db.use(dbConfig.dbName);


/**
 * collectRequestData
 * @description parse request body data
 * @param req request object
 * @param callback callback function  
 */
function collectRequestData(req, callback) {
    const FORM_URLENCODED = 'application/x-www-form-urlencoded';
    const JSON_BODY = 'application/json';
    const contentType = req.headers['content-type'];
    if ([FORM_URLENCODED, JSON_BODY].indexOf(contentType) > -1) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (contentType === JSON_BODY) {
                callback(JSON.parse(body));
            } else {
                callback(parse(body));
            }
        });
    }
    else {
        callback(null);
    }
}

/**
 * fetchComplaintList
 * @description fetch all complaints from database
 * @param req request object
 * @param res response object 
 */
const fetchComplaintList = (req, res) => {
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

/**
 * addComplaint
 * @description add a complaint analysis to database
 * @param req request object
 * @param res response object 
 */
const addComplaint = (req, res) => {
    collectRequestData(req, data => {
        console.log(data);
        chatTalkDb.insert(data)
            .then((body) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
            })
            .catch((err) => {
                res.statusCode = 500;
                res.end(err);
            });
    });
}

/**
 * deleteComplaint
 * @description delete a complaint from database
 * @param req request object
 * @param res response object 
 */
const deleteComplaint = (req, res) => {
    collectRequestData(req, data => {
        chatTalkDb.destroy(data.id, data.rev)
            .then((body) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true }));
            })
            .catch((err) => {
                res.statusCode = 500;
                res.end(err);
            });
    });
}

module.exports = {
    fetchComplaintList: fetchComplaintList,
    addComplaint: addComplaint,
    deleteComplaint: deleteComplaint
}