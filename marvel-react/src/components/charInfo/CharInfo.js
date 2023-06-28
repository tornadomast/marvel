import PropTypes from 'prop-types';

import './charInfo.scss';
import { Component } from 'react';
import Error from '../error/Error';
import Spinner from '../spinner/Spinner';
import Skeleton from '../skeleton/Skeleton'
import MarvelService from '../../services/MarvelService';

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();
    componentDidMount() {
        this.updateChar();
    }
    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) { 
            this.updateChar();
        }
    }
    updateChar = () => {
        //деструктурируем charId c App.js
        const {charId} = this.props;
        if(!charId) { 
            return
        }

        this.onCharLoaded();

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)

    }

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

    render() {
        const{loading, error, char} = this.state;
        
        const skeleton = char || loading || error ? null : <Skeleton/>;
        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error || !char) ? <Viev char={char}/> : null
        return (
                <div className="char__info">
                {errorMessage}
                {skeleton}
                {spinner}
                {content}

                </div>
            )
    }
    
}

const Viev = ({char}) => {
    const {name, thumbnail, description, wiki, homepage, comics} = char
    let imgStyle = {'objectFit' : 'cover'};
    if (thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'}
        }
    return(
        <>
         <div className="char__basics">
            
                <img style ={imgStyle} src={thumbnail} alt={name}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            <ul className="char__comics-list">
                {comics.length > 0 ? null : 'Немає коміксів'}
                {
                    comics.map((item, i) => {
                        return (
                        <li key={i} className="char__comics-item">
                            {item.name}
                        </li>
                        )
                    })
                }
                
               
            </ul>
        </>
    )
}
CharInfo.propTypes = {
    charId: PropTypes.number
}
export default CharInfo;