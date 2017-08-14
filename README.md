# kannel-sms-email

Make sure you have kannel already istalled and properly configured, you can check the tutorial on my linkedin profile.

Assuming you are already in the this folder

- Make necessary changes that matches your modem and SMS Centre
```
sudo /usr/sbin/bearerbox kannel.conf &
sudo /usr/sbin/smsbox kannel.conf &
```

the cd into node folder
```
cd node/
npm install
node index.js
```
