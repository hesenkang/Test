var http = require('http')
var Promise = require('bluebird')
var cheerio = require('cheerio')
var baseurl = 'http://www.imooc.com/learn/'
var basenumurl = 'http://www.imooc.com/course/AjaxCourseMembers?ids='
var url = 'http://www.imooc.com/learn/348'
 
var videoIds = [728, 637, 348, 259, 197, 134, 75]
 
function filterChapters(html, number) {
    var $ = cheerio.load(html)
 
    var chapters = $('.chapter')
 
    //console.log(chapters)
 
    var title = $('.path span').text()
 
    //console.log(title)
 
    // courseData = {
    //     title: title,
    //     number: number,
    //     videos: [{
    //         chapterTitle: '',
    //         videos: [
    //             title: '',
    //             id: ''
    //         ]
    //     }]
    // }
 
    var courseData = {
        title: title,
        number: number,
        chapters: []
    }
 
    chapters.each(function(item) {
        var chapter = $(this)
        var chapterTitle = chapter.find('h3').text().trim()
            //console.log(chapterTitle)
        var videos = chapter.find('.video').children('li')
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        }
 
        videos.each(function(item) {
            var video = $(this).find('.J-media-item')
            var videoTitle = video.text().split('\n')[2].trim()
                // console.log(videoTitle)
            var id = video.attr('href').split('video/')[1]
                // console.log(id)
 
            chapterData.videos.push({
                title: videoTitle,
                id: id
            })
        })
 
        courseData.chapters.push(chapterData)
    })
    return courseData
}
 
function printCourseInfo(coursesData) {
    coursesData.forEach(function(courseData) {
        var title = courseData.title
        var number = courseData.number
        console.log(title + "学习人数【" + number + "】\n")
    })
 
    coursesData.forEach(function(courseData) {
        var title = courseData.title
        console.log("===========【" + title + "】===========\n")
 
        var chapters = courseData.chapters
        chapters.forEach(function(item) {
            var chapterTitle = item.chapterTitle
 
            console.log(chapterTitle + '\n')
 
            item.videos.forEach(function(video) {
                console.log('   【' + video.id + '】' + video.title + '\n')
            })
        })
    })
}
 
function getPageAsync(url) {
    return new Promise(function(resolve, reject) {
        console.log('正在爬取' + url)
 
        http.get(url, function(res) {
            var html = ''
 
            res.on('data', function(data) {
                html += data
            })
 
            res.on('end', function() {
                //var courseData = filterChapters(html)
 
                //printCourseInfo(courseData)
                resolve(html)
            })
        }).on('error', function(e) {
            reject(e)
                //console.log('获取课程数据出错')
        })
    })
}
 
 
function getPageNumberAsync(url) {
    return new Promise(function(resolve, reject) {
        console.log('正在爬取网页人数' + url)
 
        http.get(url, function(res) {
            var num = ''
            res.on('data', function(data) {
                var dat = JSON.parse(data)
                num = dat.data[0].numbers
                    //console.log(num)
            })
 
            res.on('end', function() {
                resolve(num)
            })
        }).on('error', function(e) {
            reject(e)
        })
    })
}
 
function getCourseDataAsync(id) {
    return new Promise(function(resolve, reject) {
        var p1 = getPageAsync(baseurl + id)
 
        var p2 = getPageNumberAsync(basenumurl + id)
 
        Promise.all([p1, p2])
            .then(function(result) {
                var course = {
                    html: result[0],
                    number: result[1]
                }
                resolve(course)
 
                //console.log(fetchCourseArray)
            })
            .catch(function(err) {
                reject(err)
            })
    })
}
 
var fetchCourseArray = []
 
videoIds.forEach(function(id) {
    fetchCourseArray.push((getCourseDataAsync(id)))
})
 
Promise
    .all(fetchCourseArray)
    .then(function(pages) {
        var coursesData = []
 
        //console.log(pages)
 
        pages.forEach(function(course) {
            var courses = filterChapters(course.html, course.number)
 
            coursesData.push(courses)
        })
 
        coursesData.sort(function(a, b) {
            return a.number < b.number
        })
 
        //console.log(coursesData)
        printCourseInfo(coursesData)
    })