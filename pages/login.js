import styles from '../styles/Login.module.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SignUp from '../components/LoginComps/Signup';
import SignIn from '../components/LoginComps/Signin';
import Modal from 'react-modal';
import { loginUser } from '../reducers/user';
import { useRouter } from 'next/router';


function LoginPage() {

    const user = useSelector(state => state.user.value);

    useEffect(() => {
        if (user.token) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: '#060615'
                }}>
                    <h1>Vous êtes déjà connecté</h1>
                </div>
            )
        }
    }, [])


    const dispatch = useDispatch();
    const router = useRouter();

    const [modalIsOpen, setIsOpen] = useState(false);
    const [isSignIn, setIsSignIn] = useState();


    // Variable d'état qui servira à tenir au courant le composant "Signin" si on a échoué pendant la connexion
    const [connectingFailed, setConnectingFailed] = useState(false);

    // Sert à savoir si on vient du Link "Galerie", "Actus" ou non pour se connecter
    const loginParam = router.query.redirect;


    Modal.setAppElement('body');


    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }


    const handleRegister = async (username, email, password) => {
        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        }

        const response = await fetch('https://starchan-backend.vercel.app/users/signup', config)
        const data = await response.json();

        if (data.result) {
            dispatch(loginUser({ email, token: data.token }));
            if (loginParam == 'gallery') {
                router.push("/gallery");
            } else if (loginParam == 'actus') {
                router.push("/actus");
            } else {
                router.push("/forum");
            }
        }

    };


    const handleConnection = async (email, password) => {

        const config = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        }

        const response = await fetch('https://starchan-backend.vercel.app/users/signin', config)
        const data = await response.json();

        if (data.result) {
            dispatch(loginUser({ email, token: data.token }));
            if (loginParam == 'gallery') {
                router.push("/gallery");
            } else if (loginParam == 'actus') {
                router.push("/actus");
            } else {
                router.push("/forum");
            }
        } else {
            setConnectingFailed(true);
        }
    };

    const resetConnectingFailedVariable = () => {
        connectingFailed && setConnectingFailed(false)
    }


    return (

        <div className={styles.loginBody}>

            <div className={styles.bgContainer}>

                <img className="logo" src="/images/logo.png" alt="Logo" />

            </div>

            <div className={styles.signContainer}>

                <h1 className="title"><p>Décollons vers l'infini</p> <p>et au-delà !</p></h1>

                <h2 className={styles.h2}>Tu ne fais pas encore partie de l'équipage ?</h2>

                <button className='btn logout' onClick={() => { setIsSignIn(false); openModal() }}>S'inscrire</button>

                <h2 className={styles.h2}>Prêt à décoller ? </h2>

                <button className='btn login' onClick={() => { setIsSignIn(true); openModal() }}>Se connecter</button>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    className={styles.Modal}
                    overlayClassName={styles.Overlay}
                    style={customStyles}
                >
                    {
                        isSignIn ? <SignIn handleConnection={handleConnection} closeModal={closeModal} connectingFailed={connectingFailed} resetConnectingFailedVariable={resetConnectingFailedVariable} />
                            : <SignUp handleRegister={handleRegister} closeModal={closeModal} />}
                </Modal>


            </div>

        </div>
    );
}


const customStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        width: '500px',
        marginRight: '-50%',
        transform: 'translate(-50%, -60%)',
        backgroundColor: '#21274A',
        border: "none",
        borderRadius: "10px"

    },
};



export default LoginPage;
