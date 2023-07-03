import { useRef, useState, useEffect, useContext } from "react";
import AuthContext from "./context/AuthProvider";
import axios from "./api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useContext(AuthContext);
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log(JSON.stringify(response?.data));
      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      setAuth({ email, pwd, roles, accessToken });
      setEmail("");
      setPwd("");
      setSuccess(true);
    } catch (error) {
      if (!error?.response) {
        setErrMsg("Servidor indisponível");
      } else if (error?.response?.status === 400) {
        setErrMsg("Falta o usuário ou a senha");
      } else if (error?.response?.status === 401) {
        setErrMsg("Usuário ou senha inválidos");
      } else {
        setErrMsg("Erro desconhecido");
      }
      errRef.current.focus();
    }
  };

  return (
    <>
      {success ? (
        <section>
          <h1>Você está logado!</h1>
          <br />
          <p>
            <a href="#">Voltar para o início</a>
          </p>
        </section>
      ) : (
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPwd(e.target.value)}
              value={pwd}
              required
            />
            <button>Login</button>
          </form>
          <p>
            Não tem conta?
            <br />
            <span className="line">
              {/* Router link */}
              <a href=" # ">Cadastre-se</a>
            </span>
          </p>
        </section>
      )}
    </>
  );
};

export default Login;
