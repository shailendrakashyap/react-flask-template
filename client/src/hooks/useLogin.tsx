import { useCookies } from "react-cookie";

const useLogin = () => {
  // eslint-disable-next-line
  const [_cookies, setCookie, removeCookie] = useCookies([
    "token",
    "uid",
    "email",
    "name"
  ]);

  const redirectToDopeAuth = () => {
    window.location.href =
      "https://dopeauth.com/login/" +
      encodeURIComponent(process.env.REACT_APP_CALLBACKURL || "");
  };

  const login = async (
    id: string,
    email: string,
    token: string
  ): Promise<Boolean> => {
    try {
      const config = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          token: token,
          id: id
        })
      };
      // This is a client side check, however server side checks are also necessary!
      // Here we don't do a callback verify but on server side we want it
      const response = await fetch(
        "https://dopeauth.com/api/v1/site/verify",
        config
      );
      if (response.ok) {
        const json = await response.json();
        if (json["success"]) {
          setCookie("token", token, { path: "/" });
          setCookie("uid", id, { path: "/" });
          setCookie("email", email, { path: "/" });
          setCookie("name", email, { path: "/" });
          return true;
        }
      }
    } catch (error) {}
    return false;
  };
  const getCredentials = () => {
    return {
      email: cookies["email"],
      uid: cookies["uid"],
      token: cookies["token"]
    };
  };
  const logout = () => {
    removeCookie("name");
    removeCookie("token");
    removeCookie("uid");
    removeCookie("email");
  };
  return { redirectToDopeAuth, getCredentials, login, logout };
};

export default useLogin;
