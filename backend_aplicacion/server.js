let express = require('express')
let http = require('http')
let app = express()
paquetes = require('./Code/app')
var cors = require('cors')


/**
 * @brief Peticion para obtener los paquetes y su informacion
 */

app.use(cors())

app.get('/recommended', async (req,res) => {
    let result = await get_recommended();
    res.send(result);
    return res;
})

app.get('/top',async (req,res) =>{
    let result = await get_top_packs();
    res.send(result);
    return res;
})

app.get('/packs',async (req, res) => {
    const Origin = req.query.Origin;
    const Destiny = req.query.Destiny;
    const Checkin = req.query.Checkin;
    const CheckOut = req.query.CheckOut;
    const people = req.query.people;

    let result = await get_data(Origin,Destiny,Checkin,CheckOut,people);

    res.send(result);
    return res;
})

app.post('/save_pack', async (req,res) => {
    console.log(req.body)
    //const Pack = req.body.Pack;
    console.log("Paquete: " + Pack);

    let result = await save_pack(Pack);
    res.send(result)
    return res;

})

app.get('/send_email',async (req,res) => {
    let usermail=req.query.From;
    let title = req.query.Title;
    let message = req.query.Message;
    sendEmail(usermail,title,message);
})

async function get_recommended(){
    let result = await paquetes.get_recommended();
    return result;
}

async function get_top_packs(){
    let result = await paquetes.get_top_packs();
    return result;
}

async function get_data(origin,destiny,checkout,checkin,people){
    let result = await paquetes.get_packs(origin,destiny,checkin,checkout,parseInt(people));
    return result;
}

async function save_pack(pack){
    let result = await paquetes.save_pack(pack)
    return result;
}

function sendEmail(userMail,Title,Message){
    const nodemailer = require('nodemailer');
    console.log("DE:" + userMail)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'pack2flycustomer@gmail.com',
            pass: 'Jesus99nh' // naturally, replace both with your real credentials or an application-specific password
        }
    });

    const mailOptions = {
        from: 'pack2flycustomer@gmail.com',
        to: userMail,
        subject: Title,
        text: "**********This is a copy for you. We have received your message and We will answer you very soon!!*********" + "\n" + "---Your Message---" + "\n" +Message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

http.createServer(app).listen(8000, () => {
    console.log('Server started at http://localhost:8000');
});