import './charList.scss';
import React, { Component } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

import PropTypes from 'prop-types';


class CharList extends Component {
    
    state = {
        charlist: [],
        loading: true,
        error: false,
        //загрузка новых елементов
        newItemLoading: false,
        offSet: 200,
        charEnded: false
    }
//создадим новое свойсво внутри класса
    marvelService = new MarvelService();

componentDidMount() {
        // this.marvelService.getAllCharacters()
        // .then(this.onCharListLoaded)
        // .catch(this.onError)
        //заменили все выше кодом ниже
        this.onRequest()
}
//запрос когда пользователь кликает на кнопочку
onRequest = (offSet) => {
    this.onCharListLoading()
    this.marvelService.getAllCharacters(offSet)
        .then(this.onCharListLoaded)
        .catch(this.onError)
}
onCharListLoading = () => {
    this.setState({
        newItemLoading: true
    })
}
onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
        ended = true;
    }

    this.setState(({offSet, charlist}) => ({
        charlist: [...charlist, ...newCharList],
        loading:false,
        newItemLoading: false,
        offSet: offSet + 9,
        charEnded: ended
    }))
}
onError = () => {
    this.setState({
        error: true,
        loading: false
    })
}

itemRefs = [];

setRef = (ref) => {
    this.itemRefs.push(ref)
}

focusOnItem = (id) => {
    this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
    this.itemRefs[id].classList.add('char__item_selected');
    this.itemRefs[id].focus();
}
// Этот метод создан для оптимизации, 
// чтобы не помещать такую конструкцию в метод render
renderItems(arr) {
    const items = arr.map((item, i) => {
        let imgStyle = {'objectFit' : 'cover'};
        if (item.thumbnail ==='http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            imgStyle = {'objectFit' : 'unset'}
        }
        return(
            <li
                className="char__item"
                key={item.id}
                tabIndex={0}
                ref={this.setRef}
                onClick={() => {
                    this.props.onCharSelected(item.id)
                    this.focusOnItem(i)
                    }}
                onKeyDown  ={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            this.props.onCharSelected(item.id);
                            this.focusOnItem(i);
                        }
                    }}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
            </li>
        )
    });
     // А эта конструкция вынесена для центровки спиннера/ошибки
        return(
                <ul className="char__grid">
                    {items}
                </ul>
            )
}
        
    render() {
        const {charlist, loading, error, offSet, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charlist);

        const errorMessage = error ? <Error/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? items: null;
        return (
        <div className="char__list">
            {content}
            {errorMessage}
            {spinner}
            <button 
                className="button button__main button__long"
                disabled = {newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => this.onRequest(offSet)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
    }
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;