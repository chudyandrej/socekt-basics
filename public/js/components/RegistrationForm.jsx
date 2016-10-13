import React from 'react';

import CloseFormButton from './CloseFormButton.jsx';
import Form from './Form.jsx';

class RegistrationForm extends Form {

    constructor(props, context) {
        super(props, context);

        this.state = {
            username: null,
            password: null,
            passwordCheck: null,
            email: null,
            valid: true,
            validUsername: true,
            weakPassword: false,
            registerSuccess: false,
            buttonName: "Register"
        };

        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordCheckChange = this.handlePasswordCheckChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.checkPasswordMatch = this.checkPasswordMatch.bind(this);
        this._registerAllowed = this._registerAllowed.bind(this);
        this.register = this.register.bind(this);
    }

    handleUsernameChange(evt) {
        this.setState({
            username: evt.target.value
        });
    }

    handlePasswordChange(evt) {
        //TODO check length of password
        //TODO if short =>  this.state.weakPassword = true
        this.setState({
            password: evt.target.value
        });
    }

    handlePasswordCheckChange(evt) {
        this.setState({
            passwordCheck: evt.target.value
        });
    }

    handleEmailChange(evt) {
        this.setState({
            email: evt.target.value
        });
    }

    checkPasswordMatch() {
        if (this.state.password == this.state.passwordCheck) {
            this.setState({valid: true});
        }
        else {
            this.setState({valid: false});
        }
    }

    //TODO check email validity

    componentDidMount() {
        this.props.socket.on('registerAllowed', this._registerAllowed);
    }

    _registerAllowed(result) {
        if (result.status) {     //continue to login
            this.setState({
                buttonName: "Login",
                registerSuccess: true
            })
        }
        else {          //username already exists
            this.set.state({
                validUsername: false
            })
        }
    }

    register(e) {
        e.preventDefault();
        var data = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email
        };

        //send data to backend
        //TODO send data only if it is valid!

        if (this.state.buttonName == "Register") {
            this.props.socket.emit('join', data);
        }
        else {   //successful registration
            this.props.registerSuccess()
        }

    }

    render() {
        return (
            <div className="formContainer">
                <div className="form">
                    <CloseFormButton close={ this.props.close }/>
                    <label>Username:</label>
                    <input type="text"
                           ref="name"
                           onChange={ this.handleUsernameChange }
                           placeholder="username"/>

                    {this.state.validUsername ? null : <div id="alert">Username already exists!</div>}

                    <label>Password:</label>
                    <input type="password"
                           ref="password"
                           onChange={ this.handlePasswordChange }
                           placeholder="password"/>

                    {this.state.weakPassword ? <div id="alert">Password is too weak!</div> : null}

                    <label>Password:</label>
                    <input type="password"
                           ref="password"
                           id={this.state.valid ? "valid" : "invalid"}
                           onChange={ this.handlePasswordCheckChange }
                           onBlur={ this.checkPasswordMatch }
                           placeholder="password"/>

                    {this.state.valid ? null : <div id="alert">Passwords do not match!</div>}

                    <label>Email:</label>
                    <input type="text"
                           ref="email"
                           onChange={ this.handleEmailChange }
                           placeholder="email"/>

                    {this.state.registerSuccess ? <label id="success">Registration was successful!</label> : null}

                    <button onClick={ this.register }>{this.state.buttonName}</button>
                </div>
            </div>
        );
    }
}

export default RegistrationForm;