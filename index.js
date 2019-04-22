const request = require('request')
const cheerio = require('cheerio');
const fs = require('fs');
const webUrl = 'https://bbs.hupu.com/selfie-type3'
// 创建一个生成目录 用来存放小姐姐照片
fs.exists('dist', res => {
    if (!res) fs.mkdirSync('dist');
})

// 写一个方法 用来保存图片
function saveFile(url) {
    if (!url) return
    request(url).pipe(fs.createWriteStream('./dist/' + Date.now() + '.png'));
}
for (var i = 0; i < 10; i++) {
    request(webUrl + '-' + i, (error, response, body) => {
        let $ = cheerio.load(body)
        var linkArr = $(".titlelink.box .truetit");
        for (var i = 1; i < linkArr.length; i++) {
            request('https://bbs.hupu.com' + $(linkArr[i]).attr('href'), (error, response, body) => {
                let $ = cheerio.load(body);
                var img = $('.quote-content img');
                for (var j = 0; j < img.length; j++) {
                    saveFile($(img[j]).attr('src'))
                }
            })
        }
    })
}