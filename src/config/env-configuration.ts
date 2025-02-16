export default () => {
    return {
        environment: process.env.NODE_ENV,
        port: parseInt(process.env.PORT as string),
        jwtSecretKey: process.env.JWT_Secret_Key,
        //db TypeOrm config
        dbType: process.env.DB_TYPE,
        dbHost: process.env.DB_HOST,
        dbPort: process.env.DB_PORT,
        dbUsername: process.env.DB_USERNAME,
        dbPassword: process.env.DB_PASSWORD,
        dbName: process.env.DB_NAME,
        //db Mongoose config
        mongoURI: process.env.MONG_URI,
        // Mailing
        smtpEmail: process.env.SMTP_EMAIL,
        smtpEmailPassword: process.env.SMTP_EMAIL_PASSWORD

    }
}