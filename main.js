/**
 * Created by wangzhuo on 2017/8/26.
 */
/**
 * Created by wangzhuo on 2017/8/8.
 */
var cheerio = require('cheerio');
var superagent = require('superagent')
var async = require('async')
//URLs
var base = 'http://www.liudatxt.com/so/1/'
var host = 'http://www.liudatxt.com'
var fs = require('fs')
var content = ''

function chapter(item,callback) {
    superagent
        .get(host+item.url)
        .end(function (err, res) {
            var $ = cheerio.load(res.text)
            var text = $('#content ').text()
            content+= '\n'+item.title+'\n'
            content+=text
            callback()
        })
}

function main() {
    var items = []
    superagent
        .get(base)
        .end(function (err, res) {
            var $ = cheerio.load(res.text)
            $('#readerlist ').find('li').each(function (idx, element) {
                $element = $(element)
                var url = $element.find('a').attr('href')
                var title = $element.find('a').attr('title')
                items.push({
                    url: url,
                    title: title
                })
            })


            async.mapLimit(items, 1, function (item, callback) {
                chapter(item, callback)
            }, function (err, result) {
                fs.writeFileSync('novel.txt', content);
                console.log('OK')
            });
        })
}
main()
