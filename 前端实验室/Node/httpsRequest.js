var http = require('https');
var querystring = require('querystring');
 
var postData = querystring.stringify({
    'content':'留言测试！',
    'cid':348,
    'mid':8837
});
 
var options = {
    hostname : 'www.imooc.com',
    port : 443,
    path : '/course/docomment',
    method : 'POST',
    headers :{
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Content-Length': postData.length,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'imooc_uuid=b1d0b655-2244-415b-98d0-c4d23a15201a; imooc_isnew_ct=1521727726; imooc_isnew=2; PHPSESSID=u1jvnli6emh0i7s5uqr59ippb0; IMCDNS=0; Hm_lvt_f0cfcccd7b1393990c78efdeebff3968=1527400633,1529072647; loginstate=1; apsid=YxZTliZTM1ZjFkZWM4NzQ4NmQ3N2I2MDFiNmE3ZGEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzUwNjgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxNjIxMTQwMTU5QHFxLmNvbQAAAAAAAAAAAAAAAAAAADQ3ZTM4YmE3ZGJlNWRjMzEyMmFmYmRlZjliMzk0YmM1B8wjWwfMI1s%3DMG; last_login_username=1621140159%40qq.com; mc_channel=banner; mc_marking=05f7e0629b52760542c16abf0b475fd9; UM_distinctid=16403d61ea1f8-0cf3672a1e3ba4-47e1137-100200-16403d61ea7294; CNZZDATA1273908995=606494770-1529069752-%7C1529069752; cninfo=uisheji3-a74ff4de9355773c8cd10c4191df3feb; Hm_lpvt_f0cfcccd7b1393990c78efdeebff3968=1529231914; cvde=5b1807b65ed28-233',
        'Host': 'www.imooc.com',
        'Origin': 'https://www.imooc.com',
        'Referer': 'https://www.imooc.com/video/8837',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest'
    }
};
 
var req = http.request(options,function (res) {
    console.log('Status: ' +  res.statusCode);
    console.log('Headers: ' +  JSON.stringify(res.headers));
 
    res.on('data',function (chunk) {
        console.log(Buffer.isBuffer(chunk));
        console.log(typeof chunk);
 
    });
    res.on('end',function () {
        console.log('评论完毕');
    });
 
});
 
req.on('error',function (e) {
    console.log('Error: ' + e.message );
});
req.write(postData);
req.end();