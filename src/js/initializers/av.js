{
let APP_ID = 'Pnw09xHWKgVu9QlV19HNpIbD-gzGzoHsz';
let APP_KEY = 'NMu7KTgETAovNUJ4aCBjisYx';

AV.init({
    appId: APP_ID,
    appKey: APP_KEY
});

// // 创建数据库
// var TestObject = AV.Object.extend('Playlist');
// // 创建一条数据
// var testObject = new TestObject();
// // 保存记录
// testObject.save({
//     name: 'test',
//     cover: 'test',
//     creatorId: 'test',
//     description: 'test',
//     songs: ['1','2']
// }).then(function (object) {
//     alert('LeanCloud Rocks!');
// }, ()=> alert('fuck'))
}