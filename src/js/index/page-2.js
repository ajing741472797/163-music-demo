{
    let view = {
        el: '.page-2',
        init(){
            this.$el = $(this.el)
        },
        
        
        show(){
            this.$el.addClass('active')
        },
        hide(){
            this.$el.removeClass('active')
        },
        render(data){
            let n = 0
            let {songs} = data

            songs.map((song)=>{
              n++
              template =`
        <li>
        <div class="songNumber">${this.makeNumber(n)}</div>
        <div class="songContent">  
        <h3>{{song.name}}</h3>
        <p>
          <svg class="icon icon-sq">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-sq"></use>
          </svg>
          {{song.singer}} 
        </p>
        <a class="playButton" href="./song.html?id={{song.id}}">
          <svg class="icon icon-play">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-play"></use>
          </svg>
        </a>
        </div>
      </li>
        `
              let $li = $(template
                .replace('{{song.name}}', song.name)
                .replace('{{song.singer}}', song.singer)
                .replace('{{song.id}}', song.id)
              )
              this.$el.find('.hotMusicList>ol').append($li)
            })
        },
        makeNumber(n){
            if(n<10){
                n=`0${n}`
            }
            console.log(111)
            return n
        },
        activeNumber(){
            let $songsNumber = $('.hotMusicList').find('.songNumber')
            for(let i=0;i<=2;i++){
                $songsNumber.eq(i).addClass('active')
                console.log('jjjjjjjjj')
            }
        },
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
        },
        bindEventHub(){
            window.eventHub.on('selectTab',(tabName)=>{
                if(tabName === 'page-2'){
                    this.view.show()
                    this.view.activeNumber()
                    
                }else{
                    this.view.hide()
                }
            })
        }
    }
    controller.init(view, model)
}