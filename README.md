# OAuth2-NodeJS-XSUAA
Protect NodeJS Application with OAuth2 using BTP XSUAA Service | Approuter

This open prject for enabling OAuth2 Authentication as well adding scope to user role to limit view access for specific api endpoint.

## installation

```
git clone https://github.com/developedbysom/OAuth2-NodeJS-XSUAA.git
cd approter
npm i
cd srv
npm i
```
* To create XSUAA service using role template: 

CLI command:
```
cd security
cf create-service xsuaa application xsuaa-emp-list -c xs-security/json
```

## To run this application locally:

Create a file within approuter with name as `default-env.json` and just copy the destinaiton part from manifest.yaml and VCAP service details from 
cloud BTP. 
So now if you run command
```
cd approuter
npm run start
```
This will run the approuter locally and will fetch node js api response all the way from cloud BTP
