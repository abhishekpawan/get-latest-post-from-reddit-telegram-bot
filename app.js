const request = require("request");
require("dotenv").config();
const fs = require("fs");
const { convert } = require("html-to-text");
const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });
let chat_id = 908936635;

let url = "https://www.reddit.com/r/marvelmemes/new";

let postCaption = "abc";
let latestPostData = {};

const gettingLatestRedditPost = () => {
  request(url, (error, response, body) => {
    // Printing the error if occurred
    if (error) console.log(error);

    // Printing status code
    // console.log(response.statusCode);

    // storing the response body
    if (response.statusCode === 200) {
      //writing whole data in  index.html
      // fs.writeFile("index.html", body, (err) => {
      //     if (err) console.log(err);
      //     else {
      //       console.log("1st step success. Whole data written\n");
      //     }
      //   });
      if (body.includes("_1poyrkZ7g36PawDueRza-J _11R7M_VOgKO1RJyRSRErT3")) {
        // console.log("latest post is present\n");

        let latestPostString = body.split(
          "_1poyrkZ7g36PawDueRza-J _11R7M_VOgKO1RJyRSRErT3"
        );

        //   fs.writeFile("index2.html", latestPostString[1], (err) => {
        //     if (err) console.log(err);
        //     else {
        //       console.log("2st step success. body data written\n");
        //     }
        //   });

        if (latestPostString[1].includes("Post image")) {
          // console.log("Latest post is an image\n");
          //getting caption of the latest post
          let latestPostCaption = latestPostString[1]
            .split('_eYtD2XCVieq6emjKBH3m">')[1]
            .split("</h3>")[0];

          if (postCaption === latestPostCaption) {
            return 0;
          } else {
            latestPostData.caption = latestPostCaption;
            postCaption = latestPostCaption;
            const html = latestPostString[1];
            const text = convert(html, {
              wordwrap: 130,
            });

            let latestPostImageUrl = text
              .split("Post image")[1]
              .split("/r/marvelmemes")[0]
              .split("[")[1]
              .split("]")[0];

            latestPostData.image_url = latestPostImageUrl;

            console.log(latestPostData);
            bot.sendMessage(
              chat_id,
              `Caption:${latestPostData.caption} \nImage Link:${latestPostData.image_url}`
            );
          }

          // console.log(latestPostCaption);

          // console.log(latestPostUrl); //
        } else {
          return console.log("Latest post is not an image\n");
        }
      } else {
        return console.log("latest post is not present\n");
      }
    } else {
      console.log("getting html data of url failed!\n");
    }
  });
};

bot.on("message", (message) => {
  console.log(message.text);
  console.log(message.from.id);
  if (message.text === "/start") {
    setInterval(() => {
      gettingLatestRedditPost();
    }, 10000);
  }
});
