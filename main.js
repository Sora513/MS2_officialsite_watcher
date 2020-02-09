//Login
const Discord = require('discord.js');
const client = new Discord.Client();
const token = '<YOUR_TOKEN>';
//define
const ch_name = "official_website";
var jsondata;
var oldjsondata;
var data = new Array(10);
var olddata = new Array(10);
var TF = new Array(10);
let reply_text;
var statecode = "200";
var oldstatecode = "200";
var chcheck = false;
//request(Node.js)
var request = require('request');


function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

client.on('ready', () => {
    console.log('ready...');
    client.channels.forEach(channel => {
        if (channel.name === ch_name) {
             //channel.send("不具合が発生したため、当Discord Botのメンテナンスを行い問題箇所を修正しました。\r今後ともよろしくお願い致します。--sora513")
            return;
        }
        return;
    })
    getinfo();
});
client.on('message', message => {
    if (message.author.bot) {
        return;
    }
    if (message.content === 'MS2大丈夫？' || message.content === 'MS2大丈夫?') {
        message.guild.channels.array().forEach(channel => {
            if (channel.name === ch_name) {
                chcheck = true;
                return;
            }
            return;
        })
        if (chcheck==true) {
            reply_text = "大丈夫です！！"
            message.reply(reply_text)
                .then(message => console.log(`Sent message: ${reply_text}`))
                .catch(console.error);
        } else {
            reply_text = "official_websiteテキストチャンネルが用意されていないようです。"
            message.reply(reply_text)
                .then(message => console.log(`Sent message: ${reply_text}`))
                .catch(console.error);
        }
        chcheck = false;
        return;
    } else if (message.content==='MS2まだメンテ？'||message.content==='MS2まだメンテ?') {
        if (statecode == "200") {
            reply_text = "メンテナンスは終了しています！" + "\n" + "https://maplestory2.nexon.co.jp";
            message.reply(reply_text)
            .then(message => console.log(`Sent message: ${reply_text}`))
            .catch(console.error);
            return;
        } else if (statecode == "503") {
            reply_text = "まだメンテナンス中です！\nメンテナンスが終了した際に通知します！";
            message.reply(reply_text)
            .then(message => console.log(`Sent message: ${reply_text}`))
            .catch(console.error);
            return;
        } else {
            reply_text = "例外的な状況が発生しています。\nHTTPS ERROR:"+statecode;
            message.reply(reply_text)
            .then(message => console.log(`Sent message: ${reply_text}`))
            .catch(console.error);
            return;
        }
    }
});
function getinfo() {
    var option = {
        url: 'https://maplestory2.nexon.co.jp/api/news?query=&target=&category=&page=1',
    }
    request(option, function (error, response, body) {
        if (response != undefined) {
            
            console.log("refleshed");
            oldstatecode = statecode;
            statecode = response.statusCode;
            if (statecode == "200" && oldstatecode == "503") {
                reply_text = "メンテナンスが終了しました！" + "\n" + "https://maplestory2.nexon.co.jp";
                client.channels.forEach(channel => {
                    if (channel.name === ch_name) {
                        channel.send(reply_text)
                            .then(message => console.log(`Sent message: ${reply_text}`))
                            .catch(console.error);
                        return;
                    }
                    return;
                })
            } else if (statecode == "503" && oldstatecode == "200") {
                reply_text = "メンテナンスが始まりました。";
                client.channels.forEach(channel => {
                    if (channel.name === ch_name) {
                        channel.send(reply_text)
                            .then(message => console.log(`Sent message: ${reply_text}`))
                            .catch(console.error);
                        return;
                    }
                    return;
                })
            }
            if (response.statusCode != "200") {
                console.log("HTTP ERROR: " + response.statusCode);
            } else if (isJson(body) === true) {
                console.log("Hi")
                oldjsondata = jsondata;
                jsondata = JSON.parse(body);
                if (oldjsondata == undefined) {
                    oldjsondata = jsondata;
                    reply_text = "このチャンネルに更新を投稿します"
                    client.channels.forEach(channel => {
                        if (channel.name === ch_name) {
                            // channel.send(reply_text)
                            // .then(message => console.log(`Sent message: ${reply_text}`))
                            // .catch(console.error);
                            return;
                        }
                        return;
                    })
                }
                for (var i = 0; i < 10; i++) {
                    data[i] = jsondata.list[i].newsTitle;
                    olddata[i] = oldjsondata.list[i].newsTitle;
                }
                for (var i = 0; i < 10; i++) {
                    TF[i] = olddata.includes(data[i]);
                    if (TF[i] == true) {
                    } else {
                        reply_text = "サイトが更新されました! " + "\n" + data[i] + "\n" + "https://maplestory2.nexon.co.jp" + jsondata.list[i].newsDetailUrl;
                        client.channels.forEach(channel => {
                            if (channel.name === ch_name) {
                                channel.send(reply_text)
                                    .then(message => console.log(`Sent message: ${reply_text}`))
                                    .catch(console.error);
                                return;
                            }
                            return;
                        })
                    }
                }

            }
        } else {
            client.channels.forEach(channel => {
                if (channel.name === "かいはつ") {
                    channel.send("不具合が発生しました");
                    return;
                }
                return;
            })
        }
        });

    return;
}
client.login(token) .then(console.log).catch(console.error);
setInterval(getinfo,60000);