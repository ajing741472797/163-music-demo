{
    let view = {
        el: '#songList-container',
        template: `
        <ul class="songList">
        </ul>
        `,
        render(data){
            let $el = $(this.el)
            $el.html(this.template)
            let {songs, selectedSongId} = data
            let liList = songs.map((song)=>{
               let $li = $('<li></li>').text(song.name).attr('data-song-id', song.id)

                if(song.id === selectedSongId){$li.addClass('active')}
               return $li
            })
            $el.find('ul').empty()
            liList.map((domLi)=>{
                $el.find('ul').append(domLi)
            })
        },
     
        clearActive(){
            $(this.el).find('.active').removeClass('active')
        }
    }

    let model = {
        data: {
            songs: [ ],
            selectSongId: undefined,
        },
        //查询
        find(){
            var query = new AV.Query('Song');
            return query.find().then((songs)=>{
                this.data.songs = songs.map((song)=>{
                    return {id: song.id, ...song.attributes} // ...表示song.attributes有什么我就要什么
                })
                return songs
            })
        }
    }
    let controller = {
        init(view, model){
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.getAllSongs()
        },
       
        bindEvents(){
            $(this.view.el).on('click', 'li', (e)=>{
                let songId = e.currentTarget.getAttribute('data-song-id')
                this.model.data.selectedSongId = songId
                this.view.render(this.model.data)


                let data
                let songs = this.model.data.songs
                for(let i = 0;i<songs.length;i++){
                    if(songs[i].id === songId){
                        data = songs[i]
                        break
                    }
                }
                // console.log('for循环结束后的 data')
                // console.log(data)
                //深拷贝
                window.eventHub.emit('select', JSON.parse(JSON.stringify(data)))
            })
         },
        bindEventHub(){
            window.eventHub.on('create',(data)=>{
                this.model.data.songs.push(data)
                this.view.render(this.model.data)
                
            })
            window.eventHub.on('new',(data)=>{
                this.view.clearActive()
            })
            window.eventHub.on('update',(song)=>{
                let songs = this.model.data.songs
                for(let i=0;i<songs.length;i++){
                    if(songs[i].id === song.id){
                        Object.assign(songs[i],song) //把song的值都赋给song[i]
                    }
                }
                this.view.render(this.model.data)
            })
        },
        getAllSongs(){
            this.model.find().then(()=>{
                this.view.render(this.model.data)//查询
            })
        }
    }
    controller.init(view, model)
}