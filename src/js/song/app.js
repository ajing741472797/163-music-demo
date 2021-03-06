{
    let view = {
        el: '#app',
        init(){
            this.$el = $(this.el)
        },
        render(data){
            
            let {song, status} = data
            this.$el.css('background-image', `url(${song.background})`)
            this.$el.find('img.cover').attr('src',song.cover)
            if(this.$el.find('audio').attr('src') !== song.url){//同一首歌不改src，这样暂停歌曲不会重置 
               let audio =  this.$el.find('audio').attr('src',song.url).get(0)//get(0)就是audio
               audio.onended = ()=>{
                    window.eventHub.emit('songEnd')//歌曲结束使旋转动画停止
                }
               audio.ontimeupdate = ()=>{   //ontimeupdate 歌曲或视频当前的播放位置发送改变时触发
                   this.showLyric(audio.currentTime)
               }
            }
            if(status === 'playing'){
             this.$el.find('.disc-container').addClass('playing')
             this.$el.find('.disc-container .pointer').removeClass('active')

            }else{
             this.$el.find('.disc-container').removeClass('playing')
             this.$el.find('.disc-container .pointer').addClass('active')
            }
            
            this.$el.find('.song-description>h1').text(song.name + "-" + song.singer)
            console.log(song)

            let {lyrics} = song

            lyrics.split('\n').map((string)=>{
                let p = document.createElement('p')
                let regex = /\[([\d:.]+)\](.+)///正则
                let matches = string.match(regex) //字符串匹配正则
                if(matches){
                    p.textContent = matches[2]
                    let time = matches[1]
                    let parts = time.split(':')
                    let minutes = parts[0]
                    let seconds = parts[1]
                    let newTime = parseInt(minutes,10) * 60 + parseFloat(seconds,10)
                    p.setAttribute('data-time', newTime)//等于时间轴
                }else{
                    p.textContent = ''
                }
                this.$el.find('.lyric>.lines').append(p)
            })
        
        },
        showLyric(time){
            let allP = this.$el.find('.lyric>.lines>p')
            
            for(let i =0;i<allP.length;i++){
                if(i === allP.length-1){//如果是最后一行就显示最后一行
                    console.log(allP[i])
                    break
                }else{
                    let currentTime = allP.eq(i).attr('data-time')
                let nextTime = allP.eq(i+1).attr('data-time')
                if(currentTime <= time && time < nextTime){
                    let p = allP[i]
                    let pHeight = p.getBoundingClientRect().top//getBoundingClientRect DOM API 获取当前元素距离屏幕的位置
                    let linesHeight = this.$el.find('.lyric>.lines')[0].getBoundingClientRect().top
                    let height = pHeight - linesHeight
                    this.$el.find('.lyric>.lines').css({
                        transform: `translateY(${- (height - 25)}px)`
                    })
                    $(p).addClass('active').siblings('.active').removeClass('active')
                    break
                }
                }
            }
        },
        
        play(){
            this.$el.find('audio')[0].play()//audio[0] audio中的dom元素
        },
        pause(){
            this.$el.find('audio')[0].pause()
        }
        
  
    }
    let model = {
        data: {
           song: {
            id: '',
            name: '',
            singer: '',
            url: ''
           } ,
           status: 'playing'
        },
        get(id) {
            var query = new AV.Query('Song')
            return query.get(id).then((song)=>{
                // Object.assign(this.data.song, {id: song.id, ...song.attributes}) 
                      Object.assign(this.data.song, ({id: song.id}, song.attributes)) // ...表示song.attributes有什么我就要什么
             
                return song
            })
            
        }
        
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEvents()
        },
        bindEvents(){
            $(this.view.el).on('click','.icon-play',()=>{
                this.model.data.status = 'playing'
                this.view.render(this.model.data)
                this.view.play()
            })
            $(this.view.el).on('click','.icon-pause',()=>{
                this.model.data.status = 'pause'
                this.view.render(this.model.data)
                this.view.pause()
            })
          
            window.eventHub.on('songEnd', ()=>{
                this.model.data.status = 'pause'
                this.view.render(this.model.data)
            })
        },
        getSongId() {
            let search = window.location.search
            if (search.indexOf('?') === 0) {
                search = search.substring(1)
            }

            let array = search.split('&').filter((v => v))//filter可以过滤出空字符串
            let id = ''

            for (let i = 0; i < array.length; i++) {
                let keyValue = array[i].split('=')
                let key = keyValue[0]
                let value = keyValue[1]
                if (key === 'id') {
                    id = value
                    break
                }
            }
            return id
        }

    }
    controller.init(view, model)
}


