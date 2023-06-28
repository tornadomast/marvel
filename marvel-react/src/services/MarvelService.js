

class MarvelService {
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _apiKey = 'apikey=fbe077ad515a7ec515f7bed2552f1525'
    //базовый отступ для персонажей
    _baseOffset = 200
    getResource = async(url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`)
        }
        return await res.json();
    }
    //запрос для получения всех персонажей с базы данных
    getAllCharacters = async (offSet = this._baseOffset) => {
        const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=${offSet}&${this._apiKey}`);
        return res.data.results.map(this._transformCharacter)
    } 

    //сформируем запрос для получения одного конкретного персонажа по айди
    getCharacter = async (id) => {
        const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transformCharacter(res.data.results[0])
    }
    //с этого метода возвращается чистый обьект только с теми данными что мне нужны
    _transformCharacter = (res) => {
        return{
            id: res.id,
            name: res.name,
            description: res.description ? `${res.description.slice(0, 200)}...` : 'Sorry, is not description for ths character',
            thumbnail:  res.thumbnail.path + '.' + res.thumbnail.extension,
            homepage: res.urls[0].url,
            wiki: res.urls[1].url,
            comics: res.comics.items
        }
                
    }
}

export default MarvelService;