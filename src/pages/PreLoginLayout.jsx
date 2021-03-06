import React from 'react';
import {hashHistory} from 'react-router';


export default class PreLoginLayout extends React.Component {

    static childContextTypes = {
        user: React.PropTypes.object
    };

    constructor(props, context) {
        super(props, context);

        this.handlerChange = this.handlerChange.bind(this);
        this.logout = this.logout.bind(this);

        this.state = {
            user: {
                loggedIn: false,
                username: "Default",
                id: "",
                token: null,
                socket: null,
                changeHandler: this.handlerChange,
                logout: this.logout
            }
        };
    }

    getChildContext() {
        return {
            user: this.state.user
        }
    }

    handlerChange(user) {
        this.setState({
            user: {
                loggedIn: user.loggedIn,
                username: user.username || this.state.user.username,
                id: user.id || this.state.user.id,
                socket: user.socket || this.state.user.socket,
                changeHandler: this.handlerChange,
                logout: this.logout
            }
        });
    }

    logout() {
        this.state.user.socket.emit("disconnect");
        this.setState({
            user: {
                loggedIn: false,
                username: "Default",
                token: null,
                socket: null,
                changeHandler: this.handlerChange,
                logout: this.logout
            }
        });
        hashHistory.push('/');
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}
