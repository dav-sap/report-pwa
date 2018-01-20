const functions = require('firebase-functions');

// var admin = require("firebase-admin");
// var db = admin.database();
// var ref = db.ref("server/saving-data/fireblog");
// var usersRef = ref.child("users");
//
exports.addUser = functions.https.onRequest((req, res) => {
    usersRef.set({
        dav_sap: {
            location: "JER",
            full_name: "David Saper"
        },
    })
});
exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onWrite(event => {
        // Grab the current value of what was written to the Realtime Database.
        const original = event.data.val();
        console.log('Uppercasing', event.params.pushId, original);
        const uppercase = original.toUpperCase();
        // You must return a Promise when performing asynchronous tasks inside a Functions such as
        // writing to the Firebase Realtime Database.
        // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
        return event.data.ref.parent.child('uppercase').set(uppercase);
    });
'use strict';
const nodemailer = require('nodemailer');
exports.sendStatusUpdate = functions.https.onRequest((req, res) => {

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'wizmumford@gmail.com',
                pass: 'black1959'
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: 'wizmumford@gmail.com', // sender address
            to: 'david.saper@intel.com', // list of receivers
            subject: 'Hello ✔', // Subject line
            text: 'Hello world?', // plain text body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.status(200).send(`Email Sent`);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });

});
