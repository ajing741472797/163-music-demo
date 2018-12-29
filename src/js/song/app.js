{
    let view = {
        el: '#app',
  
    }
    let model = {
        data: {
           song: {
            id: '',
            name: '',
            singer: '',
            url: ''
           } ,
           status: 'paused'
        },
        get(id) {
            var query = new AV.Query('Song')
            return query.get(id).then((song)=>{
                Object.assign(this.data, {id:song.id, ...song.attributes}) 
                return song
            })
        }

    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            let id = this.getSongId()
            this.model.get(id).then(()=>{
                this.view.render(this.model.data)
                this.view.play()
            })
        },
        bindEvents(){
           
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


