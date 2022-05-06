# whatsactyl

_A bot to manage Pterodactyl panels via whatsapp!_

Many thanks to [ThisMe124](https://github.com/ThisMe124) for contributing so much to building this bot from scratch.

For now, maybe there are still many shortcomings, such as the command is not fully available for category applications and others, we really welcome if there are contributors who want to build this bot together.

> Bots will run better when used in private messages instead of in groups... But it's up to you!

## Instalation
- Clone this repository
```cli
git clone https://github.com/JastinXyz/whatsactyl
```
- Install the dependencies
```cli
npm install
```
- Fill in the configuration in [config.json]('./config.json') (See the configuration details [HERE](#Configuration))
- Run the bot
```cli
node .
```
- Scan the QR
- Enjoy!

## Configuration
Refer to [config.json]('./config.json')
```json
{
  "prefix": "!",
  "autoread": true,
  "mongodb": "",
  "ownerNumber": [""],
  "host": "https://domain.tld",
  "application": {
    "api_key": ""
  }
}
```

| Object | Type | Description |
|--------|------|-------------|
| prefix | `string` | your bot prefix |
| autoread | `string` | whether the bot will automatically mark the message as read. |
| mongodb | `string` | MongoDB database url |
| ownerNumber | `array` | List of numbers that can run commands in the category owner. |
| host | `string` | url to your host **(must use http:// or https:// as a prefix and at the end there is no slash but the last letter of your TLD)** |
| application.api_key | `string` | Your panel's API Key. This can be overridden using the `setapikey` command later. |

## Showcase

![img](./screenshot/showcase.jpeg)

## To Do
- [ ] Server create & delete.
- [ ] User create & delete.
- [ ] Location create, delete, details, list.
- [ ] Node create, delete, details, list.
- [ ] Allocation list, create, delete.
- [ ] idk, more commands mybe?

<hr/>
<div align="center">

_⭐️ it if you 👍️ it_ <br/>
_Minimal star atau fork bang kalo mau gunain_

</div>
