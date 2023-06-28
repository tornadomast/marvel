import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

class RandomChar extends  Component  {
    state = {
        // name: null,
        // description: null,
        // thumbnail: null,
        // homepage: null,
        // wiki: null
        //оптимизируем вышестоящие данные
        char: {},
        loading: true,
        error: false
        }

componentDidMount() {
    this.updateChar();
   // this.timerId = setInterval(this.updateChar, 1000)
}
componentWillUnmount() {
  // clearInterval(this.timerId);
}
//создадим метод когда персонаж загрузился
    onCharLoaded = (char) => {
        this.setState({
            char, 
            loading:false
        })
    }
    onCharloading = () => {
        this.setState({
            loading:true
        })
    }
//созадим метод который обрабатывает ошибку
    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }
//создадим новое свойсво внутри класса
    marvelService = new MarvelService();
//создаем метод который обращается к серверу и обновляет данные по персонажу
    updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        this.onCharloading()
        this.marvelService
        //вызиваем в нем метод
        .getCharacter(id)
        .then(this.onCharLoaded)
        .catch(this.onError);
    }
    render () {
        const {char, loading, error} = this.state;
        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <Viev char={char}/> : null
        return (
        <div className="randomchar">
            {errorMessage}
            {spinner}
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button onClick={this.updateChar} className="button button__main">
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )
    }
}

const Viev = ({char}) => {
    const {name, thumbnail, description, wiki, homepage} = char;
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'}
        }
    return(
        <div className="randomchar__block">
                <img style={imgStyle} src={thumbnail} alt="Random character" className="randomchar__img"/>
                <div className="randomchar__info">
                    <p className="randomchar__name">{name}</p>
                    <p className="randomchar__descr">
                        {description}
                    </p>
                    <div className="randomchar__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
    )
}

export default RandomChar;