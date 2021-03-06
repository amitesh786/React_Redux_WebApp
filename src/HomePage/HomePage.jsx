import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../actions';

class HomePage extends React.Component {
    
    componentDidMount() {
        this.props.dispatch(userActions.getAll());
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.delete(id));
    }

    render() {
        const { user, users } = this.props;
        const userItems = [];       

        if (users.items && (users.items.length > 0) ) {
            for(let i=0; i<users.items.length; i++) {
                if(user.firstName === 'Admin' && user.lastName === 'Admin') {
                    if (users.items[i].firstName != 'Admin') { userItems.push(users.items[i]);}
                    else {continue;}
                }else if ((user.firstName === users.items[i].firstName) && (user.lastName === users.items[i].lastName)) {
                    userItems.push(users.items[i]);
                }
            }
        }

        return (
            <div className="col-md-12 col-md-offset-1 homepage-content">

                <div>
                    <h3>Hi {user.firstName}!</h3>
                    <p>You're logged in with React - Redux!!</p>

                    <h3>All users registered:</h3>

                    {users.loading && <em>Loading users...</em>}
                    {users.error && <span className="text-danger">ERROR: {users.error}</span>}

                    {userItems &&
                        <ul>
                            {userItems.map((user, index) =>
                                <li key={user.id}>
                                    {user.firstName + ' ' + user.lastName}
                                    {
                                        user.deleting ? <em> - Deleting...</em>
                                            : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                                : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                    }
                                </li>
                            )}
                        </ul>
                    }
                </div>

                <span className="link-logout"><Link to="/login">Logout</Link></span>
            </div>
        );
    }
}

function mapStateToProps(state) {    
    const { users, authentication } = state;
    const { user } = authentication;
    
    return {
        user,
        users
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export { connectedHomePage as HomePage };
