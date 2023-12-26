import styles from '../../styles/Login.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';


function SignUp(props) {

    const [signUpUsername, setSignUpUsername] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Vérification du nom d'utilisateur : autorise les lettres, chiffres, tirets bas et tirets moyens
    const usernameRegex = /^[A-Za-zÀ-Üà-ü0-9_-]+$/;

    // Vérification du format de l'adresse e-mail en utilisant une expression régulière
    const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

    // Vérification des caractères spéciaux dans le nom d'utilisateur
    const checkSpecialCharacter = usernameRegex.test(signUpUsername);

    // Vérification de la longueur du nom d'utilisateur entre 4 et 15 caractères
    const checkUsernameLength = 4 <= signUpUsername.length && signUpUsername.length <= 15;

    // Vérification finale de la validité du nom d'utilisateur
    const isUsernameValid = checkSpecialCharacter && checkUsernameLength;

    // Vérification de la validité de l'adresse e-mail et de sa longueur maximale
    const isEmailValid = emailRegex.test(signUpEmail) && signUpEmail.length <= 100;

    // Vérification de la longueur du mot de passe entre 8 et 50 caractères
    const isPasswordValid = signUpPassword.length >= 8 && signUpPassword.length <= 50;

    // Vérification de la correspondance entre le mot de passe et la confirmation du mot de passe
    const isConfirmPasswordValid = signUpPassword === confirmPassword;

    // Vérification globale de la validité du formulaire
    const isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid;

    const handleClick = () => {
        props.handleRegister(signUpUsername.trim(), signUpEmail.trim(), signUpPassword.trim()) // la méthode trim() permet d'enlever les espaces avant et après la string
    }

    return (
        <div className={styles.container}>
            <div className={styles.xMarkContainer}>
                <FontAwesomeIcon icon={faXmark} className={styles.xMark} onClick={() => props.closeModal()} />
            </div>

            <p className={styles.signTitle}>Inscrivez-vous</p>

            <div className={styles.signSection}>

                <input className='input register' type="text" placeholder="Pseudo" id="signUpUsername" onChange={(e) => setSignUpUsername(e.target.value)} value={signUpUsername} maxLength={15} />

                {/* Affichage du message d'avertissement pour les caractères spéciaux dans le pseudo */}
                {!checkSpecialCharacter && signUpUsername.length > 0
                    && <p className={styles.warning} style={{ marginBottom: 0 }}>Les caractères spéciaux autorisés sont: - et _</p>
                }

                {/* Affichage du message d'avertissement pour la longueur du pseudo */}
                {!checkUsernameLength && signUpUsername.length > 0
                    && <p className={styles.warning}>Votre pseudo doit contenir entre 4 et 15 caractères</p>
                }

                {/* Affichage du message d'avertissement pour une adresse e-mail invalide */}
                <input className='input register' type="email" placeholder="E-mail" id="signUpEmail" onChange={(e) => setSignUpEmail(e.target.value)} value={signUpEmail} maxLength={100} />
                {!isEmailValid && signUpEmail.length > 0
                    && <p className={styles.warning}>Veuillez entrer un email valide</p>
                }

                {/* Affichage du message d'avertissement pour la longueur du mot de passe */}
                <input className='input register' type="password" placeholder="Mot de passe" id="signUpPassword" onChange={(e) => setSignUpPassword(e.target.value)} value={signUpPassword} maxLength={50} />
                {!isPasswordValid && signUpPassword.length > 0
                    && <p className={styles.warning}>Votre mot de passe doit contenir au moins 8 caractères</p>
                }

                {/* Affichage du message d'avertissement pour la confirmation du mot de passe */}
                <input className='input register' type="password" placeholder="Confirmer votre mot de passe" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} maxLength={50} />
                {!isConfirmPasswordValid && confirmPassword.length > 0
                    && <p className={styles.warning}>Les mots de passe doivent être identiques</p>
                }

                {/* Affichage du bouton "S'inscrire" activé ou désactivé en fonction de la validité du formulaire */}
                {isFormValid
                    ?
                    <button className={'btn logout'} id="connection" onClick={() => handleClick()}>S'inscrire</button>
                    :
                    <button className={`btn ${styles.disabled}`}>S'inscrire</button>
                }
            </div>
        </div>
    );




}

export default SignUp