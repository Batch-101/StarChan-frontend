import styles from '../../styles/Login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';


function SignIn(props) {

    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');


    const checkEntries = () => {

        if (signInEmail.length > 100 || signInPassword.length > 50) {
            // Dans le cas où l'utilisateur à supprimer les "maxLength" des inputs directement dans le DOM du navigateur (avec "inspecter l'élément")
            alert('Veuillez ne pas modifier les éléments du site :)');
            setSignInEmail('');
            setSignInPassword('');
        } else {
            props.handleConnection(signInEmail, signInPassword)
        }
    }

    const onInputChange = (e) => {
        if (e.target.id == 'signInEmail') {
            setSignInEmail(e.target.value)
        } else {
            setSignInPassword(e.target.value)
        }
        // On remet la variable d'état "ConnectingFailed" qui est dans la page "home" à false pour ne plus avoir le message 
        props.resetConnectingFailedVariable();
    }


    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>
            <p className={styles.signTitle}>Connectez-vous</p>

            {props.connectingFailed && <p className={`${styles.warning} ${styles.invalidUser}`}>Le mot de passe est incorrect ou le compte n'existe pas.</p>}

            <div className={styles.signSection}>
                <input className='input register' type="text" placeholder="E-mail" id="signInEmail" onChange={e => onInputChange(e)} onKeyDown={e => e.key == 'Enter' && checkEntries()} value={signInEmail} maxLength={100} />
                <input className='input register' type="password" placeholder="Mot de passe" id="signInPassword" onChange={e => onInputChange(e)} onKeyDown={e => e.key == 'Enter' && checkEntries()} value={signInPassword} maxLength={50} />
                <button className='btn login' id="connection" onClick={() => checkEntries()}>Se connecter</button>
            </div>

        </div >
    )
};

export default SignIn;


