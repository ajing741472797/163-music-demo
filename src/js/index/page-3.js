{
    let view = {
        el: '.page-3',
        init(){
            this.$el = $(this.el)
        },
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        },
        renderSongList(result){
            $('.searchSongList>a').remove()
            result.map((item)=>{
                $aTag=$(`<a href="./song.html?id=${item.id}">
                <img src="./img/search.png" alt="">
                <p>${item.name}</p>
                </a>`)
                $('.searchSongList').append($aTag)
            })
        },
        renderNoSong(){
            this.$el.find('.searchSongList>a>p').text('sorry,该歌曲暂未收入')
        },
        isHotSong(){
            $('.hotSearch').removeClass('delActive')
            $('.searchSongList').addClass('delActive')
        },
        isSearch(){
            $('.hotSearch').addClass('delActive')
            $('.searchSongList').removeClass('delActive')
        },
        renderSearchText(value){
            this.$el.find('.searchSongList>p>span').text(value)
        },
        changeDelete(value){
            if(value.length===0){
                $('.deleteIcon').removeClass('active')
            }else{
                $('.deleteIcon').addClass('active')
            }
        }

    }

    let model = {
        data: {
            songs: []
        },

    find(){
        var query = new AV.Query('Song');
        return query.find().then((songs)=>{
            this.data.songs = songs.map((song)=>{
                return Object.assign({id: song.id}, song.attributes) // ...表示song.attributes有什么我就要什么
            })
            return songs
        })
    }
}
    let controller = {
        init(view, model){
            this.view = view
            this.view.init()
            this.model = model
            this.model.find().then(()=>{
                this.view.render(this.model.data)
            })
            this.bindEventHub()
            this.bindEvents()
        },
        bindEventHub(){
         
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-3'){
                    this.view.show()
                }else{
                    this.view.hide()
                }
            })
        },
        bindEvents(view,fn){
            let timer
            $(this.view.el).find('input[type="search"]').on('input',(e)=>{
                let $input=$(e.currentTarget)
                let value = $input.val().trim()
                if(timer){
                    clearTimeout(timer)
                }
                timer = setTimeout(()=>{
                    if(value.length===0){
                        this.view.changeDelete(value)
                        this.view.isHotSong()
                    }else{
                        this.view.changeDelete(value)
                        this.view.isSearch()
                        this.view.renderSearchText(value)  
                        this.search(value).then((result)=>{
                            let songNumber = result.length
                            if(songNumber==0){
                                this.view.renderNoSong()               
                            }else{
                                this.view.renderSongList(result)     
                            }
                        })
                    }

                },400)
            })


            $('.deleteIcon').on('click',()=>{
                $value=$(this.view.el).find('input[type="search"]').val("")
                this.view.changeDelete($value)
                this.view.isHotSong()
            })
        },
        search(keyword){
            return new Promise((resolve,reject)=>{
                let database = this.model.data
                console.log(database["songs"])
                let result = database["songs"].filter(function(item){
                    return item.name.indexOf(keyword)>=0 
                })
      
                setTimeout(function(){
                    resolve(result)
                },10)
            })
        }
    }
    controller.init(view, model)
}