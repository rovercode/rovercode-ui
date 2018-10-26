import jwtDecode from 'jwt-decode';

class AuthApi {
  // From: https://www.w3schools.com/js/js_cookies.asp
  getCookie = /* istanbul ignore next */ (cname) => {
    const name = `${cname}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  };

  userData = () => {
    const authJwt = this.getCookie('auth_jwt');
    if (!authJwt) {
      return {};
    }

    try {
      return jwtDecode(authJwt);
    } catch (InvalidTokenError) {
      return {};
    }
  };
}

export default AuthApi;
