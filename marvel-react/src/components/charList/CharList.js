import './charList.scss';
import React, { useState, useEffect, useRef } from 'react';
import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import Error from '../error/Error';

import PropTypes, { func } from 'prop-types';


const CharList = (props) => {

    const[charlist, setcharlist] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, seterror] = useState(false);
    const[newItemLoading, setnewItemLoading] = useState(false);
    const[offSet, setoffSet] = useState(200);
    const[charEnded, setcharEnded] = useState(false);
    
//создадим новое свойсво внутри класса
   const marvelService = new MarvelService();

   useEffect(() => {
    onRequest();
      //когда оставляем тут пустой массив функция віполнится только один раз  
   }, [])


//запрос когда пользователь кликает на кнопочку
const onRequest = (offSet) => {
    onCharListLoading()
    marvelService.getAllCharacters(offSet)
        .then(onCharListLoaded)
        .catch(onError)
}
const onCharListLoading = () => {
    setnewItemLoading(true);

}
const onCharListLoaded = (newCharList) => {
    let ended = false;
    if (newCharList.length < 9) {
        ended = true;
    }
    setcharlist(charlist => [...charlist, ...newCharList]);
    setLoading(loading => false);
    setnewItemLoading(newItemLoading => false);
    setoffSet(offSet => offSet + 9);
    setcharEnded(charEnded => ended)
}
const onError = () => {
    seterror(true);
    setLoading(false);
}

const itemRefs = useRef([]);

// setRef = (ref) => {
//     this.itemRefs.push(ref)
// }

const focusOnItem = (id) => {
    itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
}
// Этот метод создан для оптимизации, 
// чтобы не помещать такую конструкцию в метод render
function renderItems(arr) {
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
                ref={el => itemRefs.current[i] = el}
                onClick={() => {
                    props.onCharSelected(item.id)
                    focusOnItem(i)
                    }}
                onKeyDown  ={(e) => {
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
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
        
        const items = renderItems(charlist);

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
                    onClick={() => onRequest(offSet)}>
                    <div className="inner">load more</div>
                </button>
            </div>
    )
    
}
CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}
export default CharList;