// Array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

export function configureFakeBackend() {
    
    let realFetch = window.fetch;
    
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {

            // Wrap in timeout to simulate server api call
            setTimeout(() => {

                // Authenticate
                if (url.endsWith('/users/authenticate') && opts.method === 'POST') {

                    // Get parameters from post request
                    let params = JSON.parse(opts.body);

                    // Find if any user matches login credentials
                    let filteredUsers = users.filter(user => {
                        return user.username === params.username && user.password === params.password;
                    });

                    if (filteredUsers.length) {
                        // If login details are valid return user details and fake jwt token
                        let user = filteredUsers[0];
                        let responseJson = {
                            id: user.id,
                            username: user.username,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            token: 'fake-token'
                        };
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJson)) });
                    } else {
                        // Else return error
                        reject('Username or password is incorrect');
                    }
                    return;
                }

                // Get users
                if (url.endsWith('/users') && opts.method === 'GET') {

                    // Check for fake auth token in header and return users if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Amitesh fake-token') {
                        resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(users)) });
                    } else {

                        // Return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }
                    return;
                }

                // Get user by id
                if (url.match(/\/users\/\d+$/) && opts.method === 'GET') {

                    // Check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Amitesh fake-token') {

                        // Find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        let matchedUsers = users.filter(user => { return user.id === id; });
                        let user = matchedUsers.length ? matchedUsers[0] : null;

                        // Respond 200 OK with user
                        resolve({ ok: true, text: () => JSON.stringify(user) });
                    } else {
                        // Return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }
                    return;
                }

                // Register user
                if (url.endsWith('/users/register') && opts.method === 'POST') {

                    // Get new user object from post body
                    let newUser = JSON.parse(opts.body);

                    // Validation
                    let duplicateUser = users.filter(user => { return user.username === newUser.username; }).length;
                    if (duplicateUser) {
                        reject('Username "' + newUser.username + '" is already taken');
                        return;
                    }

                    // Save new user
                    newUser.id = users.length ? Math.max(...users.map(user => user.id)) + 1 : 1;
                    users.push(newUser);
                    localStorage.setItem('users', JSON.stringify(users));

                    // Respond 200 OK
                    resolve({ ok: true, text: () => Promise.resolve() });
                    return;
                }

                // Delete user
                if (url.match(/\/users\/\d+$/) && opts.method === 'DELETE') {

                    // Check for fake auth token in header and return user if valid, this security is implemented server side in a real application
                    if (opts.headers && opts.headers.Authorization === 'Amitesh fake-token') {

                        // Find user by id in users array
                        let urlParts = url.split('/');
                        let id = parseInt(urlParts[urlParts.length - 1]);
                        for (let i = 0; i < users.length; i++) {
                            let user = users[i];
                            if (user.id === id) {

                                // Delete user
                                users.splice(i, 1);
                                localStorage.setItem('users', JSON.stringify(users));
                                break;
                            }
                        }
                        // Respond 200 OK
                        resolve({ ok: true, text: () => Promise.resolve() });
                    } else {

                        // Return 401 not authorised if token is null or invalid
                        reject('Unauthorised');
                    }
                    return;
                }
                // Pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));
            }, 500);
        });
    }
}
