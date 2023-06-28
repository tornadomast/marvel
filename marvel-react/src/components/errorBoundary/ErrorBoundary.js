
//Предохранители ловят ошибки в методе рендер, в методах жизненных циклов и в конструктрах дочерних компоненов
//Не ловят ошибки которые произошли внутри отработчиков собитий, или внутри асинхронных функий


import { Component } from "react";
import Error from "../error/Error";
class ErrorBoundary extends Component {
    state = {
        error: false
    }

    

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: true
        })
    }
    render() {
        if(this.state.error) {
           return <Error/>
        }
        return this.props.children;
    }
}

export default ErrorBoundary;