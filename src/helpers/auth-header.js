export function authHeader() {
    // Return authorization header with jwt token
    let user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': 'Amitesh ' + user.token };
    } else {
        return {};
    }
}
