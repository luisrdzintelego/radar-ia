import Cookies from 'universal-cookie';

const getCookie = (name) => {
  const cookies = new Cookies();
  return cookies.get(name);
};

const removeCookie = (name) => {
  const cookies = new Cookies();
  cookies.set(name, '', { path: '/', expires: (new Date(Date.now())) });
};

export default { getCookie, removeCookie };